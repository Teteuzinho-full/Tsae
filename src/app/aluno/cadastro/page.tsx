"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function StudentSignup() {
  const [msg, setMsg] = useState("");
  async function submit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault(); setMsg("");
    const f = new FormData(e.currentTarget);
    const { error } = await authClient.signUp.email({ name: String(f.get("name")), email: String(f.get("email")), password: String(f.get("password")) });
    if (error) return setMsg("Não foi possível criar a conta. Use uma senha com 12+ caracteres.");
    location.href = "/aluno/login";
  }
  const input = "w-full rounded-xl border border-black/15 px-4 py-3";
  return (<main className="mx-auto grid min-h-screen max-w-sm place-items-center px-5"><div className="w-full">
    <h1 className="text-2xl font-bold">Criar conta</h1>
    <form onSubmit={submit} className="mt-6 grid gap-4">
      <input name="name" required minLength={2} placeholder="Nome" className={input} />
      <input name="email" type="email" required autoComplete="username" placeholder="E-mail" className={input} />
      <input name="password" type="password" required minLength={12} autoComplete="new-password" placeholder="Senha (mín. 12 caracteres)" className={input} />
      <label className="flex gap-2 text-sm"><input type="checkbox" required className="mt-1" /><span>Li a <a href="/privacidade" className="underline">política de privacidade</a>.</span></label>
      <button className="rounded-full bg-brand-red px-7 py-3 font-semibold text-white">Cadastrar</button>
    </form>
    {msg && <p role="alert" className="mt-4 text-sm text-brand-red">{msg}</p>}
  </div></main>);
}
