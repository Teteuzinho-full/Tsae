import Link from "next/link";
import { requireAdmin } from "@/lib/session";
export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <div className="min-h-screen bg-mist">
      <header className="flex items-center justify-between bg-graphite px-5 py-3 text-white">
        <nav className="flex gap-5 text-sm font-medium"><Link href="/admin">Dashboard</Link><Link href="/admin/cursos">Cursos</Link><Link href="/admin/inscricoes">Inscrições</Link><Link href="/admin/alunos">Alunos</Link><Link href="/admin/seo">SEO</Link><Link href="/admin/carrosseis">Carrosséis</Link><Link href="/admin/blog">Blog</Link><Link href="/admin/midia">Mídia</Link><Link href="/admin/auditoria">Auditoria</Link><Link href="/admin/seguranca">Segurança (MFA)</Link></nav>
        <span className="text-xs text-white/70">{user.email}</span>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-10">{children}</div>
    </div>
  );
}
