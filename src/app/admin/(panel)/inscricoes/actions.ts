"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { requireAdmin } from "@/lib/session";
import { confirmEnrollment, cancelEnrollment } from "@/lib/enrollments";

const schema = z.object({ id: z.string().uuid(), op: z.enum(["confirm", "cancel"]) });
export async function decide(formData: FormData) {
  const admin = await requireAdmin();
  const { id, op } = schema.parse(Object.fromEntries(formData));
  try { op === "confirm" ? await confirmEnrollment(db, id, admin.id) : await cancelEnrollment(db, id, admin.id); } catch { /* sem vagas: permanece solicitada */ }
  revalidatePath("/admin/inscricoes");
}
