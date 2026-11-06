import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import type { AdminUser } from "@/types";

/** Sunucu bileşenlerinde oturumdaki kullanıcıyı döndürür; yoksa girişe yönlendirir. */
export async function requireUser(): Promise<AdminUser> {
  const user = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!user) redirect("/admin/login");
  return user;
}
