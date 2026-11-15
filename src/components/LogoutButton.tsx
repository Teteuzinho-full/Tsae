"use client";
import { authClient } from "@/lib/auth-client";
export function LogoutButton({ to }: { to: string }) {
  return <button onClick={async () => { await authClient.signOut(); location.href = to; }} className="text-sm underline">Sair</button>;
}
