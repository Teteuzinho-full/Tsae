import type { Metadata } from "next";

// Na área Educa: favicon e imagens de marca trocam para logo-educa.
export const metadata: Metadata = {
  title: "TSAE Educa | Cursos de inspeção, segurança dos alimentos e regulamentação",
  description: "Capacitação profissional em inspeção de produtos de origem animal, SIF, MAPA, BPF, autocontrole, alimentação animal e comércio exterior.",
  icons: { icon: "/assets/logo-educa.ico", shortcut: "/assets/logo-educa.ico" },
  openGraph: { images: ["/assets/logo-educa.png"] },
};
export default function EducaLayout({ children }: { children: React.ReactNode }) { return children; }
