import { describe, it, expect, beforeAll } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { eq } from "drizzle-orm";
import * as schema from "../src/db/schema";
import { setBan } from "../src/lib/moderation";

process.env.BETTER_AUTH_SECRET = "test-secret-test-secret-test-secret-123";
process.env.BETTER_AUTH_URL = "http://localhost:3000";
const PW = "Senha-Aluno-2026!!";
let db: ReturnType<typeof drizzle<typeof schema>>; let d: never;
let auth: ReturnType<typeof import("../src/lib/auth").createAuth>;
let adminId: string, studentId: string;

beforeAll(async () => {
  db = drizzle(new PGlite(), { schema }); d = db as never;
  await migrate(db, { migrationsFolder: "./drizzle" });
  auth = (await import("../src/lib/auth")).createAuth(d);
  adminId = (await auth.api.signUpEmail({ body: { email: "adm@t.local", name: "Adm", password: "Senha-Admin-2026!!" } })).user.id;
  studentId = (await auth.api.signUpEmail({ body: { email: "al@t.local", name: "Aluno", password: PW } })).user.id;
  await db.update(schema.user).set({ role: "admin" }).where(eq(schema.user.id, adminId));
});

describe("bloqueio de alunos", () => {
  it("bloquear derruba as sessões e impede novo login; desbloquear restaura", async () => {
    await auth.api.signInEmail({ body: { email: "al@t.local", password: PW } });
    expect((await db.select().from(schema.session).where(eq(schema.session.userId, studentId))).length).toBeGreaterThan(0);
    await setBan(d, adminId, studentId, true, "teste");
    expect(await db.select().from(schema.session).where(eq(schema.session.userId, studentId))).toHaveLength(0);
    await expect(auth.api.signInEmail({ body: { email: "al@t.local", password: PW } })).rejects.toBeTruthy();
    await setBan(d, adminId, studentId, false);
    await expect(auth.api.signInEmail({ body: { email: "al@t.local", password: PW } })).resolves.toBeTruthy();
  });
  it("não permite bloquear admin nem a si mesmo, e registra auditoria", async () => {
    await expect(setBan(d, adminId, adminId, true)).rejects.toThrow("PROPRIO_USUARIO");
    const other = (await auth.api.signUpEmail({ body: { email: "adm2@t.local", name: "A2", password: "Senha-Admin-2026!!" } })).user.id;
    await db.update(schema.user).set({ role: "admin" }).where(eq(schema.user.id, other));
    await expect(setBan(d, adminId, other, true)).rejects.toThrow("ADMIN_PROTEGIDO");
    expect((await db.select().from(schema.auditLogs)).map((l) => l.action)).toEqual(expect.arrayContaining(["student:ban", "student:unban"]));
  });
});
