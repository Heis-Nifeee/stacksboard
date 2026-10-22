import type { ReactNode } from 'react';
import './globals.css';
import { WalletProvider } from '../components/WalletConnect';
import Header from '../components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'StacksBoard — On-chain guestbook',
  description: 'A public guestbook on Stacks.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-[#12110f]">
      <body className="bg-[#12110f] text-white">
        <WalletProvider>
          <Header />
          {children}
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
