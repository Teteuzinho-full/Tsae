import { describe, it, expect, beforeAll } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "../src/db/schema";
import { requestEnrollment, confirmEnrollment, cancelEnrollment, canAccessCourse } from "../src/lib/enrollments";

let db: ReturnType<typeof drizzle<typeof schema>>; let d: never;
let pub: string, draft: string, soldOut: string, past: string;
const mkUser = async (id: string) => { await db.insert(schema.user).values({ id, name: id, email: `${id}@t.local`, emailVerified: false }); };

beforeAll(async () => {
  db = drizzle(new PGlite(), { schema }); d = db as never;
  await migrate(db, { migrationsFolder: "./drizzle" });
  const [a] = await db.insert(schema.courses).values({ slug: "pub", title: "Pub", description: "x", status: "PUBLISHED", seats: 1 }).returning();
  const [b] = await db.insert(schema.courses).values({ slug: "draft", title: "Draft", description: "x", status: "DRAFT" }).returning();
  const [c1] = await db.insert(schema.courses).values({ slug: "esg", title: "E", description: "x", status: "PUBLISHED", soldOut: true }).returning();
  const [c2] = await db.insert(schema.courses).values({ slug: "pas", title: "P", description: "x", status: "PUBLISHED", startsAt: new Date("2020-01-01") }).returning();
  pub = a.id; draft = b.id; soldOut = c1.id; past = c2.id;
  for (const u of ["u1", "u2", "admin"]) await mkUser(u);
});

describe("inscrições e vagas", () => {
  it("não permite solicitar curso não publicado", async () => {
    await expect(requestEnrollment(d, "u1", draft)).rejects.toThrow("CURSO_INDISPONIVEL");
  });
  it("não permite solicitar turma esgotada nem já realizada", async () => {
    await expect(requestEnrollment(d, "u1", soldOut)).rejects.toThrow("INSCRICOES_ENCERRADAS");
    await expect(requestEnrollment(d, "u1", past)).rejects.toThrow("INSCRICOES_ENCERRADAS");
  });
  it("solicitação duplicada não cria segundo registro", async () => {
    const first = await requestEnrollment(d, "u1", pub);
    expect(first?.status).toBe("REQUESTED");
    expect(await requestEnrollment(d, "u1", pub)).toBeNull();
  });
  it("sem confirmação não há acesso ao conteúdo", async () => {
    expect(await canAccessCourse(d, "u1", pub)).toBe(false);
  });
  it("respeita o limite de vagas e libera acesso só ao aluno confirmado", async () => {
    const e2 = await requestEnrollment(d, "u2", pub);
    const [e1] = await db.select().from(schema.courseEnrollments).where((await import("drizzle-orm")).eq(schema.courseEnrollments.userId, "u1"));
    await confirmEnrollment(d, e1.id, "admin");
    await expect(confirmEnrollment(d, e2!.id, "admin")).rejects.toThrow("SEM_VAGAS_OU_INVALIDA"); // vaga única já ocupada
    expect(await canAccessCourse(d, "u1", pub)).toBe(true);
    expect(await canAccessCourse(d, "u2", pub)).toBe(false); // IDOR: u2 não acessa por ser de u1
  });
  it("cancelar revoga o acesso e registra auditoria", async () => {
    const [e1] = await db.select().from(schema.courseEnrollments).where((await import("drizzle-orm")).eq(schema.courseEnrollments.userId, "u1"));
    await cancelEnrollment(d, e1.id, "admin");
    expect(await canAccessCourse(d, "u1", pub)).toBe(false);
    const logs = await db.select().from(schema.auditLogs);
    expect(logs.map((l) => l.action)).toEqual(expect.arrayContaining(["enrollment:confirm", "enrollment:cancel"]));
  });
});
