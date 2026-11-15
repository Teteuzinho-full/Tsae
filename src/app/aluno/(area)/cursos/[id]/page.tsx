import { notFound } from "next/navigation";
import { asc, eq, and, inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { courses, courseModules, courseLessons, lessonProgress, quizzes, quizQuestions } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { canAccessCourse } from "@/lib/enrollments";
import { lastAttempt } from "@/lib/learning";
import { completeLesson, answerQuiz } from "./actions";

export default async function CourseContent({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success || !(await canAccessCourse(db, user.id, id))) notFound(); // sem permissão = 404
  const [course] = await db.select().from(courses).where(eq(courses.id, id));
  if (!course) notFound();
  const mods = await db.select().from(courseModules).where(eq(courseModules.courseId, id)).orderBy(asc(courseModules.position));
  const lessons = await Promise.all(mods.map((m) => db.select().from(courseLessons).where(eq(courseLessons.moduleId, m.id)).orderBy(asc(courseLessons.position))));
  const all = lessons.flat();
  const done = new Set(all.length ? (await db.select({ l: lessonProgress.lessonId }).from(lessonProgress).where(and(eq(lessonProgress.userId, user.id), inArray(lessonProgress.lessonId, all.map((l) => l.id))))).map((r) => r.l) : []);
  const [quiz] = await db.select().from(quizzes).where(eq(quizzes.courseId, id));
  const questions = quiz ? await db.select({ prompt: quizQuestions.prompt, options: quizQuestions.options }).from(quizQuestions).where(eq(quizQuestions.quizId, quiz.id)).orderBy(asc(quizQuestions.position)) : []; // sem correctIndex
  const attempt = quiz ? await lastAttempt(db, user.id, quiz.id) : null;
  return (<><h1 className="text-3xl font-bold">{course.title}</h1>
    <p className="mt-2 text-sm text-graphite/60">Progresso: {done.size} de {all.length} aulas</p>
    {mods.map((m, i) => (<section key={m.id} className="mt-8"><h2 className="text-xl font-semibold">Módulo {m.position} — {m.title}</h2>
      {lessons[i].map((l) => (<article key={l.id} className="mt-3 rounded-2xl border border-black/10 p-5"><h3 className="font-medium">{l.title}</h3><p className="mt-2 text-sm text-graphite/75">{l.content}</p>
        {done.has(l.id) ? <p className="mt-3 text-sm font-semibold text-brand-red">✓ Concluída</p> :
          <form action={completeLesson} className="mt-3"><input type="hidden" name="lessonId" value={l.id} /><button className="rounded-full bg-graphite px-4 py-1.5 text-sm text-white">Concluir aula</button></form>}</article>))}</section>))}
    {quiz && questions.length > 0 && (<section className="mt-12"><h2 className="text-2xl font-semibold">Avaliação</h2>
      {attempt && <p role="status" className="mt-2 rounded-xl bg-brand-gold/20 p-3 text-sm">Última tentativa: {attempt.score} de {attempt.total}.</p>}
      <form action={answerQuiz} className="mt-4 grid gap-5"><input type="hidden" name="quizId" value={quiz.id} />
        {questions.map((q, qi) => (<fieldset key={qi} className="rounded-2xl border border-black/10 p-5"><legend className="px-1 font-medium">{qi + 1}. {q.prompt}</legend>
          {q.options.map((o, oi) => (<label key={oi} className="mt-2 flex gap-2 text-sm"><input type="radio" name={`a${qi}`} value={oi} required className="mt-1" />{o}</label>))}</fieldset>))}
        <button className="w-fit rounded-full bg-brand-red px-6 py-2.5 font-semibold text-white">Enviar respostas</button></form></section>)}</>);
}
