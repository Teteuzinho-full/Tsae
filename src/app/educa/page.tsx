import { Header, Footer } from "@/components/Header";
import { Carousel } from "@/components/Carousel";
import { CourseCard } from "@/components/CourseCard";
import { getCourses } from "@/lib/catalog";
import { getSlides } from "@/lib/slides";
import { WHATSAPP } from "@/lib/contact";
export const dynamic = "force-dynamic";

const defaultSlides = [
  { title: "Capacitação profissional em inspeção e segurança dos alimentos", text: "Cursos ligados às áreas de atuação da TSAE Consultoria." },
  { title: "Do SIF ao comércio exterior", text: "Conteúdo técnico para profissionais da indústria de alimentos e do agronegócio." },
];

export default async function Educa() {
  const [courses, slides] = await Promise.all([getCourses(), getSlides("EDUCA", defaultSlides)]);
  return (
    <>
      <Header unit="educa" />
      <main>
        <Carousel slides={slides} accent="gold" />
        <section id="cursos" className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-3xl font-bold">Cursos e turmas</h2>
          {courses.length === 0 && <p className="mt-6 text-graphite/70">Novos cursos em breve.</p>}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{courses.map((c) => <CourseCard key={c.slug} c={c} />)}</div>
        </section>
        <section id="como-funciona" className="bg-mist px-5 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold">Como se inscrever</h2>
            <p className="mt-3 max-w-2xl text-graphite/70">A inscrição é feita por solicitação e contato via WhatsApp. Pagamento online ficará para uma etapa futura.</p>
            <a href={`https://wa.me/${WHATSAPP}`} className="mt-6 inline-block rounded-full bg-brand-red px-7 py-3 font-semibold text-white">Solicitar inscrição</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
