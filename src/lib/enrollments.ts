import { and, eq, sql } from "drizzle-orm";
import { db as defaultDb } from "../db";
import { courses, courseEnrollments, auditLogs } from "../db/schema";
import { availability } from "./availability";

type Db = typeof defaultDb;

export async function requestEnrollment(db: Db, userId: string, courseId: string) {
  const [course] = await db.select().from(courses).where(and(eq(courses.id, courseId), eq(courses.status, "PUBLISHED")));
  if (!course) throw new Error("CURSO_INDISPONIVEL");
  if (availability(course) !== "ABERTO") throw new Error("INSCRICOES_ENCERRADAS"); // esgotado ou turma já realizada
  const [row] = await db.insert(courseEnrollments).values({ userId, courseId }).onConflictDoNothing().returning();
  return row ?? null; // null = já existia solicitação
}

// Confirmação atômica: o limite de vagas é verificado no próprio UPDATE (sem corrida entre admins).
export async function confirmEnrollment(db: Db, enrollmentId: string, actorId: string) {
  const [row] = await db.update(courseEnrollments).set({ status: "CONFIRMED", updatedAt: new Date() }).where(and(
    eq(courseEnrollments.id, enrollmentId), eq(courseEnrollments.status, "REQUESTED"),
    sql`((select seats from courses c where c.id = ${courseEnrollments.courseId}) is null or
          (select count(*) from course_enrollments e where e.course_id = ${courseEnrollments.courseId} and e.status = 'CONFIRMED') <
          (select seats from courses c where c.id = ${courseEnrollments.courseId}))`,
  )).returning();
  if (!row) throw new Error("SEM_VAGAS_OU_INVALIDA");
  await db.insert(auditLogs).values({ actorId, action: "enrollment:confirm", entity: "enrollment", entityId: enrollmentId });
  return row;
}

export async function cancelEnrollment(db: Db, enrollmentId: string, actorId: string) {
  const [row] = await db.update(courseEnrollments).set({ status: "CANCELLED", updatedAt: new Date() }).where(eq(courseEnrollments.id, enrollmentId)).returning();
  if (row) await db.insert(auditLogs).values({ actorId, action: "enrollment:cancel", entity: "enrollment", entityId: enrollmentId });
  return row ?? null;
}

// Regra de acesso: só inscrição CONFIRMADA do próprio usuário libera o conteúdo (anti-IDOR).
export async function canAccessCourse(db: Db, userId: string, courseId: string) {
  const [r] = await db.select({ id: courseEnrollments.id }).from(courseEnrollments)
    .where(and(eq(courseEnrollments.userId, userId), eq(courseEnrollments.courseId, courseId), eq(courseEnrollments.status, "CONFIRMED")));
  return !!r;
}
