import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { courses, courseEnrollments, user } from "@/db/schema";
import { decide } from "./actions";

export default async function Enrollments() {
  const rows = await db.select({ id: courseEnrollments.id, status: courseEnrollments.status, course: courses.title, seats: courses.seats, student: user.email, at: courseEnrollments.createdAt })
    .from(courseEnrollments).innerJoin(courses, eq(courses.id, courseEnrollments.courseId)).innerJoin(user, eq(user.id, courseEnrollments.userId)).orderBy(desc(courseEnrollments.createdAt)).limit(200);
  const btn = "rounded-full px-4 py-1.5 text-sm font-semibold text-white";
  return (<><h1 className="text-3xl font-bold">Inscrições</h1>
    <div className="mt-8 grid gap-3">{rows.length === 0 && <p className="text-graphite/60">Nenhuma solicitação.</p>}
      {rows.map((r) => (<div key={r.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-5">
        <div className="min-w-64 flex-1"><p className="font-medium">{r.course}</p><p className="text-sm text-graphite/60">{r.student} · {r.at.toLocaleDateString("pt-BR")} · vagas: {r.seats ?? "ilimitadas"}</p></div>
        <span className="text-sm">{r.status}</span>
        {r.status === "REQUESTED" && <form action={decide}><input type="hidden" name="id" value={r.id} /><input type="hidden" name="op" value="confirm" /><button className={`${btn} bg-brand-red`}>Confirmar</button></form>}
        {r.status !== "CANCELLED" && <form action={decide}><input type="hidden" name="id" value={r.id} /><input type="hidden" name="op" value="cancel" /><button className={`${btn} bg-graphite`}>Cancelar</button></form>}
      </div>))}</div></>);
}
