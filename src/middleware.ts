import { NextRequest, NextResponse } from "next/server";
import { auth } from "./app/api/auth/[...nextauth]/route";

const protectedRoutes = ["/dashboard"];

export default async function middleware(req: NextRequest) {
  const session = await auth();
  const { pathname } = req.nextUrl;
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  // if (!isProtected && session) {
  //   return NextResponse.redirect(new URL("/dashboard", req.url));
  // }

  return NextResponse.next();
}
