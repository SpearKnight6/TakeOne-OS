import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'TakeOne OS MVP',
  description: 'Lightweight production ops MVP optimized for free tiers.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <h1>TakeOne-OS</h1>
          <nav>
            <Link href="/">Dashboard</Link>
            <Link href="/projects">Projects</Link>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}