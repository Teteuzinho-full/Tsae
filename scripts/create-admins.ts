// Cria um ou dois administradores a partir de variáveis de ambiente (nunca no código).
// Uso: npm run admins:create   (ADMIN1_* obrigatório; ADMIN2_* opcional)
import { eq } from "drizzle-orm";
import { db } from "../src/db";
import { auth } from "../src/lib/auth";
import { user, accountFlags } from "../src/db/schema";

async function main() {
  const configured = [1, 2].map((n) => ({ email: process.env[`ADMIN${n}_EMAIL`], name: process.env[`ADMIN${n}_NAME`], password: process.env[`ADMIN${n}_PASSWORD`] }));
  if (configured.some((a) => [a.email, a.name, a.password].some(Boolean) && [a.email, a.name, a.password].some((value) => !value)))
    throw new Error("Preencha EMAIL, NAME e PASSWORD para cada administrador configurado");
  if (!configured[0].email || !configured[0].name || !configured[0].password)
    throw new Error("Defina ADMIN1_EMAIL, ADMIN1_NAME e ADMIN1_PASSWORD; ADMIN2_* é opcional");
  const list = configured.filter((a): a is { email: string; name: string; password: string } => Boolean(a.email && a.name && a.password));
  if (new Set(list.map((a) => a.email.toLowerCase())).size !== list.length) throw new Error("Os dois admins precisam de e-mails diferentes");
  for (const a of list) {
    if (a.password.length < 12) throw new Error(`Senha de ${a.email} com menos de 12 caracteres`);
    const exists = await db.select().from(user).where(eq(user.email, a.email.toLowerCase()));
    if (!exists.length) await auth.api.signUpEmail({ body: { email: a.email, name: a.name, password: a.password } });
    await db.update(user).set({ role: "admin" }).where(eq(user.email, a.email.toLowerCase()));
    const [u] = await db.select().from(user).where(eq(user.email, a.email.toLowerCase()));
    await db.insert(accountFlags).values({ userId: u.id, mustChangePassword: true }).onConflictDoNothing(); // troca obrigatória no 1º acesso
    console.log(`Admin pronto: ${a.email} (ative o MFA em /admin/seguranca)`);
  }
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
