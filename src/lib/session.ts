import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "./auth";
import { db } from "../db";
import { accountFlags } from "../db/schema";

// Autorização SEMPRE no servidor: papel vem da sessão no banco, nunca do cliente.
export async function getAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin" || session.user.banned) redirect("/admin/login");
  return session.user;
}

export async function requireAdmin() {
  const user = await getAdminSession();
  const [flag] = await db.select().from(accountFlags).where(eq(accountFlags.userId, user.id));
  if (flag?.mustChangePassword) redirect("/admin/trocar-senha");
  return user;
}

export async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.banned) redirect("/aluno/login");
  return session.user;
}
