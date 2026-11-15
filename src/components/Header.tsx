import Image from "next/image";
import Link from "next/link";
import { EMAIL, WHATSAPP_LABEL } from "@/lib/contact";

type Unit = "consultoria" | "educa";
const nav: Record<Unit, { href: string; label: string }[]> = {
  consultoria: [
    { href: "#areas", label: "Áreas de atuação" }, { href: "#diferenciais", label: "Diferenciais" },
    { href: "#metodologia", label: "Metodologia" }, { href: "/educa", label: "TSAE Educa" }, { href: "#contato", label: "Contato" },
  ],
  educa: [
    { href: "#cursos", label: "Cursos" }, { href: "#como-funciona", label: "Como se inscrever" }, { href: "/", label: "TSAE Consultoria" },
  ],
};

export function Header({ unit }: { unit: Unit }) {
  const educa = unit === "educa";
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href={educa ? "/educa" : "/"} aria-label={educa ? "TSAE Educa" : "TSAE Consultoria"} className="flex items-center gap-3">
          {educa
            ? <Image src="/assets/logo-educa.png" alt="TSAE Educa" width={140} height={56} priority className="h-12 w-auto" />
            : <><Image src="/assets/logo-tsae.png" alt="TSAE" width={48} height={48} priority className="h-11 w-11" />
                <span className="text-lg font-bold tracking-wide">TSAE <span className="font-medium text-brand-red">Consultoria</span></span></>}
        </Link>
        <nav className="hidden gap-6 text-sm font-medium md:flex" aria-label="Principal">
          {nav[unit].map((n) => <Link key={n.href} href={n.href} className="hover:text-brand-red">{n.label}</Link>)}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-graphite px-5 py-10 text-sm text-white/70">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 md:flex-row">
        <p>© {new Date().getFullYear()} TSAE. Todos os direitos reservados.</p>
        <p>WhatsApp {WHATSAPP_LABEL} · {EMAIL} · <Link href="/privacidade" className="underline">Privacidade</Link></p>
      </div>
    </footer>
  );
}
