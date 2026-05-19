'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import AuthGuard from '@/app/components/AuthGuard';

type Wallet = {
  BTC: number;
  ETH: number;
  SOL: number;
  USDT: number;
};

type Auction = {
  id: string;
  title: string;
  asset: string;
  assetAmount?: string;
  escrowStatus?: string;
  settlementStatus?: string;
  paymentStatus?: string;
};

function WalletContent() {
  const [wallet] = useState<Wallet>({
    BTC: 0.5,
    ETH: 5,
    SOL: 120,
    USDT: 2500,
  });

  const [escrow, setEscrow] = useState<Auction[]>([]);
  const [pending, setPending] = useState<Auction[]>([]);

  useEffect(() => {
    const sellerAuctions = JSON.parse(
      localStorage.getItem('sellerAuctions') || '[]'
    );

    const escrowItems = sellerAuctions.filter(
      (a: Auction) => a.escrowStatus === 'secured'
    );

    const pendingItems = sellerAuctions.filter(
      (a: Auction) => a.settlementStatus !== 'completed'
    );

    setEscrow(escrowItems);
    setPending(pendingItems);
  }, []);

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="max-w-full">
        <div className="flex justify-between items-center mb-10">
          <div>
            <p className="text-sm text-cyan-400 font-semibold">
              CryptoBidX Wallet
            </p>
            <h1 className="text-4xl font-bold">Your Wallet</h1>
            <p className="text-slate-400 mt-2">
              Manage balances, escrow, and settlement status.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl bg-slate-800 border border-slate-700 px-5 py-3 font-semibold hover:border-cyan-400 transition"
          >
            Back Home
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {Object.entries(wallet).map(([asset, balance]) => (
            <div
              key={asset}
              className="rounded-2xl bg-slate-900 border border-slate-800 p-6"
            >
              <p className="text-slate-400 text-sm">{asset}</p>
              <p className="text-2xl font-bold mt-2">{balance}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mb-12">
          <button className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold">
            Deposit Crypto
          </button>

          <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold">
            Withdraw Crypto
          </button>

          <button className="rounded-xl bg-slate-800 border border-slate-700 px-6 py-3 font-semibold">
            View Transactions
          </button>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Escrow Holdings</h2>

          {escrow.length === 0 ? (
            <p className="text-slate-500">No assets in escrow</p>
          ) : (
            <div className="space-y-4">
              {escrow.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl bg-slate-900 border border-slate-800 p-5"
                >
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-slate-400">
                    {item.assetAmount} {item.asset}
                  </p>
                  <p className="text-sm text-emerald-400 mt-2">
                    Escrow: Secured
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Pending Settlements</h2>

          {pending.length === 0 ? (
            <p className="text-slate-500">No pending activity</p>
          ) : (
            <div className="space-y-4">
              {pending.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl bg-slate-900 border border-slate-800 p-5"
                >
                  <p className="font-semibold">{item.title}</p>

                  <div className="flex gap-6 mt-2 text-sm">
                    <p className="text-yellow-400">
                      Payment: {item.paymentStatus || 'pending'}
                    </p>

                    <p className="text-blue-400">
                      Settlement: {item.settlementStatus || 'in progress'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function WalletPage() {
  return (
    <AuthGuard>
      <WalletContent />
    </AuthGuard>
  );
}
