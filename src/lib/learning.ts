import { and, asc, eq } from "drizzle-orm";
import { db as defaultDb } from "../db";
import { courseLessons, courseModules, lessonProgress, quizzes, quizQuestions, quizAttempts } from "../db/schema";
import { canAccessCourse } from "./enrollments";

type Db = typeof defaultDb;

export async function markLessonDone(db: Db, userId: string, lessonId: string) {
  const [l] = await db.select({ courseId: courseModules.courseId }).from(courseLessons).innerJoin(courseModules, eq(courseModules.id, courseLessons.moduleId)).where(eq(courseLessons.id, lessonId));
  if (!l || !(await canAccessCourse(db, userId, l.courseId))) throw new Error("FORBIDDEN");
  await db.insert(lessonProgress).values({ userId, lessonId }).onConflictDoNothing();
}

// Correção no servidor: o gabarito nunca é enviado ao navegador.
export async function submitQuiz(db: Db, userId: string, quizId: string, answers: number[]) {
  const [q] = await db.select().from(quizzes).where(eq(quizzes.id, quizId));
  if (!q || !(await canAccessCourse(db, userId, q.courseId))) throw new Error("FORBIDDEN");
  const qs = await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quizId)).orderBy(asc(quizQuestions.position));
  const score = qs.filter((x, i) => answers[i] === x.correctIndex).length;
  await db.insert(quizAttempts).values({ quizId, userId, score, total: qs.length });
  return { score, total: qs.length };
}

export async function lastAttempt(db: Db, userId: string, quizId: string) {
  const rows = await db.select().from(quizAttempts).where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.quizId, quizId)));
  return rows.sort((a, b) => +b.createdAt - +a.createdAt)[0] ?? null;
}
