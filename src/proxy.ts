import { NextResponse, type NextRequest } from "next/server";
import { hasUntranslatedSegment, internalPath, localePath, frenchPath } from "@/i18n/paths";

/**
 * Public URLs → the [lang] routes. French pages keep their URLs (`/recherche`
 * renders `/fr/recherche`); English pages live under /en with English segments
 * (`/en/research` renders `/en/recherche`). Prefixed French URLs and English
 * URLs with French segments redirect to their canonical form.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();
  if (pathname === "/fr" || pathname.startsWith("/fr/")) {
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }
  if (hasUntranslatedSegment(pathname)) {
    url.pathname = localePath("en", frenchPath(`/${pathname.split("/").slice(2).join("/")}`));
    return NextResponse.redirect(url, 308);
  }
  url.pathname = internalPath(pathname);
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*opengraph-image|.*\\..*).*)"],
};
