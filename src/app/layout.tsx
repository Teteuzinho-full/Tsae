import type { Metadata } from "next";
import "./globals.css";

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "TSAE Consultoria | Inspeção, regulamentação e comércio exterior agropecuário", template: "%s | TSAE" },
  description: "Consultoria técnica em inspeção de produtos de origem animal, SIF, MAPA, VIGIAGRO, alimentação animal, bebidas, comércio exterior e perícia portuária.",
  icons: { icon: "/assets/logo.ico", shortcut: "/assets/logo.ico" },
  openGraph: { type: "website", locale: "pt_BR", siteName: "TSAE", images: ["/assets/logo-tsae.png"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-white text-graphite antialiased">{children}</body>
    </html>
  );
}
