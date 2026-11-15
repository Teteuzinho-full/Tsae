import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts, blogCategories } from "@/db/schema";
import { Header, Footer } from "@/components/Header";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Artigos e conteúdos técnicos", description: "Conteúdos técnicos da TSAE sobre inspeção, regulamentação e segurança dos alimentos." };

export default async function Blog({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams;
  const on = !!process.env.DATABASE_URL;
  const cats = on ? await db.select().from(blogCategories).orderBy(blogCategories.name) : [];
  const active = cats.find((c) => c.slug === categoria);
  const posts = on ? await db.select().from(blogPosts).where(and(eq(blogPosts.status, "PUBLISHED"), active ? eq(blogPosts.categoryId, active.id) : undefined)).orderBy(desc(blogPosts.publishedAt)) : [];
  const chip = "rounded-full border border-black/15 px-4 py-1.5 text-sm";
  return (<><Header unit="consultoria" /><main className="mx-auto max-w-3xl px-5 py-16"><h1 className="text-3xl font-bold">Artigos</h1>
    {cats.length > 0 && <nav aria-label="Categorias" className="mt-6 flex flex-wrap gap-2"><Link href="/blog" className={`${chip} ${!active ? "bg-brand-gold" : ""}`}>Todos</Link>
      {cats.map((c) => <Link key={c.id} href={`/blog?categoria=${c.slug}`} className={`${chip} ${active?.id === c.id ? "bg-brand-gold" : ""}`}>{c.name}</Link>)}</nav>}
    {posts.length === 0 && <p className="mt-6 text-graphite/70">Em breve.</p>}
    <div className="mt-8 grid gap-4">{posts.map((p) => (<Link key={p.id} href={`/blog/${p.slug}`} className="rounded-2xl border border-black/10 p-6 hover:shadow-lg"><h2 className="text-xl font-semibold">{p.title}</h2><p className="mt-2 text-sm text-graphite/70">{p.excerpt}</p></Link>))}</div></main><Footer /></>);
}
