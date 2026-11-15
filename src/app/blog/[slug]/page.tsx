import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { Header, Footer } from "@/components/Header";
export const dynamic = "force-dynamic";
type P = { params: Promise<{ slug: string }> };
async function find(slug: string) {
  if (!process.env.DATABASE_URL) return null;
  const [p] = await db.select().from(blogPosts).where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, "PUBLISHED")));
  return p ?? null;
}
export async function generateMetadata({ params }: P): Promise<Metadata> { const p = await find((await params).slug); return p ? { title: p.title, description: p.excerpt } : {}; }
export default async function Post({ params }: P) {
  const p = await find((await params).slug);
  if (!p) notFound();
  return (<><Header unit="consultoria" /><main className="mx-auto max-w-3xl px-5 py-16"><h1 className="text-4xl font-bold">{p.title}</h1>
    {p.content.split(/\n{2,}/).map((t, i) => <p key={i} className="mt-5 leading-relaxed text-graphite/85">{t}</p>)}</main><Footer /></>);
}
