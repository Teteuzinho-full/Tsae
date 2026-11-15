import { db } from "../db";
import { auditLogs } from "../db/schema";
export const audit = (actorId: string, action: string, entity: string, entityId?: string) => db.insert(auditLogs).values({ actorId, action, entity, entityId });
