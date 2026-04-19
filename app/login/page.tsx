'use client';

import { CSSProperties, FormEvent, useState } from 'react';
import { getBrowserSupabase } from '@/lib/supabase/client';

type AuthMode = 'login' | 'signup';

function CinematicHero() {
  const campaignAssets = ['Poster', 'Teaser', 'Trailer', 'Song', 'BTS', 'Release'] as const;

  return (
    <div className="auth-hero-frame" aria-hidden="true">
      <div className="campaign-grid">
        {campaignAssets.map((asset, index) => (
          <article
            key={asset}
            className="campaign-block"
            style={{ ['--asset-index' as string]: index } as CSSProperties}
          >
            <p className="campaign-block-label">{asset}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onEmailPasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const next = new URLSearchParams(window.location.search).get('next') ?? '/projects';
    let authError: Error | null = null;

    try {
      const supabase = getBrowserSupabase();

      if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        authError = signInError;
      } else {
        const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectTo
          }
        });
        authError = signUpError;
      }
    } catch (clientError) {
      authError = clientError as Error;
    }

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (mode === 'signup') {
      setMessage('Account created. Check your inbox to verify and continue to TakeOne OS.');
      setPassword('');
      setLoading(false);
      return;
    }

    window.location.assign(next);
  }

  async function onGoogleSignIn() {
    setLoading(true);
    setMessage(null);
    setError(null);

    const next = new URLSearchParams(window.location.search).get('next') ?? '/projects';
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

    let authError: Error | null = null;

    try {
      const supabase = getBrowserSupabase();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo }
      });
      authError = oauthError;
    } catch (clientError) {
      authError = clientError as Error;
    }

    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell auth-shell--cinematic">
      <section className="auth-brand-column" aria-label="TakeOne OS brand introduction">
        <p className="auth-headline">Control your film&rsquo;s momentum</p>
        <p className="auth-subheadline">From first signal to post-release impact</p>
        <p className="auth-lede">
          Direct campaign launches, creative rollouts, and release-phase performance through one premium
          operating surface for film marketing teams.
        </p>
        <CinematicHero />
      </section>

      <section className="auth-card card">
        <p className="auth-eyebrow">TakeOne OS</p>
        <h2>{mode === 'login' ? 'Welcome back to campaign control' : 'Create your command center account'}</h2>
        <p className="muted">Secure access for studio marketing, production, and distribution teams.</p>

        <div className="auth-mode-switch" role="tablist" aria-label="Choose authentication mode">
          <button
            type="button"
            className={`auth-mode-button ${mode === 'login' ? 'is-active' : ''}`}
            onClick={() => setMode('login')}
            aria-selected={mode === 'login'}
            role="tab"
          >
            Log in
          </button>
          <button
            type="button"
            className={`auth-mode-button ${mode === 'signup' ? 'is-active' : ''}`}
            onClick={() => setMode('signup')}
            aria-selected={mode === 'signup'}
            role="tab"
          >
            Sign up
          </button>
        </div>

        <button className="auth-google-button" type="button" onClick={onGoogleSignIn} disabled={loading}>
          Continue with Google
        </button>

        <div className="auth-divider" role="presentation">
          <span>or continue with email</span>
        </div>

        <form className="form auth-form" onSubmit={onEmailPasswordSubmit}>
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
          <label>
            Password
            <input
              type="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={mode === 'login' ? 'Enter your password' : 'Create a secure password'}
              required
              minLength={8}
            />
          </label>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading
              ? 'Please wait…'
              : mode === 'login'
                ? 'Log in to TakeOne OS'
                : 'Create account and continue'}
          </button>
        </form>

        <p className="auth-supporting-text">Used by marketing, production, and distribution teams.</p>

        {message ? <p className="auth-success">{message}</p> : null}
        {error ? <p className="auth-error">{error}</p> : null}
      </section>
    </div>
  );
}
