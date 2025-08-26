"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createActionServerCookies = async () => {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return (await cookieStore).getAll().map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          }));
        },
        async setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          for (const { name, value, options } of cookiesToSet) {
            try {
              (await cookieStore).set({ name, value, ...options });
            } catch (error) {
              
            }
          }
        },
      },
    }
  );
};
