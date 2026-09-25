import { NextResponse, type NextRequest } from "next/server";
import { updateSessionMiddleware } from "@gezgin/supabase-web";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = updateSessionMiddleware(request, response);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const pathname = request.nextUrl.pathname;
      const isProtectedRoute = pathname.startsWith("/profile");
      const isAuthRoute =
        pathname.startsWith("/login") || pathname.startsWith("/register");

      if (isProtectedRoute && !user) {
        const redirectUrl = new URL("/login", request.url);
        redirectUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(redirectUrl);
      }

      if (isAuthRoute && user) {
        return NextResponse.redirect(new URL("/profile", request.url));
      }
    } catch (err) {
      console.warn("Session middleware check notice:", err);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
