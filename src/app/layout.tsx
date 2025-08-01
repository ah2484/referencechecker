import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { initializeProviders } from '../providers/init';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Reference Validator - Open Source',
  description: 'Open source reference and employment validation tool for hiring teams',
  keywords: ['reference validation', 'hiring', 'hr tools', 'employment verification', 'open source'],
  authors: [{ name: 'Reference Validator Team' }],
  openGraph: {
    title: 'Reference Validator - Open Source',
    description: 'Open source reference and employment validation tool for hiring teams',
    type: 'website',
  },
};

// Initialize providers on app startup
if (typeof window === 'undefined') {
  // Only run on server side
  initializeProviders();
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  );
} 