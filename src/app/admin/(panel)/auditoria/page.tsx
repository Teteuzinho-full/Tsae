import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { auditLogs, user } from "@/db/schema";

export default async function Audit() {
  const rows = await db.select({ id: auditLogs.id, at: auditLogs.createdAt, action: auditLogs.action, entity: auditLogs.entity, entityId: auditLogs.entityId, actor: user.email })
    .from(auditLogs).leftJoin(user, eq(user.id, auditLogs.actorId)).orderBy(desc(auditLogs.createdAt)).limit(200);
  return (<><h1 className="text-3xl font-bold">Auditoria</h1>
    <div className="mt-8 overflow-x-auto rounded-2xl bg-white"><table className="w-full text-left text-sm">
      <thead className="border-b border-black/10 text-graphite/60"><tr><th className="p-3">Data</th><th>Administrador</th><th>Ação</th><th>Entidade</th></tr></thead>
      <tbody>{rows.map((r) => (<tr key={r.id} className="border-b border-black/5"><td className="p-3">{r.at.toLocaleString("pt-BR")}</td><td>{r.actor ?? "—"}</td><td>{r.action}</td><td>{r.entity} {r.entityId?.slice(0, 8)}</td></tr>))}</tbody></table></div></>);
}
