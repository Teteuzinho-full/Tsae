import { z } from "zod";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { limited } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(2000),
  consent: z.literal(true), // LGPD: consentimento explícito para uso dos dados no atendimento
}).strict(); // rejeita campos extras (mass assignment)

const json = (body: object, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || new URL(origin).host !== host) return json({ error: "Origem não permitida" }, 403);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "anon";
  if (limited(`contact:${ip}`)) return json({ error: "Muitas tentativas. Aguarde um minuto." }, 429);
  const raw = await req.text();
  if (raw.length > 8_000) return json({ error: "Conteúdo muito grande" }, 413);
  let data: unknown;
  try { data = JSON.parse(raw); } catch { return json({ error: "JSON inválido" }, 400); }
  const parsed = schema.safeParse(data);
  if (!parsed.success) return json({ error: "Dados inválidos" }, 400);
  if (!process.env.DATABASE_URL) return json({ error: "Serviço indisponível" }, 503);
  try {
    const { name, email, message } = parsed.data;
    await db.insert(contactMessages).values({ name, email, message });
    return json({ ok: true }, 201);
  } catch {
    return json({ error: "Erro interno" }, 500); // sem stack trace
  }
}
