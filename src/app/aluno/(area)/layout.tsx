import { Header } from "@/components/Header";
import { LogoutButton } from "@/components/LogoutButton";
import { requireUser } from "@/lib/session";
export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };
export default async function Area({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (<><Header unit="educa" />
    <div className="mx-auto flex max-w-5xl items-center justify-between px-5 pt-6 text-sm"><a href="/aluno/perfil" className="underline">{user.name}</a><LogoutButton to="/aluno/login" /></div>
    <main className="mx-auto max-w-5xl px-5 py-8">{children}</main></>);
}
