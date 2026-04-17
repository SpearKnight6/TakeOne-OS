import type { Metadata } from 'next';
import Link from 'next/link';
import { signOut } from '@/app/actions';
import { ThemeToggle } from '@/components/theme-toggle';
import { getCurrentUser } from '@/lib/auth';
import './globals.css';

export const metadata: Metadata = {
  title: 'TakeOne OS MVP',
  description: 'Lightweight production ops MVP optimized for free tiers.'
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="en" data-theme="dark">
      <body>
        <header className="topbar">
          <h1 className="brand">TakeOne-OS</h1>
          {user ? (
            <nav className="topbar-nav">
              <Link href="/projects">Projects</Link>
              <form action={signOut}>
                <button className="topbar-logout" type="submit">Sign out</button>
              </form>
            </nav>
          ) : <div />}
          <ThemeToggle />
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
