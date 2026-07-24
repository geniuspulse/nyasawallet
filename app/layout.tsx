import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });

export const metadata: Metadata = {
  title: {
    default: 'Nyasawallet — Your wallet, your freedom.',
    template: '%s | Nyasawallet',
  },
  description: 'Your pan-African digital wallet, allowing you to store, send, and spend USDT and local fiat currency with ease. Access global markets with a virtual debit card and build wealth through our referral network.',
  keywords: ['USDT', 'crypto wallet', 'Malawi', 'Africa', 'buy USDT', 'sell USDT', 'mobile money', 'NyasaWallet'],
  authors: [{ name: 'Arthur Chibondo' }],
  openGraph: {
    title: 'Nyasawallet — Your wallet, your freedom.',
    description: 'Your pan-African digital wallet for USDT and local fiat currency.',
    type: 'website',
    siteName: 'Nyasawallet',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-slate-50 antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
