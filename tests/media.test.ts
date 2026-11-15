import { describe, it, expect, beforeAll } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "../src/db/schema";
import { detectImage, saveImage, type BlobApi } from "../src/lib/media";

const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0, 0]);
const exe = new Uint8Array([0x4d, 0x5a, 0x90, 0, 3, 0, 0, 0, 4, 0, 0, 0, 0]);
let db: ReturnType<typeof drizzle<typeof schema>>; let d: never;
const deleted: string[] = [];
const fake: BlobApi = { put: async (p) => ({ url: `https://x.public.blob.vercel-storage.com/${p}`, pathname: p }), del: async (u) => { deleted.push(u); } };

beforeAll(async () => { db = drizzle(new PGlite(), { schema }); d = db as never; await migrate(db, { migrationsFolder: "./drizzle" }); });

describe("upload seguro de imagens", () => {
  it("detecta pelo conteúdo, não pela extensão", () => {
    expect(detectImage(png)).toBe("image/png");
    expect(detectImage(exe)).toBeNull();
  });
  it("rejeita executável disfarçado de imagem, arquivo grande e falta de alt", async () => {
    await expect(saveImage(d, fake, { bytes: exe, declaredType: "image/png", alt: "x" })).rejects.toThrow("TIPO_INVALIDO");
    await expect(saveImage(d, fake, { bytes: new Uint8Array(6 * 1024 * 1024), declaredType: "image/png", alt: "x" })).rejects.toThrow("TAMANHO_INVALIDO");
    await expect(saveImage(d, fake, { bytes: png, declaredType: "image/png", alt: " " })).rejects.toThrow("ALT_OBRIGATORIO");
  });
  it("grava registro com nome único após upload confirmado", async () => {
    const a = await saveImage(d, fake, { bytes: png, declaredType: "image/png", alt: "capa" });
    const b = await saveImage(d, fake, { bytes: png, declaredType: "image/png", alt: "capa" });
    expect(a.blobPath).not.toBe(b.blobPath);
    expect(a.blobPath).toMatch(/^uploads\/[0-9a-f-]{36}\.png$/);
    expect(await db.select().from(schema.mediaAssets)).toHaveLength(2);
  });
  it("não deixa órfão: remove o arquivo se o banco falhar", async () => {
    const broken = { insert: () => { throw new Error("db off"); } } as never;
    await expect(saveImage(broken, fake, { bytes: png, declaredType: "image/png", alt: "x" })).rejects.toThrow("db off");
    expect(deleted).toHaveLength(1);
  });
});
