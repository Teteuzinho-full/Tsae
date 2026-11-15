// Cria os dois administradores a partir de variáveis de ambiente (nunca no código).
// Uso: npm run admins:create   (ADMIN1_EMAIL/NAME/PASSWORD e ADMIN2_EMAIL/NAME/PASSWORD)
import { eq } from "drizzle-orm";
import { db } from "../src/db";
import { auth } from "../src/lib/auth";
import { user, accountFlags } from "../src/db/schema";

async function main() {
  const list = [1, 2].map((n) => ({ email: process.env[`ADMIN${n}_EMAIL`], name: process.env[`ADMIN${n}_NAME`], password: process.env[`ADMIN${n}_PASSWORD`] }));
  if (list.some((a) => !a.email || !a.name || !a.password)) throw new Error("Defina ADMIN1_* e ADMIN2_*");
  if (list[0].email!.toLowerCase() === list[1].email!.toLowerCase()) throw new Error("Os dois admins precisam de e-mails diferentes");
  for (const a of list) {
    if (a.password!.length < 12) throw new Error(`Senha de ${a.email} com menos de 12 caracteres`);
    const exists = await db.select().from(user).where(eq(user.email, a.email!.toLowerCase()));
    if (!exists.length) await auth.api.signUpEmail({ body: { email: a.email!, name: a.name!, password: a.password! } });
    await db.update(user).set({ role: "admin" }).where(eq(user.email, a.email!.toLowerCase()));
    const [u] = await db.select().from(user).where(eq(user.email, a.email!.toLowerCase()));
    await db.insert(accountFlags).values({ userId: u.id, mustChangePassword: true }).onConflictDoNothing(); // troca obrigatória no 1º acesso
    console.log(`Admin pronto: ${a.email} (ative o MFA em /admin/seguranca)`);
  }
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
