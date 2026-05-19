'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';

type Auction = {
  id: string;
  title: string;
  symbol: string;
  current_bid_usd: number;
  starting_price_usd: number;
  status: string;
  bid_count: number;
  ends_at: string;
  created_at: string;
};

function formatUsd(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function formatDate(value?: string) {
  if (!value) return 'Not set';

  return new Date(value).toLocaleString();
}

function statusClass(status: string) {
  if (status === 'live') {
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  }

  if (status === 'cancel_requested') {
    return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
  }

  if (status === 'cancelled') {
    return 'bg-red-500/10 text-red-400 border-red-500/20';
  }

  if (status === 'completed') {
    return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  }

  return 'bg-slate-500/10 text-slate-300 border-slate-500/20';
}

const cancellationReasons = [
  'Listed wrong amount',
  'Listed wrong starting price',
  'Asset no longer available',
  'Wallet or escrow issue',
  'Duplicate listing',
  'Security concern',
  'Other',
];

export default function ManageAuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [busyAuctionId, setBusyAuctionId] = useState('');

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelNote, setCancelNote] = useState('');

  async function loadListings() {
    setLoading(true);
    setMessage('');

    const { data, error } = await supabase
      .from('auctions')
      .select(
        `
        id,
        title,
        symbol,
        current_bid_usd,
        starting_price_usd,
        status,
        bid_count,
        ends_at,
        created_at
      `
      )
      .order('created_at', { ascending: false });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setAuctions(data || []);
    setLoading(false);
  }

  function openCancelModal(auction: Auction) {
    setSelectedAuction(auction);
    setCancelReason('');
    setCancelNote('');
    setShowCancelModal(true);
  }

  function closeCancelModal() {
    setShowCancelModal(false);
    setSelectedAuction(null);
    setCancelReason('');
    setCancelNote('');
  }

  async function confirmCancellation() {
    if (!selectedAuction) return;

    if (!cancelReason) {
      setMessage('Please select a cancellation reason.');
      return;
    }

    setBusyAuctionId(selectedAuction.id);
    setMessage('');

    const { data, error } = await supabase.rpc('cancel_auction', {
      p_auction_id: selectedAuction.id,
      p_reason: cancelReason,
      p_note: cancelNote,
    });

    if (error) {
      setMessage(error.message);
      setBusyAuctionId('');
      return;
    }

    if (data?.status === 'cancel_requested') {
      setMessage(
        'Cancellation request submitted for admin review because bids already exist.'
      );
    } else {
      setMessage('Auction cancelled successfully.');
    }

    closeCancelModal();
    setBusyAuctionId('');
    await loadListings();
  }

  useEffect(() => {
    loadListings();
  }, []);

  return (
    <main className="min-h-screen bg-[#020617] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-emerald-400 font-semibold">
              Seller Dashboard
            </p>

            <h1 className="text-4xl font-bold">Auction Management</h1>

            <p className="text-slate-400 mt-2">
              Manage your live auctions, cancellation requests and settlement
              flow.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/sell"
              className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold hover:bg-emerald-500 transition text-center"
            >
              Create Listing
            </Link>

            <Link
              href="/"
              className="rounded-xl bg-slate-800 border border-slate-700 px-5 py-3 font-semibold hover:border-emerald-400 transition text-center"
            >
              Marketplace
            </Link>
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm text-slate-300">
            {message}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8">
            <p className="text-slate-400">Loading auctions...</p>
          </div>
        ) : auctions.length === 0 ? (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">No listings yet</h2>

            <p className="text-slate-400 mb-6">
              Create your first crypto auction and it will appear here.
            </p>

            <Link
              href="/sell"
              className="inline-block rounded-xl bg-emerald-600 px-6 py-3 font-semibold hover:bg-emerald-500 transition"
            >
              Create Listing
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {auctions.map((auction) => {
              const canCancel =
                auction.status === 'live' || auction.status === 'draft';

              return (
                <div
                  key={auction.id}
                  className="rounded-2xl bg-slate-900 border border-slate-800 p-5"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h2 className="text-2xl font-bold">{auction.title}</h2>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(
                            auction.status
                          )}`}
                        >
                          {auction.status}
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                        <div className="rounded-xl bg-[#020617] border border-slate-800 p-3">
                          <p className="text-slate-500">Asset</p>
                          <p className="font-semibold mt-1">
                            {auction.symbol}
                          </p>
                        </div>

                        <div className="rounded-xl bg-[#020617] border border-slate-800 p-3">
                          <p className="text-slate-500">Current Bid</p>
                          <p className="font-semibold text-blue-400 mt-1">
                            {formatUsd(auction.current_bid_usd)}
                          </p>
                        </div>

                        <div className="rounded-xl bg-[#020617] border border-slate-800 p-3">
                          <p className="text-slate-500">Bids</p>
                          <p className="font-semibold mt-1">
                            {auction.bid_count || 0}
                          </p>
                        </div>

                        <div className="rounded-xl bg-[#020617] border border-slate-800 p-3">
                          <p className="text-slate-500">Ends</p>
                          <p className="font-semibold mt-1">
                            {formatDate(auction.ends_at)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-52">
                      <Link
                        href={`/auction/${auction.id}`}
                        className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500 transition text-center"
                      >
                        View Auction
                      </Link>

                      <button
                        type="button"
                        disabled={!canCancel || busyAuctionId === auction.id}
                        onClick={() => openCancelModal(auction)}
                        className="rounded-xl bg-red-500/10 border border-red-500/20 px-5 py-3 font-semibold text-red-400 hover:bg-red-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {auction.bid_count > 0
                          ? 'Request Cancellation'
                          : 'Cancel Auction'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showCancelModal && selectedAuction && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-8">
            <h2 className="text-3xl font-bold mb-3">
              Cancel Auction
            </h2>

            <p className="text-slate-400 mb-6">
              You are cancelling:
            </p>

            <div className="rounded-2xl bg-[#020617] border border-slate-800 p-5 mb-6">
              <p className="text-xl font-semibold">
                {selectedAuction.title}
              </p>

              <p className="text-sm text-slate-400 mt-2">
                Current bid: {formatUsd(selectedAuction.current_bid_usd)}
              </p>

              <p className="text-sm text-slate-400">
                Existing bids: {selectedAuction.bid_count}
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Cancellation Reason
                </label>

                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full rounded-xl bg-[#020617] border border-slate-700 px-4 py-3 outline-none focus:border-red-400"
                >
                  <option value="">Select reason</option>

                  {cancellationReasons.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Additional Notes (Optional)
                </label>

                <textarea
                  rows={4}
                  value={cancelNote}
                  onChange={(e) => setCancelNote(e.target.value)}
                  placeholder="Provide additional context for support, buyers or compliance review..."
                  className="w-full rounded-xl bg-[#020617] border border-slate-700 px-4 py-3 outline-none focus:border-red-400"
                />
              </div>

              {selectedAuction.bid_count > 0 && (
                <div className="rounded-2xl bg-yellow-500/10 border border-yellow-500/20 p-4">
                  <p className="text-yellow-400 font-semibold">
                    This auction already has bids
                  </p>

                  <p className="text-sm text-slate-300 mt-2">
                    Cancellation will be submitted for review instead of being
                    automatically approved.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={closeCancelModal}
                className="rounded-xl bg-slate-800 border border-slate-700 px-6 py-3 font-semibold hover:border-slate-500 transition"
              >
                Keep Auction Live
              </button>

              <button
                type="button"
                onClick={confirmCancellation}
                disabled={!cancelReason}
                className="rounded-xl bg-red-600 px-6 py-3 font-semibold hover:bg-red-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}