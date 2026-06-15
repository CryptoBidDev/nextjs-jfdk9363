'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import NotificationBell from '@/app/components/NotificationBell';
import { notify } from '@/app/lib/notifications';

type User = {
  email: string;
  accountStatus?: string;
};

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem('cryptobidx-user');

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
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
    setMobileMenuOpen(false);

    window.dispatchEvent(new Event('cryptobidx_data_updated'));

    notify({
      type: 'success',
      title: 'Logged out',
      message: 'You have been successfully logged out.',
    });
  }

  return (
    <>
      <header className="w-full overflow-hidden bg-[#020617] text-white mb-8 lg:mb-12">
        <div className="mx-auto w-full max-w-7xl py-4 overflow-hidden">
          <div className="flex w-full items-center justify-between gap-3 overflow-hidden">
            {/* LOGO */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden"
            >
              <div className="h-12 w-12 sm:h-16 sm:w-16 shrink-0 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  X
                </span>
              </div>

              <div className="min-w-0 overflow-hidden">
                <p className="truncate text-lg sm:text-3xl font-black tracking-tight leading-none">
                  CryptoTEST
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent">
                    BidX
                  </span>
                </p>

                <p className="hidden sm:block text-xs text-slate-500 tracking-wide uppercase mt-1 truncate">
                  Escrow-backed crypto auctions
                </p>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden xl:flex justify-center items-center gap-6 text-sm shrink-0">
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

            {/* DESKTOP RIGHT */}
            <div className="hidden xl:flex items-center gap-3 justify-end shrink-0">
              {user && <NotificationBell />}

              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="rounded-xl bg-cyan-600 px-4 py-2 font-semibold hover:bg-cyan-500 transition whitespace-nowrap"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/wallet"
                    className="rounded-xl bg-purple-600 px-4 py-2 font-semibold hover:bg-purple-500 transition whitespace-nowrap"
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
                    className="rounded-xl bg-red-600 px-4 py-2 font-semibold hover:bg-red-500 transition whitespace-nowrap"
                  >
                    Admin
                  </Link>

                  <div className="rounded-xl bg-[#020617] border border-slate-800 px-4 py-2 min-w-[190px]">
                    <p className="text-xs text-slate-500">Logged in as</p>

                    <p className="text-sm font-semibold truncate">
                      {user.email}
                    </p>
                  </div>

                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="rounded-xl bg-red-600 px-4 py-2 font-semibold hover:bg-red-500 transition whitespace-nowrap"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded-xl bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-500 transition whitespace-nowrap"
                >
                  Login / Register
                </Link>
              )}
            </div>

            {/* MOBILE RIGHT */}
            <div className="flex xl:hidden items-center gap-3 shrink-0">
              {user && <NotificationBell />}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-xl border border-slate-700 px-3 py-2 text-xl font-bold text-white shrink-0"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? '×' : '☰'}
              </button>
            </div>
          </div>

          {/* MOBILE MENU */}
          {mobileMenuOpen && (
            <div className="xl:hidden mt-5 rounded-3xl border border-slate-800 bg-slate-950 p-4 shadow-2xl">
              <nav className="grid gap-2 text-sm">
                <Link
                  href="/how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-900 hover:text-white font-semibold"
                >
                  How It Works
                </Link>

                <Link
                  href="/why"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-900 hover:text-white font-semibold"
                >
                  Why
                </Link>

                <Link
                  href="/for-sellers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-900 hover:text-white font-semibold"
                >
                  Sellers
                </Link>

                <Link
                  href="/for-buyers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-900 hover:text-white font-semibold"
                >
                  Buyers
                </Link>

                <Link
                  href="/trust"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-900 hover:text-white font-semibold"
                >
                  Trust
                </Link>

                <Link
                  href="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-900 hover:text-white font-semibold"
                >
                  FAQ
                </Link>
              </nav>

              <div className="mt-4 border-t border-slate-800 pt-4">
                {user ? (
                  <div className="grid gap-3">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl bg-cyan-600 px-4 py-3 text-center font-semibold"
                    >
                      Dashboard
                    </Link>

                    <Link
                      href="/wallet"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl bg-purple-600 px-4 py-3 text-center font-semibold"
                    >
                      Wallet
                    </Link>

                    <Link
                      href="/sell"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl bg-emerald-600 px-4 py-3 text-center font-semibold"
                    >
                      Sell Crypto
                    </Link>

                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl bg-red-600 px-4 py-3 text-center font-semibold"
                    >
                      Admin
                    </Link>

                    <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
                      <p className="text-xs text-slate-500">Logged in as</p>

                      <p className="text-sm font-semibold truncate">
                        {user.email}
                      </p>
                    </div>

                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="rounded-xl bg-red-600 px-4 py-3 font-semibold"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold"
                  >
                    Login / Register
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* LOGOUT MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-3">Confirm Logout</h2>

            <p className="text-slate-400 mb-6">
              Are you sure you want to log out of your CryptoBidX account?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
