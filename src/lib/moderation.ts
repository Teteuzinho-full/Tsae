import { eq } from "drizzle-orm";
import { db as defaultDb } from "../db";
import { user, session, auditLogs } from "../db/schema";
type Db = typeof defaultDb;

// Bloqueia/desbloqueia aluno. Admins e o próprio ator são protegidos; o bloqueio derruba as sessões abertas.
export async function setBan(db: Db, actorId: string, targetId: string, banned: boolean, reason?: string) {
  if (actorId === targetId) throw new Error("PROPRIO_USUARIO");
  const [t] = await db.select().from(user).where(eq(user.id, targetId));
  if (!t) throw new Error("NAO_ENCONTRADO");
  if (t.role === "admin") throw new Error("ADMIN_PROTEGIDO");
  await db.update(user).set({ banned, banReason: banned ? (reason?.slice(0, 200) || "Bloqueado pelo administrador") : null, banExpires: null, updatedAt: new Date() }).where(eq(user.id, targetId));
  if (banned) await db.delete(session).where(eq(session.userId, targetId));
  await db.insert(auditLogs).values({ actorId, action: banned ? "student:ban" : "student:unban", entity: "user", entityId: targetId });
}
