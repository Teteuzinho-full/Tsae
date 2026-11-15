import { desc } from "drizzle-orm";
import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { mediaAssets, auditLogs } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { saveImage } from "@/lib/media";

async function upload(formData: FormData) {
  "use server";
  const admin = await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("Arquivo ausente");
  const row = await saveImage(db, { put: (p, b, o) => put(p, Buffer.from(b), { ...o, addRandomSuffix: false }), del: (u) => del(u) },
    { bytes: new Uint8Array(await file.arrayBuffer()), declaredType: file.type, alt: String(formData.get("alt") ?? "") });
  await db.insert(auditLogs).values({ actorId: admin.id, action: "media:upload", entity: "media", entityId: row.id });
  revalidatePath("/admin/midia");
}

export default async function Media() {
  const rows = await db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt)).limit(60);
  return (<><h1 className="text-3xl font-bold">Mídia</h1>
    <form action={upload} className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-5">
      <input type="file" name="file" accept="image/jpeg,image/png,image/webp" required />
      <input name="alt" required maxLength={200} placeholder="Texto alternativo" className="min-w-64 flex-1 rounded-lg border border-black/15 px-3 py-2" />
      <button className="rounded-full bg-brand-red px-5 py-2 text-sm font-semibold text-white">Enviar (até 5 MB)</button></form>
    <div className="mt-8 grid gap-4 sm:grid-cols-3">{rows.map((m) => (<figure key={m.id} className="rounded-2xl bg-white p-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}<img src={m.url} alt={m.alt} className="h-36 w-full rounded-lg object-cover" /><figcaption className="mt-2 text-xs text-graphite/60">{m.alt}</figcaption></figure>))}</div></>);
}
