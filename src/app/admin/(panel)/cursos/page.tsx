import { asc } from "drizzle-orm";
import { db } from "@/db";
import { courses } from "@/db/schema";
import Link from "next/link";
import { updateCourse } from "./actions";

export default async function AdminCourses() {
  const rows = await db.select().from(courses).orderBy(asc(courses.title));
  const f = "rounded-lg border border-black/15 px-3 py-2";
  return (<><h1 className="text-3xl font-bold">Cursos</h1>
    <p className="mt-2 text-sm text-graphite/60">Aprove o conteúdo e o preço antes de publicar.</p>
    <div className="mt-8 grid gap-4">{rows.map((c) => (
      <form key={c.id} action={updateCourse} className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-5">
        <input type="hidden" name="id" value={c.id} />
        <span className="min-w-64 flex-1 font-medium">{c.title} <Link href={`/admin/cursos/${c.id}`} className="ml-2 text-sm font-normal underline">Editar conteúdo</Link></span>
        <input name="priceBrl" type="number" step="0.01" min="0" defaultValue={c.priceBrl ?? ""} placeholder="Consultar" className={`${f} w-28`} aria-label="Preço (R$)" />
        <select name="status" defaultValue={c.status} className={f} aria-label="Status">
          {["DRAFT", "PENDING_REVIEW", "PUBLISHED", "ARCHIVED"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className="rounded-full bg-brand-red px-5 py-2 text-sm font-semibold text-white">Salvar</button>
      </form>))}</div></>);
}
