"use client";
import { useState } from "react";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  async function onSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState("sending");
    const res = await fetch("/api/contact", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: f.get("name"), email: f.get("email"), message: f.get("message"), consent: f.get("consent") === "on" }),
    });
    setState(res.ok ? "ok" : "error");
  }
  const input = "w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-brand-red";
  if (state === "ok") return <p role="status" className="mt-6 rounded-xl bg-brand-gold/20 p-4">Mensagem enviada. Entraremos em contato.</p>;
  return (
    <form onSubmit={onSubmit} className="mt-6 grid max-w-xl gap-4">
      <input name="name" required minLength={2} maxLength={120} placeholder="Nome" aria-label="Nome" className={input} />
      <input name="email" type="email" required placeholder="E-mail" aria-label="E-mail" className={input} />
      <textarea name="message" required minLength={10} maxLength={2000} rows={4} placeholder="Como podemos ajudar?" aria-label="Mensagem" className={input} />
      <label className="flex items-start gap-2 text-sm text-graphite/70">
        <input type="checkbox" name="consent" required className="mt-1" />
        <span>Concordo com o uso dos meus dados para retorno deste contato, conforme a <a href="/privacidade" className="underline">política de privacidade</a>.</span>
      </label>
      <button disabled={state === "sending"} className="rounded-full bg-brand-red px-7 py-3 font-semibold text-white disabled:opacity-60">{state === "sending" ? "Enviando…" : "Enviar"}</button>
      {state === "error" && <p role="alert" className="text-sm text-brand-red">Não foi possível enviar agora. Tente novamente ou use o WhatsApp.</p>}
    </form>
  );
}
