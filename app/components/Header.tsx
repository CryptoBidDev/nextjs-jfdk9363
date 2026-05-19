'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import NotificationBell from '@/app/components/NotificationBell';

type User = {
  email: string;
  accountStatus?: string;
};

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem('cryptobidx-user');
      if (savedUser) setUser(JSON.parse(savedUser));
      if (!savedUser) setUser(null);
    };

    loadUser();

    window.addEventListener('storage', loadUser);
    window.addEventListener('cryptobidx_data_updated', loadUser);

    return () => {
      window.removeEventListener('storage', loadUser);
      window.removeEventListener('cryptobidx_data_updated', loadUser);
    };
  }, []);

  function confirmLogout() {
    localStorage.removeItem('cryptobidx-user');
    setUser(null);
    setShowLogoutConfirm(false);

    window.dispatchEvent(new Event('cryptobidx_data_updated'));


  return (
    <>
      <header className="w-full bg-[#020617] text-white mb-12">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-8">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-4 shrink-0">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <span className="text-3xl font-black text-white">X</span>
            </div>

            <div>
              <p className="text-3xl font-black tracking-tight leading-none">
                Crypto
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent">
                  BidX
                </span>
              </p>
              <p className="text-xs text-slate-500 tracking-wide uppercase mt-1">
                Escrow-backed crypto auctions
              </p>
            </div>
          </Link>

          {/* CENTER NAV (always visible) */}
          <nav className="flex justify-center items-center gap-6 text-sm">
            <Link
              href="/how-it-works"
              className="text-slate-300 hover:text-white transition font-semibold"
            >
              How It Works
            </Link>
            <Link
              href="/why"
              className="text-slate-300 hover:text-white transition font-semibold"
            >
              Why
            </Link>
            <Link
              href="/for-sellers"
              className="text-slate-300 hover:text-white transition font-semibold"
            >
              Sellers
            </Link>
            <Link
              href="/for-buyers"
              className="text-slate-300 hover:text-white transition font-semibold"
            >
              Buyers
            </Link>
            <Link
              href="/trust"
              className="text-slate-300 hover:text-white transition font-semibold"
            >
              Trust
            </Link>
            <Link
              href="/faq"
              className="text-slate-300 hover:text-white transition font-semibold"
            >
              FAQ
            </Link>
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3 justify-end">
            {/* 🔔 ONLY show bell when logged in */}
            {user && <NotificationBell />}

            {/* 🔒 AUTH-ONLY BUTTONS */}
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-xl bg-cyan-600 px-4 py-2 font-semibold hover:bg-cyan-500 transition"
                >
                  Dashboard
                </Link>

                <Link
                  href="/wallet"
                  className="rounded-xl bg-purple-600 px-4 py-2 font-semibold hover:bg-purple-500 transition"
                >
                  Wallet
                </Link>

                <Link
                  href="/sell"
                  className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold hover:bg-emerald-500 transition whitespace-nowrap"
                >
                  Sell Crypto
                </Link>

                <Link
                  href="/admin"
                  className="rounded-xl bg-red-600 px-4 py-2 font-semibold hover:bg-red-500 transition"
                >
                  Admin
                </Link>

                <div className="rounded-xl bg-[#020617] border border-slate-800 px-4 py-2 min-w-[190px]">
                  <p className="text-xs text-slate-500">Logged in as</p>
                  <p className="text-sm font-semibold truncate">{user.email}</p>
                </div>

                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="rounded-xl bg-red-600 px-4 py-2 font-semibold hover:bg-red-500 transition"
                >
                  Logout
                </button>
              </>
            )}

            {/* 🔓 LOGGED OUT STATE */}
            {!user && (
              <Link
                href="/login"
                className="rounded-xl bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-500 transition whitespace-nowrap"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* LOGOUT CONFIRM MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-8">
            <h2 className="text-2xl font-bold mb-3">Confirm Logout</h2>

            <p className="text-slate-400 mb-6">
              Are you sure you want to log out of your CryptoBidX account?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 font-semibold hover:border-blue-500 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmLogout}
                className="w-full rounded-xl bg-red-600 px-4 py-3 font-semibold hover:bg-red-500 transition"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
