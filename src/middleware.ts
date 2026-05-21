import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  isValidAdminToken,
} from "@/lib/auth/admin-cookie";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthenticated = isValidAdminToken(token);

  if (pathname.startsWith("/admin/login")) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/products", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
