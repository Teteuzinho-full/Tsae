"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Security() {
  const [uri, setUri] = useState(""); const [msg, setMsg] = useState("");
  const input = "rounded-xl border border-black/15 px-4 py-3";
  async function enable(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const { data, error } = await authClient.twoFactor.enable({ password: String(new FormData(e.currentTarget).get("password")) });
    if (error || !data || !("totpURI" in data)) return setMsg("Não foi possível ativar.");
    setUri(data.totpURI); setMsg("Adicione ao app autenticador e confirme com um código.");
  }
  async function verify(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const { error } = await authClient.twoFactor.verifyTotp({ code: String(new FormData(e.currentTarget).get("code")) });
    setMsg(error ? "Código inválido." : "MFA ativado.");
  }
  return (<><h1 className="text-3xl font-bold">Segurança da conta (MFA)</h1>
    <form onSubmit={enable} className="mt-6 flex gap-3"><input name="password" type="password" required placeholder="Senha atual" className={input} /><button className="rounded-full bg-graphite px-6 text-white">Ativar MFA</button></form>
    {uri && <><p className="mt-6 break-all rounded-xl bg-white p-4 text-xs">{uri}</p>
      <form onSubmit={verify} className="mt-4 flex gap-3"><input name="code" inputMode="numeric" pattern="[0-9]{6}" required placeholder="Código" className={input} /><button className="rounded-full bg-brand-red px-6 text-white">Confirmar</button></form></>}
    {msg && <p role="status" className="mt-4 text-sm">{msg}</p>}</>);
}
