import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@gezgin/supabase-web";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    try {
      const cookieStore = cookies();
      const supabase = createServerClient(cookieStore);
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(new URL(next, origin));
      }
    } catch (err) {
      console.error("Auth callback exchange error:", err);
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=auth_callback_failed", origin),
  );
}
