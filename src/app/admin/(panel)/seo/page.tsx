import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { seoKeywords } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { audit } from "@/lib/audit";

const path = z.string().trim().max(200).refine((v) => v === "" || (v.startsWith("/") && !v.startsWith("//")), "Destino deve começar com /");
const fields = { keyword: z.string().trim().min(3).max(120), unit: z.enum(["CONSULTORIA", "EDUCA"]), category: z.string().trim().min(2).max(80), intent: z.enum(["COMERCIAL", "INFORMACIONAL", "NAVEGACIONAL"]), landingPath: path, priority: z.coerce.number().int().min(1).max(3) };

async function save(fd: FormData) {
  "use server";
  const a = await requireAdmin();
  const p = z.object({ id: z.string().uuid(), ...fields }).parse(Object.fromEntries(fd));
  const { id, landingPath, ...rest } = p;
  await db.update(seoKeywords).set({ ...rest, landingPath: landingPath || null, implemented: fd.get("implemented") === "on", demandValidated: fd.get("demandValidated") === "on", updatedAt: new Date() }).where(eq(seoKeywords.id, id));
  await audit(a.id, "seo:update", "seo_keyword", id); revalidatePath("/admin/seo");
}
async function remove(fd: FormData) {
  "use server";
  const a = await requireAdmin();
  const { id } = z.object({ id: z.string().uuid() }).parse(Object.fromEntries(fd));
  await db.delete(seoKeywords).where(eq(seoKeywords.id, id));
  await audit(a.id, "seo:delete", "seo_keyword", id); revalidatePath("/admin/seo");
}
async function create(fd: FormData) {
  "use server";
  const a = await requireAdmin();
  const { landingPath, ...p } = z.object(fields).parse(Object.fromEntries(fd));
  const [r] = await db.insert(seoKeywords).values({ ...p, landingPath: landingPath || null }).onConflictDoNothing().returning();
  if (r) await audit(a.id, "seo:create", "seo_keyword", r.id);
  revalidatePath("/admin/seo");
}

const f = "rounded-lg border border-black/15 px-2 py-1.5 text-sm";
const Fields = ({ r }: { r?: typeof seoKeywords.$inferSelect }) => (<>
  <input name="keyword" defaultValue={r?.keyword} required placeholder="Palavra-chave" className={`${f} min-w-56 flex-1`} aria-label="Palavra-chave" />
  <select name="unit" defaultValue={r?.unit ?? "CONSULTORIA"} className={f} aria-label="Unidade"><option>CONSULTORIA</option><option>EDUCA</option></select>
  <input name="category" defaultValue={r?.category} required placeholder="Categoria" className={`${f} w-40`} aria-label="Categoria" />
  <select name="intent" defaultValue={r?.intent ?? "COMERCIAL"} className={f} aria-label="Intenção"><option>COMERCIAL</option><option>INFORMACIONAL</option><option>NAVEGACIONAL</option></select>
  <input name="landingPath" defaultValue={r?.landingPath ?? ""} placeholder="/destino" className={`${f} w-32`} aria-label="Página de destino" />
  <select name="priority" defaultValue={r?.priority ?? 3} className={f} aria-label="Prioridade"><option>1</option><option>2</option><option>3</option></select>
</>);

export default async function Seo() {
  const rows = await db.select().from(seoKeywords).orderBy(asc(seoKeywords.unit), asc(seoKeywords.priority), asc(seoKeywords.keyword));
  return (<><h1 className="text-3xl font-bold">SEO — palavras-chave ({rows.length})</h1>
    <p className="mt-2 text-sm text-graphite/60">Demanda de busca não validada: confirme volumes em uma ferramenta e marque “validada”.</p>
    <form action={create} className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl bg-white p-4"><Fields /><button className="rounded-full bg-brand-red px-4 py-1.5 text-sm font-semibold text-white">Adicionar</button></form>
    <div className="mt-6 grid gap-2">{rows.map((r) => (
      <form key={r.id} action={save} className="flex flex-wrap items-center gap-2 rounded-2xl bg-white p-3">
        <input type="hidden" name="id" value={r.id} /><Fields r={r} />
        <label className="text-xs"><input type="checkbox" name="implemented" defaultChecked={r.implemented} /> implementada</label>
        <label className="text-xs"><input type="checkbox" name="demandValidated" defaultChecked={r.demandValidated} /> demanda validada</label>
        <button className="rounded-full bg-graphite px-4 py-1.5 text-sm text-white">Salvar</button><button formAction={remove} className="text-sm underline">Excluir</button>
      </form>))}</div></>);
}
