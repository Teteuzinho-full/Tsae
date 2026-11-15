"use server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { courses, auditLogs } from "@/db/schema";
import { requireAdmin } from "@/lib/session";

const input = z.object({ id: z.string().uuid(), priceBrl: z.preprocess((v) => (v === "" ? null : v), z.coerce.number().min(0).max(100000).nullable()), status: z.enum(["DRAFT", "PENDING_REVIEW", "PUBLISHED", "ARCHIVED"]) });

export async function updateCourse(formData: FormData) {
  const admin = await requireAdmin(); // revalida no servidor em toda ação
  const p = input.parse(Object.fromEntries(formData)); // só campos permitidos (anti mass assignment)
  await db.update(courses).set({ priceBrl: p.priceBrl == null ? null : p.priceBrl.toFixed(2), status: p.status, updatedAt: new Date() }).where(eq(courses.id, p.id));
  await db.insert(auditLogs).values({ actorId: admin.id, action: `update:price=${p.priceBrl ?? "consultar"},status=${p.status}`, entity: "course", entityId: p.id });
  revalidatePath("/admin/cursos");
}
