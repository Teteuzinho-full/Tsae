import type { MetadataRoute } from "next";
import { getCourses } from "@/lib/catalog";
export const dynamic = "force-dynamic";
const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let slugs: string[] = [];
  try { slugs = (await getCourses()).map((c) => `/educa/${c.slug}`); } catch { /* banco indisponível: só páginas fixas */ }
  return ["", "/educa", "/blog", "/privacidade", ...slugs].map((p) => ({ url: site + p, lastModified: new Date() }));
}
