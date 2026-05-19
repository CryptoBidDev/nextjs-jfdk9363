import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ToastProvider from './components/ToastProvider';
import Header from './components/Header';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CryptoBidX',
  description: 'Escrow-backed crypto auction marketplace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-[#020617] text-white`}
      >
        <ToastProvider />

        <div className="min-h-screen bg-[#020617] px-10 xl:px-16 py-8">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}