"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE_MAX_AGE,
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_VALUE,
} from "@/lib/auth/admin-cookie";

export type AdminLoginResult =
  | { success: true }
  | { success: false; error: string };

export async function loginAdmin(password: string): Promise<AdminLoginResult> {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return {
      success: false,
      error: "הגדרות השרת חסרות. פנו למנהל המערכת.",
    };
  }

  if (password !== adminPassword) {
    return { success: false, error: "סיסמת מנהל שגויה." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ADMIN_COOKIE_MAX_AGE,
    path: "/",
  });

  return { success: true };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  redirect("/");
}
