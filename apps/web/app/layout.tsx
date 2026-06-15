import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Saven InfraOps Command Center',
  description: 'AI-first enterprise InfraOps portal for Saven'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
