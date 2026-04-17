import { type NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const nextPath = requestUrl.searchParams.get('next') ?? '/projects';

  if (code) {
    try {
      const supabase = getServerSupabase();
      await supabase.auth.exchangeCodeForSession(code);
    } catch {
      return NextResponse.redirect(new URL('/login', requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
}
