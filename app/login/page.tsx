'use client';

import { FormEvent, useState } from 'react';
import { getBrowserSupabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const next = new URLSearchParams(window.location.search).get('next') ?? '/projects';
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

    let signInError: Error | null = null;
    try {
      const supabase = getBrowserSupabase();
      const result = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo }
      });
      signInError = result.error;
    } catch (clientError) {
      signInError = clientError as Error;
    }

    if (signInError) {
      setError(signInError.message);
    } else {
      setMessage('Magic link sent. Check your inbox to continue to TakeOne OS.');
      setEmail('');
    }

    setLoading(false);
  }

  return (
    <div className="auth-shell">
      <div className="auth-intro">
        <p className="auth-headline">Control your film&rsquo;s momentum.</p>
        <p className="auth-subheadline">From first signal to post-release impact.</p>
      </div>
      <section className="auth-card card">
        <p className="auth-eyebrow">TakeOne OS</p>
        <h2>Enter your film campaign command center</h2>
        <p className="muted">Use your work email to receive a secure magic link.</p>

        <form className="form" onSubmit={onSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@studio.com"
              required
            />
          </label>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Sending…' : 'Access your command center'}
          </button>
        </form>
        <p className="auth-supporting-text">Used by marketing, production, and distribution teams.</p>

        {message ? <p className="auth-success">{message}</p> : null}
        {error ? <p className="auth-error">{error}</p> : null}
      </section>
    </div>
  );
}
