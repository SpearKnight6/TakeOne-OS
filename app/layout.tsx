import type { Metadata } from 'next';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import './globals.css';

export const metadata: Metadata = {
  title: 'TakeOne OS MVP',
  description: 'Lightweight production ops MVP optimized for free tiers.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <header className="topbar">
          <h1 className="brand">TakeOne-OS</h1>
          <nav className="topbar-nav">
            <Link href="/">Dashboard</Link>
            <Link href="/projects">Projects</Link>
          </nav>
          <ThemeToggle />
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
