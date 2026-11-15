import { asc, eq } from "drizzle-orm";
import { db } from "../db";
import { courses as courseTable, courseCategories, courseModules, courseLessons, mediaAssets } from "../db/schema";
import { courses as draftCourses } from "../data/courses";
import { liveCourses } from "../data/live-courses";
import { availability, rank, type Availability } from "./availability";

export type PublicCourse = {
  slug: string; title: string; subtitle: string; category: string; hours: number; priceBrl: number | null; description: string;
  objectives: string[]; audience: string; prerequisites: string; modules: { title: string; lessons: { title: string }[] }[];
  image: string | null; gallery: string[]; startsAt: string | null; format: string | null; instructors: string[]; soldOut: boolean; availability: Availability;
};

const fromStatic = (c: (typeof draftCourses)[number]): PublicCourse => ({
  slug: c.slug, title: c.title, subtitle: c.subtitle, category: c.category, hours: c.hours, priceBrl: c.priceBrl, description: c.description,
  objectives: c.objectives, audience: c.audience, prerequisites: c.prerequisites, modules: c.modules,
  image: c.image ?? null, gallery: c.gallery ?? [], startsAt: c.startsAt ?? null, format: c.format ?? null, instructors: c.instructors ?? [], soldOut: !!c.soldOut,
  availability: c.live ? availability(c) : "EM_BREVE",
});
const sortCourses = (l: PublicCourse[]) => [...l].sort((a, b) => rank[a.availability] - rank[b.availability] || Number(!!b.image) - Number(!!a.image) || (a.startsAt ?? "9").localeCompare(b.startsAt ?? "9"));

// Sem DATABASE_URL (demonstração local): usa os rascunhos em arquivo. Com banco: SOMENTE cursos PUBLISHED.
export async function getCourses(): Promise<PublicCourse[]> {
  if (!process.env.DATABASE_URL) return sortCourses([...liveCourses, ...draftCourses].map(fromStatic));
  const rows = await db.select({ c: courseTable, cat: courseCategories.name, img: mediaAssets.url }).from(courseTable)
    .leftJoin(courseCategories, eq(courseCategories.id, courseTable.categoryId)).leftJoin(mediaAssets, eq(mediaAssets.id, courseTable.coverAssetId))
    .where(eq(courseTable.status, "PUBLISHED")).orderBy(asc(courseTable.title));
  return sortCourses(rows.map(({ c, cat, img }) => ({ slug: c.slug, title: c.title, subtitle: c.subtitle ?? "", category: cat ?? "", hours: c.workloadHours ?? 0,
    priceBrl: c.priceBrl == null ? null : Number(c.priceBrl), description: c.description, objectives: (c.objectives ?? "").split("\n").filter(Boolean),
    audience: c.audience ?? "", prerequisites: c.prerequisites ?? "", modules: [], image: img ?? null, gallery: [], startsAt: c.startsAt?.toISOString() ?? null,
    format: c.format, instructors: (c.instructors ?? "").split("\n").filter(Boolean), soldOut: c.soldOut, availability: availability(c) })));
}

export async function getCourse(slug: string): Promise<PublicCourse | null> {
  if (!process.env.DATABASE_URL) return (await getCourses()).find((c) => c.slug === slug) ?? null;
  const base = (await getCourses()).find((c) => c.slug === slug);
  if (!base) return null;
  const [row] = await db.select({ id: courseTable.id }).from(courseTable).where(eq(courseTable.slug, slug));
  const mods = await db.select().from(courseModules).where(eq(courseModules.courseId, row.id)).orderBy(asc(courseModules.position));
  const modules = await Promise.all(mods.map(async (m) => ({ title: m.title, lessons: await db.select({ title: courseLessons.title }).from(courseLessons).where(eq(courseLessons.moduleId, m.id)).orderBy(asc(courseLessons.position)) })));
  return { ...base, modules };
}
