import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
// Somente servidor: DATABASE_URL nunca vai ao navegador.
export const db = drizzle(neon(process.env.DATABASE_URL ?? "postgres://invalid"), { schema });
