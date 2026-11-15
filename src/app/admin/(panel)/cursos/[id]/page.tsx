import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { courses, courseModules, courseLessons } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { updateMeta, addModule, updateModule, deleteModule, addLesson, updateLesson, deleteLesson } from "./actions";

const f = "w-full rounded-lg border border-black/15 px-3 py-2 text-sm";
const dt = (d: Date | null) => (d ? new Date(+d - 3 * 3600_000).toISOString().slice(0, 16) : ""); // exibe em horário de Brasília
const Btn = ({ children, dark }: { children: React.ReactNode; dark?: boolean }) => <button className={`rounded-full px-4 py-1.5 text-sm font-semibold text-white ${dark ? "bg-graphite" : "bg-brand-red"}`}>{children}</button>;

export default async function EditCourse({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();
  const [c] = await db.select().from(courses).where(eq(courses.id, id));
  if (!c) notFound();
  const mods = await db.select().from(courseModules).where(eq(courseModules.courseId, id)).orderBy(asc(courseModules.position));
  const lessons = await Promise.all(mods.map((m) => db.select().from(courseLessons).where(eq(courseLessons.moduleId, m.id)).orderBy(asc(courseLessons.position))));
  return (<>
    <h1 className="text-3xl font-bold">Editar curso</h1>
    <form action={updateMeta} className="mt-6 grid gap-3 rounded-2xl bg-white p-5 sm:grid-cols-2">
      <input type="hidden" name="id" value={c.id} />
      <input name="title" defaultValue={c.title} required className={`${f} sm:col-span-2`} aria-label="Título" />
      <input name="subtitle" defaultValue={c.subtitle ?? ""} className={`${f} sm:col-span-2`} aria-label="Subtítulo" />
      <textarea name="description" defaultValue={c.description} required rows={4} className={`${f} sm:col-span-2`} aria-label="Descrição" />
      <label className="text-xs">Carga horária (h)<input name="workloadHours" type="number" min="0" defaultValue={c.workloadHours ?? ""} className={f} /></label>
      <label className="text-xs">Vagas (vazio = ilimitadas)<input name="seats" type="number" min="0" defaultValue={c.seats ?? ""} className={f} /></label>
      <label className="text-xs">Início (horário de Brasília)<input name="startsAt" type="datetime-local" defaultValue={dt(c.startsAt)} className={f} /></label>
      <label className="text-xs">Formato<input name="format" defaultValue={c.format ?? ""} className={f} /></label>
      <label className="text-xs sm:col-span-2">Ministrantes (um por linha)<textarea name="instructors" defaultValue={c.instructors ?? ""} rows={3} className={f} /></label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="soldOut" defaultChecked={c.soldOut} /> Turma esgotada</label>
      <div className="sm:col-span-2"><Btn>Salvar dados do curso</Btn></div>
    </form>

    <h2 className="mt-12 text-2xl font-semibold">Módulos e aulas</h2>
    {mods.map((m, i) => (
      <section key={m.id} className="mt-5 rounded-2xl bg-white p-5">
        <form action={updateModule} className="flex flex-wrap items-center gap-2">
          <input type="hidden" name="id" value={m.id} />
          <input name="position" type="number" min="1" defaultValue={m.position} className={`${f} w-20`} aria-label="Ordem do módulo" />
          <input name="title" defaultValue={m.title} required className={`${f} min-w-60 flex-1`} aria-label="Título do módulo" />
          <Btn>Salvar módulo</Btn><button formAction={deleteModule} className="rounded-full bg-graphite px-4 py-1.5 text-sm text-white" aria-label={`Excluir módulo ${m.title}`}>Excluir</button>
        </form>
        {lessons[i].map((l) => (
          <form key={l.id} action={updateLesson} className="mt-3 grid gap-2 rounded-xl border border-black/10 p-3">
            <input type="hidden" name="id" value={l.id} />
            <div className="flex gap-2"><input name="position" type="number" min="1" defaultValue={l.position} className={`${f} w-20`} aria-label="Ordem da aula" /><input name="title" defaultValue={l.title} required className={f} aria-label="Título da aula" /></div>
            <textarea name="content" defaultValue={l.content} required rows={4} className={f} aria-label="Conteúdo da aula" />
            <div className="flex gap-2"><Btn>Salvar aula</Btn><button formAction={deleteLesson} className="rounded-full bg-graphite px-4 py-1.5 text-sm text-white">Excluir aula</button></div>
          </form>))}
        <form action={addLesson} className="mt-3 flex gap-2"><input type="hidden" name="moduleId" value={m.id} /><input name="title" required placeholder="Nova aula" className={f} /><Btn dark>Adicionar aula</Btn></form>
      </section>))}
    <form action={addModule} className="mt-5 flex gap-2"><input type="hidden" name="courseId" value={c.id} /><input name="title" required placeholder="Novo módulo" className={f} /><Btn>Adicionar módulo</Btn></form>
  </>);
}
