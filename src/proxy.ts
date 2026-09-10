import { NextResponse } from "next/server";

import { auth } from "@/auth";

export default auth((request) => {
  const protectedPath = request.nextUrl.pathname.startsWith("/utkast") || request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/innstillinger");
  if (protectedPath && !request.auth?.user?.isEditor) {
    return NextResponse.redirect(new URL("/innlogging", request.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/utkast/:path*", "/admin/:path*", "/innstillinger/:path*"],
};
