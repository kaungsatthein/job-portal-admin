import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH = process.env.NEXT_PUBLIC_USER_ACCESS_TOKEN || "token";

export function middleware(req: NextRequest) {
  const token = req.cookies.get(AUTH)?.value;
  const { pathname } = req.nextUrl;

  console.log("Middleware - Path:", pathname, "Token exists:", !!token);

  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const protectedRoutes = ["/"];
  const isProtectedRoute = protectedRoutes.some((route) => {
    return route === pathname || pathname.startsWith(route + "/");
  });

  if (!token && isProtectedRoute) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg).*)",
  ],
};
