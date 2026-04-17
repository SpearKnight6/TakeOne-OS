'use client';

import { FormEvent, useMemo, useState } from 'react';
import { getBrowserSupabase } from '@/lib/supabase/client';

type AuthMode = 'login' | 'signup';

type HeroGlyphProps = {
  className: string;
  circles: ReadonlyArray<readonly [number, number]>;
};

function HeroGlyph({ className, circles }: HeroGlyphProps) {
  return (
    <g className={`hero-glyph ${className}`}>
      {circles.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.7" />
      ))}
    </g>
  );
}

function CinematicHero() {
  const clapboard = useMemo(
    () => [
      [30, 80],
      [48, 80],
      [66, 80],
      [84, 80],
      [102, 80],
      [120, 80],
      [138, 80],
      [156, 80],
      [174, 80],
      [30, 96],
      [48, 96],
      [66, 96],
      [84, 96],
      [102, 96],
      [120, 96],
      [138, 96],
      [156, 96],
      [174, 96],
      [44, 114],
      [62, 114],
      [80, 114],
      [98, 114],
      [116, 114],
      [134, 114],
      [152, 114],
      [40, 132],
      [58, 132],
      [76, 132],
      [94, 132],
      [112, 132],
      [130, 132],
      [148, 132],
      [166, 132]
    ] as const,
    []
  );

  const frame = useMemo(
    () => [
      [26, 56],
      [44, 56],
      [62, 56],
      [80, 56],
      [98, 56],
      [116, 56],
      [134, 56],
      [152, 56],
      [170, 56],
      [188, 56],
      [26, 74],
      [26, 92],
      [26, 110],
      [26, 128],
      [188, 74],
      [188, 92],
      [188, 110],
      [188, 128],
      [26, 146],
      [44, 146],
      [62, 146],
      [80, 146],
      [98, 146],
      [116, 146],
      [134, 146],
      [152, 146],
      [170, 146],
      [188, 146]
    ] as const,
    []
  );

  const play = useMemo(
    () => [
      [72, 62],
      [72, 80],
      [72, 98],
      [72, 116],
      [72, 134],
      [90, 72],
      [90, 90],
      [90, 108],
      [90, 126],
      [108, 82],
      [108, 100],
      [108, 118],
      [126, 92],
      [126, 110],
      [144, 102]
    ] as const,
    []
  );

  const spotlight = useMemo(
    () => [
      [106, 50],
      [124, 58],
      [142, 66],
      [160, 74],
      [178, 82],
      [196, 90],
      [96, 68],
      [114, 76],
      [132, 84],
      [150, 92],
      [168, 100],
      [186, 108],
      [86, 86],
      [104, 94],
      [122, 102],
      [140, 110],
      [158, 118],
      [176, 126],
      [76, 104],
      [94, 112],
      [112, 120],
      [130, 128],
      [148, 136],
      [166, 144],
      [68, 126],
      [86, 134],
      [104, 142],
      [122, 150],
      [140, 158]
    ] as const,
    []
  );

  const poster = useMemo(
    () => [
      [42, 58],
      [60, 58],
      [78, 58],
      [96, 58],
      [114, 58],
      [132, 58],
      [150, 58],
      [168, 58],
      [42, 76],
      [60, 76],
      [78, 76],
      [96, 76],
      [114, 76],
      [132, 76],
      [150, 76],
      [168, 76],
      [42, 98],
      [60, 98],
      [78, 98],
      [132, 98],
      [150, 98],
      [168, 98],
      [42, 116],
      [60, 116],
      [78, 116],
      [132, 116],
      [150, 116],
      [168, 116],
      [42, 138],
      [60, 138],
      [78, 138],
      [96, 138],
      [114, 138],
      [132, 138],
      [150, 138],
      [168, 138]
    ] as const,
    []
  );

  return (
    <div className="auth-hero-frame" aria-hidden="true">
      <svg viewBox="0 0 220 200" className="auth-hero-svg">
        <defs>
          <filter id="hero-soft-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4.6" result="blurred" />
            <feMerge>
              <feMergeNode in="blurred" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g className="hero-grid" filter="url(#hero-soft-glow)">
          <HeroGlyph className="glyph-clapboard" circles={clapboard} />
          <HeroGlyph className="glyph-frame" circles={frame} />
          <HeroGlyph className="glyph-play" circles={play} />
          <HeroGlyph className="glyph-spotlight" circles={spotlight} />
          <HeroGlyph className="glyph-poster" circles={poster} />
        </g>
      </svg>
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
