import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TakeOne OS MVP',
  description: 'Lightweight production ops MVP optimized for free tiers.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
