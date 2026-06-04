import { auth } from "@/lib/auth";
import { ACTIVE_PROJECT_COOKIE } from "@/lib/constants";
import { NextResponse } from "next/server";

const publicPaths = ["/prihlaseni", "/registrace", "/api/auth"];

function withActiveProjectCookie(
  response: NextResponse,
  projectId: string
) {
  response.cookies.set(ACTIVE_PROJECT_COOKIE, projectId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));
  const isLoggedIn = !!req.auth;
  const projectMatch = pathname.match(/^\/p\/([^/]+)/);

  if (!isLoggedIn && !isPublic && pathname !== "/") {
    const url = new URL("/prihlaseni", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (isLoggedIn && (pathname === "/prihlaseni" || pathname === "/registrace")) {
    return NextResponse.redirect(new URL("/projekty", req.nextUrl.origin));
  }

  if (isLoggedIn && projectMatch) {
    return withActiveProjectCookie(NextResponse.next(), projectMatch[1]);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
