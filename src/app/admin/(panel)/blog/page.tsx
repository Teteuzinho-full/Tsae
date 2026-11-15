import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { blogPosts, blogCategories } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { audit } from "@/lib/audit";
import { slugify } from "@/lib/slug";

const refresh = () => { revalidatePath("/admin/blog"); revalidatePath("/blog"); };
const cat = z.preprocess((v) => (v === "" ? null : v), z.string().uuid().nullable());

async function create(fd: FormData) {
  "use server";
  const a = await requireAdmin();
  const p = z.object({ title: z.string().min(3).max(160), excerpt: z.string().min(10).max(300), content: z.string().min(20).max(20000), categoryId: cat }).parse(Object.fromEntries(fd));
  const [r] = await db.insert(blogPosts).values({ ...p, slug: `${slugify(p.title)}-${Date.now().toString(36)}` }).returning();
  await audit(a.id, "blog:create", "blog", r.id); refresh();
}
async function setStatus(fd: FormData) {
  "use server";
  const a = await requireAdmin();
  const p = z.object({ id: z.string().uuid(), status: z.enum(["DRAFT", "PUBLISHED"]) }).parse(Object.fromEntries(fd));
  await db.update(blogPosts).set({ status: p.status, publishedAt: p.status === "PUBLISHED" ? new Date() : null, updatedAt: new Date() }).where(eq(blogPosts.id, p.id));
  await audit(a.id, `blog:${p.status}`, "blog", p.id); refresh();
}
async function setCategory(fd: FormData) {
  "use server";
  const a = await requireAdmin();
  const p = z.object({ id: z.string().uuid(), categoryId: cat }).parse(Object.fromEntries(fd));
  await db.update(blogPosts).set({ categoryId: p.categoryId, updatedAt: new Date() }).where(eq(blogPosts.id, p.id));
  await audit(a.id, "blog:set-category", "blog", p.id); refresh();
}
async function addCategory(fd: FormData) {
  "use server";
  const a = await requireAdmin();
  const { name } = z.object({ name: z.string().trim().min(2).max(60) }).parse(Object.fromEntries(fd));
  const [r] = await db.insert(blogCategories).values({ name, slug: slugify(name) }).onConflictDoNothing().returning();
  if (r) await audit(a.id, "blog-category:create", "blog_category", r.id);
  refresh();
}
async function deleteCategory(fd: FormData) {
  "use server";
  const a = await requireAdmin();
  const { id } = z.object({ id: z.string().uuid() }).parse(Object.fromEntries(fd));
  await db.delete(blogCategories).where(eq(blogCategories.id, id)); // artigos ficam sem categoria
  await audit(a.id, "blog-category:delete", "blog_category", id); refresh();
}

export default async function Blog() {
  const [rows, cats] = await Promise.all([db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt)), db.select().from(blogCategories).orderBy(blogCategories.name)]);
  const f = "w-full rounded-lg border border-black/15 px-3 py-2 text-sm";
  const Select = ({ v }: { v?: string | null }) => <select name="categoryId" defaultValue={v ?? ""} className={f} aria-label="Categoria"><option value="">Sem categoria</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>;
  return (<><h1 className="text-3xl font-bold">Blog</h1>
    <section className="mt-6 rounded-2xl bg-white p-5"><h2 className="font-semibold">Categorias</h2>
      <div className="mt-3 flex flex-wrap gap-2">{cats.map((c) => (<form key={c.id} action={deleteCategory} className="flex items-center gap-1 rounded-full bg-mist px-3 py-1 text-sm"><input type="hidden" name="id" value={c.id} />{c.name}<button className="ml-1 font-bold" aria-label={`Excluir categoria ${c.name}`}>×</button></form>))}</div>
      <form action={addCategory} className="mt-3 flex gap-2"><input name="name" required placeholder="Nova categoria" className={f} /><button className="rounded-full bg-graphite px-4 text-sm text-white">Adicionar</button></form></section>
    <form action={create} className="mt-6 grid gap-3 rounded-2xl bg-white p-5"><input name="title" required placeholder="Título" className={f} /><input name="excerpt" required placeholder="Resumo" className={f} /><Select />
      <textarea name="content" required rows={6} placeholder="Conteúdo (texto simples; parágrafos separados por linha em branco)" className={f} />
      <button className="w-fit rounded-full bg-brand-red px-5 py-2 text-sm font-semibold text-white">Salvar rascunho</button></form>
    <div className="mt-6 grid gap-3">{rows.map((r) => (<div key={r.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4">
      <span className="min-w-52 flex-1 text-sm">{r.title} <i className="text-graphite/50">({r.status})</i></span>
      <form action={setCategory} className="flex gap-2"><input type="hidden" name="id" value={r.id} /><Select v={r.categoryId} /><button className="rounded-full bg-mist px-3 text-sm">Salvar</button></form>
      <form action={setStatus}><input type="hidden" name="id" value={r.id} /><input type="hidden" name="status" value={r.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"} /><button className="rounded-full bg-graphite px-4 py-1.5 text-sm text-white">{r.status === "PUBLISHED" ? "Despublicar" : "Publicar"}</button></form></div>))}</div></>);
}
