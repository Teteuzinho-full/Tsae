// Uso: node --env-file=.env.local node_modules/tsx/dist/cli.mjs scripts/seed.ts   (ou: npm run db:seed)
import { db } from "../src/db";
import { courses as courseTable, courseCategories, courseModules, courseLessons, seoKeywords, quizzes, quizQuestions } from "../src/db/schema";
import { statSync } from "node:fs";
import { eq } from "drizzle-orm";
import { courses as drafts } from "../src/data/courses";
import { liveCourses } from "../src/data/live-courses";
import { mediaAssets } from "../src/db/schema";
const courses = [...liveCourses, ...drafts];
import { allKeywords } from "../src/data/keywords";

const slugify = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function coverId(url?: string, alt = "") {
  if (!url) return null;
  const blobPath = `local${url}`; // imagem local em /public; substituir por Vercel Blob via painel > Mídia
  await db.insert(mediaAssets).values({ url, blobPath, mime: "image/jpeg", sizeBytes: statSync(`public${url}`).size, alt }).onConflictDoNothing();
  return (await db.select().from(mediaAssets).where(eq(mediaAssets.blobPath, blobPath)))[0].id;
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL ausente");
  for (const name of [...new Set(courses.map((c) => c.category))])
    await db.insert(courseCategories).values({ name, slug: slugify(name) }).onConflictDoNothing();
  const cats = await db.select().from(courseCategories);
  for (const c of courses) {
    const [row] = await db.insert(courseTable).values({
      slug: c.slug, title: c.title, subtitle: c.subtitle, description: c.description, categoryId: cats.find((k) => k.name === c.category)!.id,
      objectives: c.objectives.join("\n"), audience: c.audience, prerequisites: c.prerequisites, referencesText: c.references.join("\n"),
      workloadHours: c.hours || null, priceBrl: c.priceBrl == null ? null : c.priceBrl.toFixed(2), status: "PENDING_REVIEW",
      startsAt: c.startsAt ? new Date(c.startsAt) : null, format: c.format ?? null, instructors: (c.instructors ?? []).join("\n") || null, soldOut: !!c.soldOut,
      coverAssetId: await coverId(c.image, `Flyer: ${c.title}`),
    }).onConflictDoNothing().returning({ id: courseTable.id });
    if (!row) continue; // já existe: não sobrescreve edições do admin
    for (const [mi, m] of c.modules.entries()) {
      const [mod] = await db.insert(courseModules).values({ courseId: row.id, title: m.title, position: mi + 1 }).returning({ id: courseModules.id });
      await db.insert(courseLessons).values(m.lessons.map((l, li) => ({ moduleId: mod.id, title: l.title, content: l.summary, position: li + 1 })));
    }
    const [qz] = await db.insert(quizzes).values({ courseId: row.id, title: `Avaliação — ${c.title}` }).onConflictDoNothing().returning({ id: quizzes.id });
    if (qz) await db.insert(quizQuestions).values(c.quiz.map((q, i) => ({ quizId: qz.id, prompt: q.q, options: q.options, correctIndex: q.answer, position: i + 1 })));
  }
  await db.insert(seoKeywords).values(allKeywords).onConflictDoNothing();
  console.log("Seed concluído");
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
