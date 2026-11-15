import Link from "next/link";
import type { PublicCourse } from "@/lib/catalog";
import { availabilityLabel } from "@/lib/availability";

export const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "America/Sao_Paulo" });
const badge = { ABERTO: "bg-brand-gold text-graphite", ESGOTADO: "bg-brand-red text-white", ENCERRADO: "bg-graphite text-white", EM_BREVE: "bg-mist text-graphite" } as const;

export function CourseCard({ c }: { c: PublicCourse }) {
  const closed = c.availability === "ESGOTADO" || c.availability === "ENCERRADO";
  return (
    <Link href={`/educa/${c.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-black/10 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/5] bg-graphite">
        {c.image
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={c.image} alt={`Flyer do curso ${c.title}`} loading="lazy" className={`h-full w-full object-cover ${closed ? "opacity-60" : ""}`} />
          : <div className="grid h-full place-items-center bg-gradient-to-br from-graphite to-brand-red p-6 text-center text-sm font-semibold text-white">{c.category}</div>}
        <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${badge[c.availability]}`}>{availabilityLabel[c.availability]}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold leading-snug">{c.title}</h3>
        {c.startsAt ? <p className="mt-2 text-sm text-graphite/70">{fmtDate(c.startsAt)}</p> : c.format && <p className="mt-2 text-sm text-graphite/70">{c.format}</p>}
        <p className="mt-auto pt-4 text-sm">{c.priceBrl != null ? <strong className="text-brand-red">{brl(c.priceBrl)}</strong> : <span className="text-graphite/60">Consultar valores</span>}{c.hours > 0 && <> · {c.hours}h</>}</p>
      </div>
    </Link>
  );
}
