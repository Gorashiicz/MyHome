import { ACTIVE_PROJECT_COOKIE } from "@/lib/constants";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/prihlaseni", "/registrace", "/api/auth", "/api/health"];

function hasSessionCookie(request: NextRequest) {
  return Boolean(
    request.cookies.get("__Secure-authjs.session-token")?.value ||
      request.cookies.get("authjs.session-token")?.value
  );
}

function withActiveProjectCookie(response: NextResponse, projectId: string) {
  response.cookies.set(ACTIVE_PROJECT_COOKIE, projectId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));
  const isLoggedIn = hasSessionCookie(request);
  const projectMatch = pathname.match(/^\/p\/([^/]+)/);

  if (!isLoggedIn && !isPublic && pathname !== "/") {
    const url = new URL("/prihlaseni", request.nextUrl.origin);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (isLoggedIn && (pathname === "/prihlaseni" || pathname === "/registrace")) {
    return NextResponse.redirect(new URL("/projekty", request.nextUrl.origin));
  }

  if (isLoggedIn && projectMatch) {
    return withActiveProjectCookie(NextResponse.next(), projectMatch[1]);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
