import { describe, it, expect, beforeAll } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { eq } from "drizzle-orm";
import * as schema from "../src/db/schema";

process.env.BETTER_AUTH_SECRET = "test-secret-test-secret-test-secret-123";
process.env.BETTER_AUTH_URL = "http://localhost:3000";
const PW1 = "Senha-Admin-Um-2026!", PW2 = "Senha-Admin-Dois-2026!";
let db: ReturnType<typeof drizzle<typeof schema>>;
let auth: ReturnType<typeof import("../src/lib/auth").createAuth>;

beforeAll(async () => {
  db = drizzle(new PGlite(), { schema });
  await migrate(db, { migrationsFolder: "./drizzle" });
  const { createAuth } = await import("../src/lib/auth");
  auth = createAuth(db as never);
  for (const [email, pw] of [["admin1@teste.local", PW1], ["admin2@teste.local", PW2]])
    await auth.api.signUpEmail({ body: { email, name: email, password: pw } });
  await db.update(schema.user).set({ role: "admin" }).where(eq(schema.user.email, "admin1@teste.local"));
  await db.update(schema.user).set({ role: "admin" }).where(eq(schema.user.email, "admin2@teste.local"));
  await auth.api.signUpEmail({ body: { email: "aluno@teste.local", name: "Aluno", password: "Senha-Aluno-2026!!" } });
});

const login = (email: string, password: string) => auth.api.signInEmail({ body: { email, password }, returnHeaders: true, asResponse: false });

describe("autenticação e autorização", () => {
  it("cria exatamente dois admins com credenciais independentes", async () => {
    const admins = await db.select().from(schema.user).where(eq(schema.user.role, "admin"));
    expect(admins).toHaveLength(2);
    const accounts = await db.select().from(schema.account);
    expect(new Set(accounts.map((a) => a.password)).size).toBe(accounts.length); // hashes distintos
    expect(accounts.every((a) => a.password && !a.password.includes("Senha"))).toBe(true); // nunca em texto puro
  });
  it("cada admin entra com sua própria senha e a sessão carrega o papel", async () => {
    for (const [e, p] of [["admin1@teste.local", PW1], ["admin2@teste.local", PW2]]) {
      const r = await login(e, p);
      const cookie = r.headers.get("set-cookie")!;
      expect(cookie).toMatch(/HttpOnly/i);
      const s = await auth.api.getSession({ headers: new Headers({ cookie: cookie.split(";")[0] }) });
      expect(s?.user.role).toBe("admin");
    }
  });
  it("senha de um admin não abre a conta do outro", async () => {
    await expect(login("admin1@teste.local", PW2)).rejects.toBeTruthy();
  });
  it("aluno não recebe papel admin", async () => {
    const r = await login("aluno@teste.local", "Senha-Aluno-2026!!");
    const s = await auth.api.getSession({ headers: new Headers({ cookie: r.headers.get("set-cookie")!.split(";")[0] }) });
    expect(s?.user.role).not.toBe("admin");
  });
  it("rejeita senha curta (<12) no cadastro", async () => {
    await expect(auth.api.signUpEmail({ body: { email: "x@teste.local", name: "x", password: "curta" } })).rejects.toBeTruthy();
  });
  it("sem sessão não há usuário", async () => {
    expect(await auth.api.getSession({ headers: new Headers() })).toBeNull();
  });
});
