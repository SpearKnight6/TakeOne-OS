import { createBrowserClient } from '@supabase/ssr';
import { assertSupabaseEnv, supabaseAnonKey, supabaseUrl } from './shared';

export function getBrowserSupabase() {
  assertSupabaseEnv();
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}
