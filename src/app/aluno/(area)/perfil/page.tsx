import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { requireUser } from "@/lib/session";

async function save(fd: FormData) {
  "use server";
  await requireUser();
  const { name } = z.object({ name: z.string().trim().min(2).max(120) }).parse(Object.fromEntries(fd));
  await auth.api.updateUser({ body: { name }, headers: await headers() }); // só o próprio usuário, via sessão
  revalidatePath("/aluno/perfil");
}
export default async function Profile() {
  const u = await requireUser();
  return (<><h1 className="text-3xl font-bold">Meu perfil</h1><p className="mt-2 text-sm text-graphite/60">{u.email}</p>
    <form action={save} className="mt-6 flex max-w-md gap-3"><input name="name" defaultValue={u.name} required minLength={2} className="flex-1 rounded-xl border border-black/15 px-4 py-3" /><button className="rounded-full bg-brand-red px-6 text-white">Salvar</button></form>
    <p className="mt-8 text-sm text-graphite/70">Para correção ou exclusão dos seus dados (LGPD), use o formulário de contato do site.</p></>);
}
