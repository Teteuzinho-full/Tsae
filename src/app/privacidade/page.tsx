import type { Metadata } from "next";
import { Header, Footer } from "@/components/Header";
export const metadata: Metadata = { title: "Política de Privacidade" };
export default function Privacidade() {
  return (<><Header unit="consultoria" /><main className="mx-auto max-w-3xl px-5 py-16">
    <h1 className="text-3xl font-bold">Política de Privacidade</h1>
    <p className="mt-2 text-sm text-brand-red">Minuta técnica: deve ser revisada por profissional jurídico e completada com os dados do controlador (razão social, CNPJ, encarregado/DPO) antes da publicação.</p>
    <h2 className="mt-8 text-xl font-semibold">Dados coletados e finalidade</h2>
    <p className="mt-2 text-graphite/80">Coletamos apenas nome, e-mail e a mensagem enviada pelo formulário de contato, para responder à sua solicitação. Para alunos, dados cadastrais mínimos necessários à inscrição e ao acesso aos cursos.</p>
    <h2 className="mt-8 text-xl font-semibold">Seus direitos (LGPD)</h2>
    <p className="mt-2 text-graphite/80">Você pode solicitar acesso, correção e exclusão dos seus dados pelo canal de contato do site.</p>
    <h2 className="mt-8 text-xl font-semibold">Armazenamento e segurança</h2>
    <p className="mt-2 text-graphite/80">Os dados ficam em banco PostgreSQL com acesso restrito ao servidor e não são compartilhados com terceiros para fins de marketing.</p>
  </main><Footer /></>);
}
