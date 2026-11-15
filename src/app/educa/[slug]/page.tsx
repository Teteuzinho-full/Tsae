import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/Header";
import { brl, fmtDate } from "@/components/CourseCard";
import { getCourse } from "@/lib/catalog";
import { availabilityLabel } from "@/lib/availability";
import { WHATSAPP } from "@/lib/contact";
export const dynamic = "force-dynamic";

type P = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCourse(slug);
  return c ? { title: c.title, description: c.description, alternates: { canonical: `/educa/${c.slug}` }, openGraph: c.image ? { images: [c.image] } : undefined } : {};
}

export default async function CoursePage({ params }: P) {
  const { slug } = await params;
  const c = await getCourse(slug);
  if (!c) notFound();
  const open = c.availability === "ABERTO";
  const msg = encodeURIComponent((open ? "Olá! Quero solicitar inscrição: " : "Olá! Gostaria de saber sobre novas turmas de: ") + c.title);
  const ld = { "@context": "https://schema.org", "@type": "Course", name: c.title, description: c.description, provider: { "@type": "Organization", name: "TSAE Educa" },
    ...(c.startsAt ? { hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", startDate: c.startsAt } } : {}) };
  return (
    <>
      <Header unit="educa" />
      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
        <div>
          {c.image && /* eslint-disable-next-line @next/next/no-img-element */ <img src={c.image} alt={`Flyer do curso ${c.title}`} className="w-full rounded-2xl" />}
          {c.gallery.map((g) => /* eslint-disable-next-line @next/next/no-img-element */ <img key={g} src={g} alt={`Material de divulgação de ${c.title}`} loading="lazy" className="mt-4 w-full rounded-2xl" />)}
        </div>
        <div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${open ? "bg-brand-gold" : c.availability === "ESGOTADO" ? "bg-brand-red text-white" : c.availability === "EM_BREVE" ? "bg-mist" : "bg-graphite text-white"}`}>{availabilityLabel[c.availability]}</span>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">{c.title}</h1>
          <p className="mt-2 text-lg text-graphite/70">{c.subtitle}</p>
          <p className="mt-6 text-graphite/80">{c.description}</p>
          <dl className="mt-6 grid gap-2 text-sm">
            {c.startsAt && <div><dt className="inline font-semibold">Data: </dt><dd className="inline">{fmtDate(c.startsAt)}</dd></div>}
            {c.format && <div><dt className="inline font-semibold">Formato: </dt><dd className="inline">{c.format}</dd></div>}
            {c.hours > 0 && <div><dt className="inline font-semibold">Carga horária: </dt><dd className="inline">{c.hours}h</dd></div>}
            <div><dt className="inline font-semibold">Investimento: </dt><dd className="inline">{c.priceBrl != null ? brl(c.priceBrl) : "Consultar valores"}</dd></div>
          </dl>
          {c.instructors.length > 0 && <><h2 className="mt-8 text-xl font-semibold">Ministrantes</h2><ul className="mt-2 list-disc pl-5 text-sm text-graphite/80">{c.instructors.map((i) => <li key={i}>{i}</li>)}</ul></>}
          <h2 className="mt-8 text-xl font-semibold">Objetivos</h2>
          <ul className="mt-2 list-disc pl-5 text-graphite/80">{c.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
          <p className="mt-6 text-sm"><strong>Público-alvo:</strong> {c.audience} <strong>Pré-requisitos:</strong> {c.prerequisites}</p>
          <h2 className="mt-8 text-xl font-semibold">Conteúdo programático</h2>
          {c.modules.map((m, i) => (<div key={m.title} className="mt-3 rounded-2xl border border-black/10 p-4"><h3 className="font-semibold">Módulo {i + 1} — {m.title}</h3>
            <ul className="mt-1 text-sm text-graphite/75">{m.lessons.map((l) => <li key={l.title}>• {l.title}</li>)}</ul></div>))}
          <a href={`https://wa.me/${WHATSAPP}?text=${msg}`} className="mt-8 inline-block rounded-full bg-brand-red px-7 py-3 font-semibold text-white">{open ? "Solicitar inscrição" : "Consultar próximas turmas"}</a>
        </div>
      </main>
      <Footer />
    </>
  );
}
