import { describe, it, expect, beforeAll } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "../src/db/schema";
import { markLessonDone, submitQuiz, lastAttempt } from "../src/lib/learning";
import { requestEnrollment, confirmEnrollment } from "../src/lib/enrollments";

let db: ReturnType<typeof drizzle<typeof schema>>; let d: never;
let lessonId: string, quizId: string;

beforeAll(async () => {
  db = drizzle(new PGlite(), { schema }); d = db as never;
  await migrate(db, { migrationsFolder: "./drizzle" });
  for (const id of ["ok", "intruso", "admin"]) await db.insert(schema.user).values({ id, name: id, email: `${id}@t.local`, emailVerified: false });
  const [c] = await db.insert(schema.courses).values({ slug: "c", title: "C", description: "x", status: "PUBLISHED" }).returning();
  const [m] = await db.insert(schema.courseModules).values({ courseId: c.id, title: "M", position: 1 }).returning();
  const [l] = await db.insert(schema.courseLessons).values({ moduleId: m.id, title: "L", content: "x", position: 1 }).returning();
  const [q] = await db.insert(schema.quizzes).values({ courseId: c.id, title: "Q" }).returning();
  await db.insert(schema.quizQuestions).values([{ quizId: q.id, prompt: "a", options: ["x", "y"], correctIndex: 1, position: 1 }, { quizId: q.id, prompt: "b", options: ["x", "y"], correctIndex: 0, position: 2 }]);
  lessonId = l.id; quizId = q.id;
  const e = await requestEnrollment(d, "ok", c.id); await confirmEnrollment(d, e!.id, "admin");
});

describe("progresso e questionários", () => {
  it("aluno sem inscrição confirmada não conclui aula nem responde questionário", async () => {
    await expect(markLessonDone(d, "intruso", lessonId)).rejects.toThrow("FORBIDDEN");
    await expect(submitQuiz(d, "intruso", quizId, [1, 0])).rejects.toThrow("FORBIDDEN");
  });
  it("aluno confirmado conclui aula (idempotente)", async () => {
    await markLessonDone(d, "ok", lessonId); await markLessonDone(d, "ok", lessonId);
    expect(await db.select().from(schema.lessonProgress)).toHaveLength(1);
  });
  it("corrige no servidor e registra a tentativa", async () => {
    expect(await submitQuiz(d, "ok", quizId, [1, 1])).toEqual({ score: 1, total: 2 });
    expect(await submitQuiz(d, "ok", quizId, [1, 0])).toEqual({ score: 2, total: 2 });
    expect((await lastAttempt(d, "ok", quizId))?.total).toBe(2);
  });
});
