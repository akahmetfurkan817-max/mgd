import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { can, sectionFromPath } from "@/lib/permissions";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const user = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === "/admin/login") {
    return user ? NextResponse.redirect(new URL("/admin", req.url)) : NextResponse.next();
  }
  if (!user) return NextResponse.redirect(new URL("/admin/login", req.url));

  const section = sectionFromPath(pathname);
  if (section && !can(user.role, section)) {
    return NextResponse.redirect(new URL("/admin?denied=1", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
