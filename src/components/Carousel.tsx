"use client";
import { useEffect, useState } from "react";

export type Slide = { title: string; text: string; href?: string };

// Slides de texto + gradiente. Quando houver fotos em media_assets, o slide recebe a imagem do Blob.
export function Carousel({ slides, accent = "red" }: { slides: Slide[]; accent?: "red" | "gold" }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);
  const bg = accent === "red" ? "from-graphite via-graphite to-brand-red" : "from-graphite via-graphite to-brand-gold";
  return (
    <section aria-roledescription="carrossel" aria-label="Destaques" className={`relative overflow-hidden bg-gradient-to-br ${bg} text-white`}>
      <div className="mx-auto min-h-[420px] max-w-6xl px-5 py-20 md:py-28">
        {slides.map((s, n) => (
          <div key={s.title} aria-hidden={n !== i} className={`transition-opacity duration-700 ${n === i ? "opacity-100" : "pointer-events-none absolute opacity-0"}`}>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">{s.title}</h1>
            <p className="mt-5 max-w-2xl text-lg text-white/80">{s.text}</p>
            {s.href && <a href={s.href} tabIndex={n === i ? 0 : -1} className="mt-6 inline-block rounded-full bg-brand-gold px-6 py-2.5 font-semibold text-graphite">Saiba mais</a>}
          </div>
        ))}
        <div className="mt-10 flex gap-2">
          {slides.map((s, n) => (
            <button key={s.title} onClick={() => setI(n)} aria-label={`Slide ${n + 1}`} aria-current={n === i}
              className={`h-2.5 rounded-full transition-all ${n === i ? "w-10 bg-brand-gold" : "w-2.5 bg-white/40"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
