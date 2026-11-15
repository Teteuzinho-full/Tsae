import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { accountFlags, auditLogs } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getAdminSession } from "@/lib/session";
export const dynamic = "force-dynamic";

async function change(formData: FormData) {
  "use server";
  const admin = await getAdminSession();
  const p = z.object({ current: z.string().min(1).max(128), next: z.string().min(12).max(128) }).parse(Object.fromEntries(formData));
  if (p.current === p.next) throw new Error("A nova senha deve ser diferente");
  await auth.api.changePassword({ body: { currentPassword: p.current, newPassword: p.next, revokeOtherSessions: true }, headers: await headers() });
  await db.update(accountFlags).set({ mustChangePassword: false, updatedAt: new Date() }).where(eq(accountFlags.userId, admin.id));
  await db.insert(auditLogs).values({ actorId: admin.id, action: "password:changed", entity: "user", entityId: admin.id });
  redirect("/admin");
}

export default async function ChangePassword() {
  await getAdminSession();
  const i = "w-full rounded-xl border border-black/15 px-4 py-3";
  return (<main className="mx-auto grid min-h-screen max-w-sm place-items-center px-5"><form action={change} className="grid w-full gap-4">
    <h1 className="text-2xl font-bold">Defina uma nova senha</h1>
    <p className="text-sm text-graphite/70">Obrigatório no primeiro acesso. Use 12 ou mais caracteres.</p>
    <input name="current" type="password" required autoComplete="current-password" placeholder="Senha atual" className={i} />
    <input name="next" type="password" required minLength={12} autoComplete="new-password" placeholder="Nova senha" className={i} />
    <button className="rounded-full bg-brand-red px-7 py-3 font-semibold text-white">Salvar</button></form></main>);
}
