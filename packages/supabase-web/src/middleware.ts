import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { Database } from "@gezgin/types";

export interface MiddlewareRequest {
  cookies: {
    get(name: string): { name: string; value: string } | undefined;
    set(options: { name: string; value: string } & CookieOptions): void;
  };
}

export interface MiddlewareResponse {
  cookies: {
    set(options: { name: string; value: string } & CookieOptions): void;
  };
}

export function updateSessionMiddleware<
  Req extends MiddlewareRequest,
  Res extends MiddlewareResponse,
>(request: Req, response: Res) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
    );
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: "", ...options, maxAge: 0 });
        response.cookies.set({ name, value: "", ...options, maxAge: 0 });
      },
    },
  });

  return supabase;
}
