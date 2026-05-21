import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  isValidAdminToken,
} from "@/lib/auth/admin-cookie";

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return isValidAdminToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

export async function requireAdmin() {
  const authorized = await isAdminAuthenticated();

  if (!authorized) {
    return { authorized: false as const };
  }

  return { authorized: true as const };
}
