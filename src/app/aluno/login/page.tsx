"use client";
import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function StudentLogin() {
  const [err, setErr] = useState("");
  async function submit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault(); setErr("");
    const f = new FormData(e.currentTarget);
    const { error } = await authClient.signIn.email({ email: String(f.get("email")), password: String(f.get("password")) });
    if (error) return setErr("E-mail ou senha inválidos.");
    location.href = "/aluno";
  }
  const input = "w-full rounded-xl border border-black/15 px-4 py-3";
  return (<main className="mx-auto grid min-h-screen max-w-sm place-items-center px-5"><div className="w-full">
    <h1 className="text-2xl font-bold">Área do aluno</h1>
    <form onSubmit={submit} className="mt-6 grid gap-4">
      <input name="email" type="email" required autoComplete="username" placeholder="E-mail" className={input} />
      <input name="password" type="password" required autoComplete="current-password" placeholder="Senha" className={input} />
      <button className="rounded-full bg-brand-red px-7 py-3 font-semibold text-white">Entrar</button>
    </form>
    {err && <p role="alert" className="mt-4 text-sm text-brand-red">{err}</p>}
    <p className="mt-6 text-sm">Novo por aqui? <Link href="/aluno/cadastro" className="underline">Criar conta</Link></p>
  </div></main>);
}
