"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { requireUser } from "@/lib/session";
import { requestEnrollment } from "@/lib/enrollments";

export async function requestCourse(formData: FormData) {
  const user = await requireUser(); // userId vem da sessão, nunca do formulário
  const { courseId } = z.object({ courseId: z.string().uuid() }).parse(Object.fromEntries(formData));
  await requestEnrollment(db, user.id, courseId);
  revalidatePath("/aluno");
}
