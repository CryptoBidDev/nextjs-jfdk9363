'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type User = {
  email: string;
  accountStatus: string;
};

export default function Footer() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('cryptobidx-user');

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  return (
    <footer className="border-t border-slate-800 pt-10 pb-8 mt-16">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <h3 className="text-xl font-bold mb-3">CryptoBidX</h3>

          <p className="text-sm text-slate-400 leading-6">
            Escrow-backed crypto auction marketplace. Transparent bidding,
            controlled settlement and secure price discovery.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-slate-200">
            Marketplace
          </h4>

          <div className="space-y-2 text-sm text-slate-400">
            <Link href="/auctions" className="block hover:text-white">
              Live Auctions
            </Link>

            <Link href="/sell" className="block hover:text-white">
              Create Listing
            </Link>

            {user && (
              <Link
                href="/manage-auctions"
                className="block hover:text-white"
              >
                Auction Management
              </Link>
            )}

            {!user && (
              <Link href="/login" className="block hover:text-white">
                Login / Register
              </Link>
            )}

            <Link href="/contact" className="block hover:text-white">
              Contact Us
            </Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-slate-200">
            Trust & Legal
          </h4>

          <div className="space-y-2 text-sm text-slate-400">
            <Link href="/legal/terms" className="block hover:text-white">
              Terms of Service
            </Link>

            <Link href="/legal/privacy" className="block hover:text-white">
              Privacy Policy
            </Link>

            <Link href="/legal/risk" className="block hover:text-white">
              Risk Disclosure
            </Link>

            <Link
              href="/legal/settlement"
              className="block hover:text-white"
            >
              Settlement Policy
            </Link>

            <Link href="/legal/escrow" className="block hover:text-white">
              Escrow Standards
            </Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-slate-200">
            Supported Assets
          </h4>

          <p className="text-sm text-slate-400 mb-4">
            BTC • ETH • SOL • XRP • USDT • BNB • MATIC • DOGE
          </p>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
            <p className="text-xs text-slate-500 mb-1">
              Platform Disclaimer
            </p>

            <p className="text-xs text-slate-400 leading-5">
              CryptoBidX is a marketplace technology platform and does not act
              as a broker, exchange, financial adviser or financial custodian.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-slate-800 pt-6 text-xs text-slate-500">
        <p>© 2026 CryptoBidX. All rights reserved.</p>

        <p>Built for secure crypto price discovery.</p>
      </div>
    </footer>
  );
}