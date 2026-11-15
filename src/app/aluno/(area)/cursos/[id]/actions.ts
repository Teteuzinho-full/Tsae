"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { requireUser } from "@/lib/session";
import { markLessonDone, submitQuiz } from "@/lib/learning";

export async function completeLesson(formData: FormData) {
  const user = await requireUser();
  const { lessonId } = z.object({ lessonId: z.string().uuid() }).parse(Object.fromEntries(formData));
  await markLessonDone(db, user.id, lessonId);
  revalidatePath("/aluno/cursos/[id]", "page");
}

export async function answerQuiz(formData: FormData) {
  const user = await requireUser();
  const quizId = z.string().uuid().parse(formData.get("quizId"));
  const answers: number[] = [];
  for (const [k, v] of formData.entries()) {
    const m = /^a(\d{1,2})$/.exec(k);
    if (m) answers[Number(m[1])] = z.coerce.number().int().min(0).max(10).parse(v);
  }
  await submitQuiz(db, user.id, quizId, answers);
  revalidatePath("/aluno/cursos/[id]", "page");
}
