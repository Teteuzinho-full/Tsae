"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function AdminLogin() {
  const [step, setStep] = useState<"cred" | "totp">("cred");
  const [err, setErr] = useState("");
  const input = "w-full rounded-xl border border-black/15 px-4 py-3";
  async function cred(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault(); setErr("");
    const f = new FormData(e.currentTarget);
    const { data, error } = await authClient.signIn.email({ email: String(f.get("email")), password: String(f.get("password")) });
    if (error) return setErr("Credenciais inválidas.");
    if (data && "twoFactorRedirect" in data && data.twoFactorRedirect) return setStep("totp");
    location.href = "/admin";
  }
  async function totp(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault(); setErr("");
    const { error } = await authClient.twoFactor.verifyTotp({ code: String(new FormData(e.currentTarget).get("code")) });
    if (error) return setErr("Código inválido.");
    location.href = "/admin";
  }
  return (
    <main className="mx-auto grid min-h-screen max-w-sm place-items-center px-5">
      <div className="w-full">
        <h1 className="text-2xl font-bold">Acesso administrativo</h1>
        {step === "cred" ? (
          <form onSubmit={cred} className="mt-6 grid gap-4">
            <input name="email" type="email" required autoComplete="username" placeholder="E-mail" className={input} />
            <input name="password" type="password" required autoComplete="current-password" placeholder="Senha" className={input} />
            <button className="rounded-full bg-brand-red px-7 py-3 font-semibold text-white">Entrar</button>
          </form>
        ) : (
          <form onSubmit={totp} className="mt-6 grid gap-4">
            <input name="code" inputMode="numeric" pattern="[0-9]{6}" required placeholder="Código de 6 dígitos" className={input} />
            <button className="rounded-full bg-brand-red px-7 py-3 font-semibold text-white">Verificar</button>
          </form>
        )}
        {err && <p role="alert" className="mt-4 text-sm text-brand-red">{err}</p>}
      </div>
    </main>
  );
}
