'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function saveUserSession() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    if (!user || !user.email) {
      throw new Error('Login succeeded, but no active user session was found.');
    }

    localStorage.setItem(
      'cryptobidx-user',
      JSON.stringify({
        id: user.id,
        email: user.email,
        accountStatus: 'active',
      })
    );

    window.dispatchEvent(new Event('cryptobidx_data_updated'));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setMessage('Please enter email and password.');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);

      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              display_name: cleanEmail.split('@')[0],
            },
          },
        });

        if (error) {
          throw error;
        }

        if (!data.session) {
          setMessage(
            'Account created. If email confirmation is enabled in Supabase, confirm the email first, then log in.'
          );
          setMode('login');
          return;
        }

        await saveUserSession();
        router.push('/');
        router.refresh();
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        throw error;
      }

      await saveUserSession();

      router.push('/');
      router.refresh();
    } catch (error: any) {
      console.error('Auth error:', error);
      setMessage(error?.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="min-h-[75vh]">
        <Link href="/" className="text-blue-400 hover:underline">
          ← Back to homepage
        </Link>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 items-stretch">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 xl:p-10">
            <div className="mb-8">
              <p className="text-sm text-blue-400 font-semibold mb-3">
                {mode === 'login' ? 'Account Access' : 'Create Your Account'}
              </p>

              <h1 className="text-4xl font-bold mb-3">
                {mode === 'login'
                  ? 'Login to CryptoBidX'
                  : 'Start using CryptoBidX'}
              </h1>

              <p className="text-slate-400">
                {mode === 'login'
                  ? 'Access your dashboard, track bids and manage settlement activity.'
                  : 'Create an active account to bid, list crypto and use the CryptoBidX auction flow.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {message && (
                <div className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-slate-300">
                  {message}
                </div>
              )}

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-[#020617] border border-slate-700 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl bg-[#020617] border border-slate-700 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? mode === 'login'
                    ? 'Logging in...'
                    : 'Creating account...'
                  : mode === 'login'
                  ? 'Login'
                  : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-sm text-slate-400">
              {mode === 'login' ? (
                <p>
                  No account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setMessage('');
                    }}
                    className="text-blue-400 hover:underline"
                  >
                    Register here
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setMessage('');
                    }}
                    className="text-blue-400 hover:underline"
                  >
                    Login here
                  </button>
                </p>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 xl:p-10 overflow-hidden relative">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm text-emerald-300 mb-6">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Escrow-backed crypto auctions
              </div>

              <h2 className="text-4xl font-bold mb-5 leading-tight">
                Buy crypto below market. Sell through real price discovery.
              </h2>

              <p className="text-slate-400 text-lg mb-8">
                CryptoBidX is built for users who want a safer, clearer way to
                buy and sell crypto without relying on blind counterparty trust.
              </p>

              <div className="grid gap-4 mb-8">
                <div className="rounded-2xl bg-[#020617] border border-slate-800 p-5">
                  <p className="font-semibold text-emerald-400">For sellers</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Set your reserve, list your asset and let buyers compete for
                    the final price.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#020617] border border-slate-800 p-5">
                  <p className="font-semibold text-blue-400">For buyers</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Compare bids against live market value and compete only
                    where the numbers make sense.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#020617] border border-slate-800 p-5">
                  <p className="font-semibold text-purple-400">For trust</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Bidding, payment and release are separated into a controlled
                    settlement flow.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-[#020617] border border-slate-800 p-4">
                  <p className="text-xs text-slate-500">Auction type</p>
                  <p className="font-bold mt-1">Timed</p>
                </div>

                <div className="rounded-2xl bg-[#020617] border border-slate-800 p-4">
                  <p className="text-xs text-slate-500">Trust model</p>
                  <p className="font-bold mt-1">Escrow</p>
                </div>

                <div className="rounded-2xl bg-[#020617] border border-slate-800 p-4">
                  <p className="text-xs text-slate-500">Pricing</p>
                  <p className="font-bold mt-1">Live spot</p>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-6">
                CryptoBidX is currently a frontend prototype. Production
                settlement would require verified accounts, escrow controls and
                backend transaction records.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}