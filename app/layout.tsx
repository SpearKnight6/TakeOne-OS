import './globals.css';
import Link from 'next/link';
import { ReactNode } from 'react';

export const metadata = {
  title: 'TakeOne-OS',
  description: 'Production workflow MVP'
};

export default function RootLayout({ children }: { children: ReactNode }) {
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
