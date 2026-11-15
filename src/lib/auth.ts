import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { twoFactor, admin } from "better-auth/plugins";
import { db as defaultDb } from "../db";
import * as schema from "../db/schema";

export function createAuth(database: typeof defaultDb = defaultDb) {
  return betterAuth({
    appName: "TSAE",
  database: drizzleAdapter(database, { provider: "pg", schema }),
  emailAndPassword: { enabled: true, minPasswordLength: 12, maxPasswordLength: 128, autoSignIn: false },
  session: { expiresIn: 60 * 60 * 8, updateAge: 60 * 30 },
  advanced: { useSecureCookies: process.env.NODE_ENV === "production", defaultCookieAttributes: { httpOnly: true, sameSite: "lax" } },
  rateLimit: { enabled: true, window: 60, max: 30 },
  plugins: [twoFactor({ issuer: "TSAE" }), admin({ defaultRole: "student", adminRoles: ["admin"] }), nextCookies()],
});
}
export const auth = createAuth();
