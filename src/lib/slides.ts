import { and, asc, eq } from "drizzle-orm";
import { db } from "../db";
import { carouselSlides } from "../db/schema";

export type SlideData = { title: string; text: string; href?: string };
// Slides do painel quando existirem; caso contrário (ou sem banco), os padrões do site.
export async function getSlides(unit: "CONSULTORIA" | "EDUCA", fallback: SlideData[]): Promise<SlideData[]> {
  if (!process.env.DATABASE_URL) return fallback;
  try {
    const rows = await db.select().from(carouselSlides).where(and(eq(carouselSlides.unit, unit), eq(carouselSlides.active, true))).orderBy(asc(carouselSlides.position));
    return rows.length ? rows.map((r) => ({ title: r.title, text: r.description ?? "", href: r.href ?? undefined })) : fallback;
  } catch { return fallback; }
}
