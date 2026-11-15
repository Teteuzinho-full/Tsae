import Link from "next/link";
import { Header, Footer } from "@/components/Header";
import { Carousel } from "@/components/Carousel";
import { ContactForm } from "@/components/ContactForm";
import { getSlides } from "@/lib/slides";
import { WHATSAPP } from "@/lib/contact";
export const dynamic = "force-dynamic";

const defaultSlides = [
  { title: "Inspeção e consultoria agropecuária com mais de 30 anos de experiência", text: "Orientação técnica para estabelecimentos de produtos de origem animal, com foco em conformidade e segurança dos alimentos." },
  { title: "Regulamentação: SIF, MAPA e VIGIAGRO", text: "Adequações regulatórias e orientação documental para a regularização e a operação do seu estabelecimento." },
  { title: "Comércio exterior e perícia portuária", text: "Consultoria e orientação técnica para operações de comércio exterior de produtos agropecuários." },
];

const areas = [
  { t: "Inspeção e consultoria agropecuária", d: "Inspeção de produtos de origem animal, orientações técnicas, adequação de processos e consultoria especializada." },
  { t: "Regulamentação", d: "SIF, MAPA, VIGIAGRO, adequações regulatórias e orientação documental." },
  { t: "Produtos de origem animal", d: "Carnes e derivados, produtos aquáticos, leite e derivados, ovos e derivados, mel e produtos relacionados." },
  { t: "Alimentação animal", d: "Orientação regulatória, consultoria técnica e adequação de estabelecimentos e produtos." },
  { t: "Bebidas", d: "Regulamentação e orientações relacionadas ao MAPA." },
  { t: "Comércio exterior e perícia portuária", d: "Consultoria para comércio exterior, orientação técnica e perícia portuária." },
];

const steps = ["Diagnóstico da situação do estabelecimento", "Análise regulatória e documental", "Plano de adequação", "Acompanhamento técnico"];

export default async function Home() {
  const slides = await getSlides("CONSULTORIA", defaultSlides);
  const wa = WHATSAPP;
  return (
    <>
      <Header unit="consultoria" />
      <main>
        <Carousel slides={slides} />
        <section id="areas" className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-3xl font-bold">Áreas de atuação</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {areas.map((a) => (
              <article key={a.t} className="rounded-2xl border border-black/10 p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 h-1 w-10 rounded bg-brand-gold" />
                <h3 className="text-lg font-semibold">{a.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite/70">{a.d}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="diferenciais" className="bg-mist px-5 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold">Por que a TSAE</h2>
            <p className="mt-4 max-w-3xl text-graphite/70">Experiência aproximada de 30 anos na área de inspeção e regulamentação agropecuária. Os demais diferenciais, certificações e casos serão cadastrados no painel após validação da TSAE.</p>
          </div>
        </section>
        <section id="metodologia" className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-3xl font-bold">Metodologia</h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-4">
            {steps.map((s, n) => (
              <li key={s} className="rounded-2xl bg-graphite p-6 text-white">
                <span className="text-3xl font-bold text-brand-gold">{n + 1}</span>
                <p className="mt-3 text-sm">{s}</p>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-graphite/50">Etapas ilustrativas — a metodologia oficial será editável no painel.</p>
        </section>
        <section className="bg-brand-red px-5 py-16 text-white">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div><h2 className="text-2xl font-bold">TSAE Educa</h2><p className="mt-2 max-w-xl text-white/85">Capacitação profissional nas mesmas áreas em que a TSAE atua.</p></div>
            <Link href="/educa" className="rounded-full bg-brand-gold px-7 py-3 font-semibold text-graphite">Conhecer os cursos</Link>
          </div>
        </section>
        <section id="contato" className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-3xl font-bold">Contato e solicitação de orçamento</h2>
          <ContactForm />
          {wa && <a href={`https://wa.me/${wa}`} className="mt-6 inline-block rounded-full bg-brand-red px-7 py-3 font-semibold text-white">Falar pelo WhatsApp</a>}
        </section>
      </main>
      <Footer />
    </>
  );
}
