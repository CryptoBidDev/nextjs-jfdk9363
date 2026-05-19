'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Auction = {
  id: string;
  title: string;
  asset: string;
  symbol?: string;
  assetAmount?: string;
  currentBid: number;
  startingPrice?: number;
  sellerCreated?: boolean;
  escrowStatus?: string;
  paymentStatus?: string;
  settlementStatus?: string;
  createdAt?: string;
  endsAt?: string;
};

function formatUsd(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function getStatusClass(status?: string) {
  if (status === 'completed' || status === 'paid' || status === 'secured') {
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  }

  if (
    status === 'ready_for_release' ||
    status === 'awaiting_release' ||
    status === 'awaiting_payment'
  ) {
    return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
  }

  return 'bg-slate-500/10 text-slate-300 border-slate-500/20';
}

export default function AdminPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const savedListings = localStorage.getItem('sellerAuctions');
    if (savedListings) {
      setAuctions(JSON.parse(savedListings));
    }
  }, []);

  const pendingEscrow = auctions.filter(
    (auction) => auction.escrowStatus !== 'secured'
  );

  const liveAuctions = auctions.filter(
    (auction) => auction.settlementStatus === 'auction_live'
  );

  const pendingPayments = auctions.filter(
    (auction) =>
      auction.paymentStatus === 'awaiting_payment' ||
      auction.paymentStatus === 'awaiting_winner'
  );

  const readyForRelease = auctions.filter(
    (auction) =>
      auction.paymentStatus === 'paid' &&
      auction.settlementStatus !== 'completed'
  );

  const completedSettlements = auctions.filter(
    (auction) => auction.settlementStatus === 'completed'
  );

  function markPaymentPaid(id: string) {
    const updated = auctions.map((auction) => {
      if (auction.id === id) {
        return {
          ...auction,
          paymentStatus: 'paid',
          settlementStatus: 'ready_for_release',
        };
      }

      return auction;
    });

    setAuctions(updated);
    localStorage.setItem('sellerAuctions', JSON.stringify(updated));
  }

  function forceRelease(id: string) {
    const updated = auctions.map((auction) => {
      if (auction.id === id) {
        return {
          ...auction,
          settlementStatus: 'completed',
        };
      }

      return auction;
    });

    setAuctions(updated);
    localStorage.setItem('sellerAuctions', JSON.stringify(updated));
  }

  function resetAuction(id: string) {
    const updated = auctions.map((auction) => {
      if (auction.id === id) {
        return {
          ...auction,
          paymentStatus: 'awaiting_winner',
          settlementStatus: 'auction_live',
        };
      }

      return auction;
    });

    setAuctions(updated);
    localStorage.setItem('sellerAuctions', JSON.stringify(updated));
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'escrow', label: 'Pending Escrow' },
    { id: 'live', label: 'Live Auctions' },
    { id: 'payments', label: 'Payments' },
    { id: 'release', label: 'Ready for Release' },
    { id: 'users', label: 'User Verification' },
    { id: 'disputes', label: 'Disputes' },
  ];

  const visibleAuctions =
    activeTab === 'escrow'
      ? pendingEscrow
      : activeTab === 'live'
      ? liveAuctions
      : activeTab === 'payments'
      ? pendingPayments
      : activeTab === 'release'
      ? readyForRelease
      : activeTab === 'overview'
      ? auctions
      : [];

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <section className="max-w-full">
        <div className="flex justify-between items-center mb-10">
          <div>
            <p className="text-sm text-red-400 font-semibold">
              CryptoBidX Internal
            </p>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-slate-400 mt-2">
              Monitor escrow, auctions, payments, release approvals and platform
              risk.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl bg-cyan-600 px-5 py-3 font-semibold hover:bg-cyan-500 transition"
            >
              User Dashboard
            </Link>

            <Link
              href="/"
              className="rounded-xl bg-slate-800 border border-slate-700 px-5 py-3 font-semibold hover:border-red-400 transition"
            >
              Home
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-5 mb-10">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <p className="text-sm text-slate-500">Total Listings</p>
            <p className="text-3xl font-bold mt-2">{auctions.length}</p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <p className="text-sm text-slate-500">Live Auctions</p>
            <p className="text-3xl font-bold mt-2 text-blue-400">
              {liveAuctions.length}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <p className="text-sm text-slate-500">Pending Payments</p>
            <p className="text-3xl font-bold mt-2 text-yellow-400">
              {pendingPayments.length}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <p className="text-sm text-slate-500">Ready Release</p>
            <p className="text-3xl font-bold mt-2 text-red-400">
              {readyForRelease.length}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <p className="text-sm text-slate-500">Completed</p>
            <p className="text-3xl font-bold mt-2 text-emerald-400">
              {completedSettlements.length}
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sticky top-6">
              <h2 className="text-xl font-bold mb-4">Admin Controls</h2>

              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left rounded-xl px-4 py-3 font-semibold transition ${
                      activeTab === tab.id
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-red-400'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                <p className="text-sm font-semibold text-red-400">
                  Demo Admin Mode
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  This currently reads from localStorage. In production this
                  would be protected by admin-only authentication and backend
                  permissions.
                </p>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3">
            {activeTab === 'users' && (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8">
                <h2 className="text-2xl font-bold mb-2">User Verification</h2>
                <p className="text-slate-400 mb-6">
                  Future admin review area for KYC, KYB, payout approval and
                  risk checks.
                </p>

                <div className="grid gap-5 md:grid-cols-3">
                  <div className="rounded-xl bg-slate-950 border border-slate-800 p-5">
                    <p className="text-slate-500 text-sm">Pending KYC</p>
                    <p className="text-3xl font-bold mt-2 text-yellow-400">0</p>
                  </div>

                  <div className="rounded-xl bg-slate-950 border border-slate-800 p-5">
                    <p className="text-slate-500 text-sm">Approved Users</p>
                    <p className="text-3xl font-bold mt-2 text-emerald-400">
                      Demo
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-950 border border-slate-800 p-5">
                    <p className="text-slate-500 text-sm">Flagged Accounts</p>
                    <p className="text-3xl font-bold mt-2 text-red-400">0</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'disputes' && (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8">
                <h2 className="text-2xl font-bold mb-2">Disputes</h2>
                <p className="text-slate-400 mb-6">
                  Future dispute management area for failed payments, delayed
                  releases, incorrect wallet addresses and settlement reviews.
                </p>

                <div className="rounded-xl bg-slate-950 border border-slate-800 p-5">
                  <p className="text-slate-500 text-sm">Open Disputes</p>
                  <p className="text-3xl font-bold mt-2">0</p>
                </div>
              </div>
            )}

            {activeTab !== 'users' && activeTab !== 'disputes' && (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {tabs.find((tab) => tab.id === activeTab)?.label}
                    </h2>
                    <p className="text-slate-400 mt-2">
                      Review and manage platform auction settlement states.
                    </p>
                  </div>

                  <p className="text-sm text-slate-500">
                    Showing {visibleAuctions.length} records
                  </p>
                </div>

                {visibleAuctions.length === 0 ? (
                  <div className="rounded-xl bg-slate-950 border border-slate-800 p-6">
                    <p className="text-slate-500">
                      No records found for this section.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {visibleAuctions.map((auction) => (
                      <div
                        key={auction.id}
                        className="rounded-xl bg-slate-950 border border-slate-800 p-5"
                      >
                        <div className="flex justify-between gap-6">
                          <div>
                            <p className="font-semibold text-lg">
                              {auction.title}
                            </p>
                            <p className="text-sm text-slate-400 mt-1">
                              {auction.assetAmount || '0'}{' '}
                              {auction.symbol || auction.asset}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-slate-500">
                              Current Bid
                            </p>
                            <p className="font-bold text-blue-400">
                              {formatUsd(auction.currentBid)}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-5 text-xs">
                          <span
                            className={`rounded-full border px-3 py-1 ${getStatusClass(
                              auction.escrowStatus
                            )}`}
                          >
                            Escrow: {auction.escrowStatus || 'pending'}
                          </span>

                          <span
                            className={`rounded-full border px-3 py-1 ${getStatusClass(
                              auction.paymentStatus
                            )}`}
                          >
                            Payment:{' '}
                            {auction.paymentStatus || 'awaiting_winner'}
                          </span>

                          <span
                            className={`rounded-full border px-3 py-1 ${getStatusClass(
                              auction.settlementStatus
                            )}`}
                          >
                            Settlement:{' '}
                            {auction.settlementStatus || 'auction_live'}
                          </span>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3">
                          <Link
                            href={`/auction/${auction.id}`}
                            className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-sm font-semibold hover:border-blue-400 transition"
                          >
                            View Auction
                          </Link>

                          {auction.paymentStatus !== 'paid' && (
                            <button
                              onClick={() => markPaymentPaid(auction.id)}
                              className="rounded-xl bg-yellow-500 text-slate-950 px-4 py-2 text-sm font-bold hover:bg-yellow-400 transition"
                            >
                              Mark Payment Paid
                            </button>
                          )}

                          {auction.paymentStatus === 'paid' &&
                            auction.settlementStatus !== 'completed' && (
                              <button
                                onClick={() => forceRelease(auction.id)}
                                className="rounded-xl bg-emerald-500 text-slate-950 px-4 py-2 text-sm font-bold hover:bg-emerald-400 transition"
                              >
                                Force Release
                              </button>
                            )}

                          <button
                            onClick={() => resetAuction(auction.id)}
                            className="rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 text-sm font-bold hover:bg-red-500/20 transition"
                          >
                            Reset Demo State
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
