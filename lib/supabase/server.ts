import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { assertSupabaseEnv, supabaseAnonKey, supabaseUrl } from './shared';

export function getServerSupabase() {
  assertSupabaseEnv();
  const cookieStore = cookies();

  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components can be read-only; middleware/route handlers persist auth cookies.
        }
      }
    }
  });
}
