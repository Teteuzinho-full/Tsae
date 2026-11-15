"use server";
import { z } from "zod";
import { eq, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { courses, courseModules, courseLessons } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { audit } from "@/lib/audit";

const uuid = z.string().uuid();
const refresh = () => revalidatePath("/admin/cursos/[id]", "page");
const optInt = z.preprocess((v) => (v === "" || v == null ? null : v), z.coerce.number().int().min(0).max(100000).nullable());

export async function updateMeta(fd: FormData) {
  const a = await requireAdmin();
  const p = z.object({
    id: uuid, title: z.string().trim().min(3).max(200), subtitle: z.string().max(300), description: z.string().trim().min(10).max(5000),
    workloadHours: optInt, seats: optInt, startsAt: z.string().max(30), format: z.string().max(200), instructors: z.string().max(2000),
  }).parse(Object.fromEntries(fd));
  const starts = p.startsAt ? new Date(`${p.startsAt}:00-03:00`) : null; // horário de Brasília
  if (starts && isNaN(+starts)) throw new Error("Data inválida");
  await db.update(courses).set({ title: p.title, subtitle: p.subtitle || null, description: p.description, workloadHours: p.workloadHours, seats: p.seats, startsAt: starts,
    format: p.format || null, instructors: p.instructors.trim() || null, soldOut: fd.get("soldOut") === "on", updatedAt: new Date() }).where(eq(courses.id, p.id));
  await audit(a.id, "course:update-meta", "course", p.id); refresh();
}
export async function addModule(fd: FormData) {
  const a = await requireAdmin();
  const p = z.object({ courseId: uuid, title: z.string().trim().min(2).max(200) }).parse(Object.fromEntries(fd));
  const [m] = await db.select({ v: max(courseModules.position) }).from(courseModules).where(eq(courseModules.courseId, p.courseId));
  const [r] = await db.insert(courseModules).values({ courseId: p.courseId, title: p.title, position: (m?.v ?? 0) + 1 }).returning();
  await audit(a.id, "module:create", "module", r.id); refresh();
}
export async function updateModule(fd: FormData) {
  const a = await requireAdmin();
  const p = z.object({ id: uuid, title: z.string().trim().min(2).max(200), position: z.coerce.number().int().min(1).max(999) }).parse(Object.fromEntries(fd));
  await db.update(courseModules).set({ title: p.title, position: p.position, updatedAt: new Date() }).where(eq(courseModules.id, p.id));
  await audit(a.id, "module:update", "module", p.id); refresh();
}
export async function deleteModule(fd: FormData) {
  const a = await requireAdmin();
  const { id } = z.object({ id: uuid }).parse(Object.fromEntries(fd));
  await db.delete(courseModules).where(eq(courseModules.id, id)); // aulas saem em cascata
  await audit(a.id, "module:delete", "module", id); refresh();
}
export async function addLesson(fd: FormData) {
  const a = await requireAdmin();
  const p = z.object({ moduleId: uuid, title: z.string().trim().min(2).max(200) }).parse(Object.fromEntries(fd));
  const [m] = await db.select({ v: max(courseLessons.position) }).from(courseLessons).where(eq(courseLessons.moduleId, p.moduleId));
  const [r] = await db.insert(courseLessons).values({ moduleId: p.moduleId, title: p.title, content: "Conteúdo a desenvolver.", position: (m?.v ?? 0) + 1 }).returning();
  await audit(a.id, "lesson:create", "lesson", r.id); refresh();
}
export async function updateLesson(fd: FormData) {
  const a = await requireAdmin();
  const p = z.object({ id: uuid, title: z.string().trim().min(2).max(200), content: z.string().trim().min(1).max(50000), position: z.coerce.number().int().min(1).max(999) }).parse(Object.fromEntries(fd));
  await db.update(courseLessons).set({ title: p.title, content: p.content, position: p.position, updatedAt: new Date() }).where(eq(courseLessons.id, p.id));
  await audit(a.id, "lesson:update", "lesson", p.id); refresh();
}
export async function deleteLesson(fd: FormData) {
  const a = await requireAdmin();
  const { id } = z.object({ id: uuid }).parse(Object.fromEntries(fd));
  await db.delete(courseLessons).where(eq(courseLessons.id, id));
  await audit(a.id, "lesson:delete", "lesson", id); refresh();
}
