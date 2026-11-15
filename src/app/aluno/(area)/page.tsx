import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { courses, courseEnrollments } from "@/db/schema";
import { availability } from "@/lib/availability";
import { requireUser } from "@/lib/session";
import { requestCourse } from "./actions";

const label = { REQUESTED: "Solicitada", CONFIRMED: "Confirmada", CANCELLED: "Cancelada" } as const;

export default async function StudentHome() {
  const user = await requireUser();
  const mine = await db.select({ id: courses.id, title: courses.title, status: courseEnrollments.status })
    .from(courseEnrollments).innerJoin(courses, eq(courses.id, courseEnrollments.courseId)).where(eq(courseEnrollments.userId, user.id));
  const published = (await db.select().from(courses).where(eq(courses.status, "PUBLISHED"))).filter((c) => availability(c) === "ABERTO"); // só turmas abertas
  const mineIds = new Set(mine.map((m) => m.id));
  return (<>
    <h1 className="text-3xl font-bold">Meus cursos</h1>
    <ul className="mt-6 grid gap-3">{mine.length === 0 && <li className="text-graphite/60">Nenhuma inscrição ainda.</li>}
      {mine.map((m) => (<li key={m.id} className="flex items-center justify-between rounded-2xl border border-black/10 p-5">
        <span className="font-medium">{m.title}</span>
        {m.status === "CONFIRMED" ? <Link href={`/aluno/cursos/${m.id}`} className="rounded-full bg-brand-red px-5 py-2 text-sm text-white">Acessar</Link> : <span className="text-sm text-graphite/60">{label[m.status]}</span>}
      </li>))}</ul>
    <h2 className="mt-12 text-2xl font-semibold">Cursos disponíveis</h2>
    <ul className="mt-4 grid gap-3">{published.filter((p) => !mineIds.has(p.id)).map((p) => (
      <li key={p.id} className="flex items-center justify-between rounded-2xl bg-mist p-5"><span>{p.title}</span>
        <form action={requestCourse}><input type="hidden" name="courseId" value={p.id} /><button className="rounded-full bg-graphite px-5 py-2 text-sm text-white">Solicitar inscrição</button></form></li>))}</ul>
  </>);
}
