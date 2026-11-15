import { describe, it, expect } from "vitest";
import { availability } from "../src/lib/availability";
import { liveCourses } from "../src/data/live-courses";
import { existsSync } from "node:fs";

const NOW = new Date("2026-11-15T12:00:00-03:00");
describe("disponibilidade dos cursos ao vivo", () => {
  const states = liveCourses.map((c) => availability(c, NOW));
  it("há ao menos 1 esgotado e 2 encerrados, e ainda existem turmas abertas", () => {
    expect(states.filter((s) => s === "ESGOTADO").length).toBeGreaterThanOrEqual(1);
    expect(states.filter((s) => s === "ENCERRADO").length).toBeGreaterThanOrEqual(2);
    expect(states).toContain("ABERTO");
  });
  it("turma passada prevalece sobre esgotada", () => {
    expect(availability({ soldOut: true, startsAt: "2026-01-01T00:00:00Z" }, NOW)).toBe("ENCERRADO");
  });
  it("todas as imagens referenciadas existem e os slugs são únicos", () => {
    const imgs = liveCourses.flatMap((c) => [c.image!, ...(c.gallery ?? [])]);
    expect(imgs.every((i) => existsSync(`public${i}`))).toBe(true);
    expect(new Set(liveCourses.map((c) => c.slug)).size).toBe(liveCourses.length);
  });
  it("só informa preço quando o flyer informa (Módulo 4)", () => {
    expect(liveCourses.filter((c) => c.priceBrl !== null).map((c) => c.slug)).toEqual(["food-fraud-360-modulo-4-bovinos-ovinos-embutidos"]);
  });
});
