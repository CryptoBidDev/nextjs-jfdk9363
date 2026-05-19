'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('cryptobidx-user');

    if (savedUser) {
      setAllowed(true);
      setChecking(false);
      return;
    }

    setAllowed(false);
    setChecking(false);

    const timer = setTimeout(() => {
      router.push('/login');
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  if (checking) {
    return (
      <main className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        <p className="text-slate-400">Checking account access...</p>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        <div className="max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-8 text-center">
          <h1 className="text-3xl font-bold mb-3">Login required</h1>

          <p className="text-slate-400 mb-6">
            You need to be logged in to access this area of CryptoBidX.
          </p>

          <Link
            href="/login"
            className="inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 transition"
          >
            Login / Register
          </Link>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
