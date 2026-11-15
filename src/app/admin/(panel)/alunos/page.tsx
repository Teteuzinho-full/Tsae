import { asc, isNull, ne, or } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { user } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { setBan } from "@/lib/moderation";

async function toggle(fd: FormData) {
  "use server";
  const a = await requireAdmin();
  const p = z.object({ id: z.string().min(1).max(100), ban: z.enum(["true", "false"]), reason: z.string().max(200).optional() }).parse(Object.fromEntries(fd));
  try { await setBan(db, a.id, p.id, p.ban === "true", p.reason); } catch { /* admin/próprio usuário: ignorado */ }
  revalidatePath("/admin/alunos");
}

export default async function Students() {
  const rows = await db.select().from(user).where(or(isNull(user.role), ne(user.role, "admin"))).orderBy(asc(user.name)).limit(500);
  return (<><h1 className="text-3xl font-bold">Alunos ({rows.length})</h1>
    <div className="mt-8 grid gap-3">{rows.length === 0 && <p className="text-graphite/60">Nenhum aluno cadastrado.</p>}
      {rows.map((u) => (<form key={u.id} action={toggle} className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4">
        <input type="hidden" name="id" value={u.id} /><input type="hidden" name="ban" value={String(!u.banned)} />
        <div className="min-w-60 flex-1"><p className="font-medium">{u.name}</p><p className="text-sm text-graphite/60">{u.email}{u.banned && <b className="ml-2 text-brand-red">bloqueado</b>}</p></div>
        {!u.banned && <input name="reason" placeholder="Motivo (opcional)" className="rounded-lg border border-black/15 px-3 py-1.5 text-sm" />}
        <button className="rounded-full bg-graphite px-4 py-1.5 text-sm text-white">{u.banned ? "Desbloquear" : "Bloquear"}</button></form>))}</div></>);
}
