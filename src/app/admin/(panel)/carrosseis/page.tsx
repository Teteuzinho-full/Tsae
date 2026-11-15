import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { carouselSlides, auditLogs } from "@/db/schema";
import { requireAdmin } from "@/lib/session";

const href = z.string().max(300).refine((v) => v === "" || v.startsWith("/") && !v.startsWith("//") || /^https:\/\//.test(v), "Link inválido");
async function create(fd: FormData) {
  "use server";
  const a = await requireAdmin();
  const p = z.object({ unit: z.enum(["CONSULTORIA", "EDUCA"]), title: z.string().min(2).max(160), description: z.string().max(400), href, position: z.coerce.number().int().min(0).max(99) }).parse(Object.fromEntries(fd));
  const [r] = await db.insert(carouselSlides).values({ ...p, href: p.href || null }).returning();
  await db.insert(auditLogs).values({ actorId: a.id, action: "carousel:create", entity: "carousel", entityId: r.id });
  revalidatePath("/admin/carrosseis");
}
async function toggle(fd: FormData) {
  "use server";
  const a = await requireAdmin();
  const p = z.object({ id: z.string().uuid(), active: z.enum(["true", "false"]) }).parse(Object.fromEntries(fd));
  await db.update(carouselSlides).set({ active: p.active === "true", updatedAt: new Date() }).where(eq(carouselSlides.id, p.id));
  await db.insert(auditLogs).values({ actorId: a.id, action: `carousel:active=${p.active}`, entity: "carousel", entityId: p.id });
  revalidatePath("/admin/carrosseis");
}

async function update(fd: FormData) {
  "use server";
  const a = await requireAdmin();
  const { id, href: h, ...p } = z.object({ id: z.string().uuid(), title: z.string().min(2).max(160), description: z.string().max(400), href, position: z.coerce.number().int().min(0).max(99) }).parse(Object.fromEntries(fd));
  await db.update(carouselSlides).set({ ...p, href: h || null, updatedAt: new Date() }).where(eq(carouselSlides.id, id));
  await db.insert(auditLogs).values({ actorId: a.id, action: "carousel:update", entity: "carousel", entityId: id });
  revalidatePath("/admin/carrosseis");
}
async function remove(fd: FormData) {
  "use server";
  const a = await requireAdmin();
  const { id } = z.object({ id: z.string().uuid() }).parse(Object.fromEntries(fd));
  await db.delete(carouselSlides).where(eq(carouselSlides.id, id));
  await db.insert(auditLogs).values({ actorId: a.id, action: "carousel:delete", entity: "carousel", entityId: id });
  revalidatePath("/admin/carrosseis");
}

export default async function Carousels() {
  const rows = await db.select().from(carouselSlides).orderBy(asc(carouselSlides.unit), asc(carouselSlides.position));
  const f = "rounded-lg border border-black/15 px-3 py-2";
  return (<><h1 className="text-3xl font-bold">Carrosséis</h1>
    <form action={create} className="mt-6 grid gap-3 rounded-2xl bg-white p-5 sm:grid-cols-2">
      <select name="unit" className={f}><option>CONSULTORIA</option><option>EDUCA</option></select>
      <input name="position" type="number" min="0" defaultValue="0" className={f} aria-label="Ordem" />
      <input name="title" required placeholder="Título" className={f} /><input name="href" placeholder="Link (/educa ou https://…)" className={f} />
      <input name="description" placeholder="Descrição" className={`${f} sm:col-span-2`} />
      <button className="w-fit rounded-full bg-brand-red px-5 py-2 text-sm font-semibold text-white">Criar slide</button></form>
    <div className="mt-6 grid gap-3">{rows.map((r) => (<form key={r.id} action={update} className="grid gap-2 rounded-2xl bg-white p-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={r.id} />
      <p className="text-xs font-bold sm:col-span-2">{r.unit} · {r.active ? "ativo" : "inativo"}</p>
      <input name="title" defaultValue={r.title} required className={f} aria-label="Título" /><input name="position" type="number" min="0" defaultValue={r.position} className={f} aria-label="Ordem" />
      <input name="description" defaultValue={r.description ?? ""} className={`${f} sm:col-span-2`} aria-label="Descrição" /><input name="href" defaultValue={r.href ?? ""} placeholder="Link" className={`${f} sm:col-span-2`} aria-label="Link" />
      <div className="flex gap-2 sm:col-span-2"><button className="rounded-full bg-brand-red px-4 py-1.5 text-sm font-semibold text-white">Salvar</button>
        <button formAction={toggle} name="active" value={String(!r.active)} className="rounded-full bg-graphite px-4 py-1.5 text-sm text-white">{r.active ? "Desativar" : "Ativar"}</button>
        <button formAction={remove} className="px-2 text-sm underline">Excluir</button></div></form>))}</div></>);
}
