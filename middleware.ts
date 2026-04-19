import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const isAuthPage = request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register";

  //  Agar user login nahi hai
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  //  Agar user already login hai aur login page open kar raha
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}



// export const config = {
//   matcher: [
//     "/", 
//     "/dashboard",
//     "/profile",
//     "/login",
//     "/register"
//   ],
// };

export const config = {
  matcher: [
    /*
      Match all request paths except:
      - _next (Next.js internals)
      - api (API routes)
      - static files (images, favicon, etc.)
    */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};