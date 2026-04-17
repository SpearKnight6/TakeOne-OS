import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';

export async function getCurrentUser() {
  try {
    const supabase = getServerSupabase();
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();

    if (error) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  return user;
}
