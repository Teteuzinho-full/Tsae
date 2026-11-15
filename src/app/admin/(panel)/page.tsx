import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { courses, courseEnrollments, user, auditLogs, contactMessages } from "@/db/schema";

export default async function Dashboard() {
  const n = async (q: Promise<{ c: number }[]>) => (await q)[0]?.c ?? 0;
  const stats = [
    ["Cursos publicados", await n(db.select({ c: count() }).from(courses).where(eq(courses.status, "PUBLISHED")))],
    ["Cursos pendentes", await n(db.select({ c: count() }).from(courses).where(eq(courses.status, "PENDING_REVIEW")))],
    ["Alunos/usuários", await n(db.select({ c: count() }).from(user))],
    ["Inscrições", await n(db.select({ c: count() }).from(courseEnrollments))],
    ["Mensagens de contato", await n(db.select({ c: count() }).from(contactMessages))],
    ["Registros de auditoria", await n(db.select({ c: count() }).from(auditLogs))],
  ];
  return (<><h1 className="text-3xl font-bold">Dashboard</h1>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{stats.map(([l, v]) => (
      <div key={l as string} className="rounded-2xl bg-white p-6"><p className="text-sm text-graphite/60">{l}</p><p className="mt-2 text-3xl font-bold text-brand-red">{v}</p></div>))}</div></>);
}
