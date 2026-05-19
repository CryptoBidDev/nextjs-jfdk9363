'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { notifyPaymentConfirmed } from '@/app/lib/notifications';

type User = {
  email: string;
};

export default function PaymentPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [bidAmount, setBidAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [auctionTitle, setAuctionTitle] = useState('Auction');

  useEffect(() => {
    const savedUser = localStorage.getItem('cryptobidx-user');
    const userBidsRaw = localStorage.getItem('cryptobidx-user-bids');
    const sellerAuctionsRaw = localStorage.getItem('sellerAuctions');

    if (savedUser) setUser(JSON.parse(savedUser));

    if (userBidsRaw) {
      const bids = JSON.parse(userBidsRaw);

      const winningBid = bids.find(
        (b: any) => b.auctionId === params.id && b.status === 'winning'
      );

      if (winningBid) {
        setBidAmount(winningBid.bidAmountUsd);
        setAuctionTitle(winningBid.auctionTitle || 'Auction');
      }
    }

    if (sellerAuctionsRaw) {
      const sellerAuctions = JSON.parse(sellerAuctionsRaw);
      const matchedAuction = sellerAuctions.find(
        (auction: any) => auction.id === params.id
      );

      if (matchedAuction?.title) {
        setAuctionTitle(matchedAuction.title);
      }
    }

    setLoading(false);
  }, [params.id]);

  function confirmPayment() {
    const sellerAuctionsRaw = localStorage.getItem('sellerAuctions');
    const sellerAuctions = sellerAuctionsRaw
      ? JSON.parse(sellerAuctionsRaw)
      : [];

    const updated = sellerAuctions.map((auction: any) => {
      if (auction.id === params.id) {
        return {
          ...auction,
          paymentStatus: 'paid',
          settlementStatus: 'ready_for_release',
        };
      }

      return auction;
    });

    localStorage.setItem('sellerAuctions', JSON.stringify(updated));

    notifyPaymentConfirmed({
      auctionId: params.id,
      assetName: auctionTitle,
    });

    alert('Payment confirmed (demo)');

    router.push('/dashboard');
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-10 xl:px-16 py-10">
      <section className="w-full max-w-[1200px] mx-auto">
        <Link href="/" className="text-blue-400 hover:underline mb-6 block">
          ← Back
        </Link>

        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8">
          <h1 className="text-3xl font-bold mb-4">Complete Payment</h1>

          <p className="text-slate-400 mb-6">
            You are the winning bidder. Complete payment to receive the crypto
            asset.
          </p>

          {user && (
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-5 mb-6">
              <p className="text-sm text-slate-500">Paying as</p>
              <p className="font-semibold">{user.email}</p>
            </div>
          )}

          <div className="rounded-xl bg-slate-950 border border-slate-800 p-5 mb-6">
            <p className="text-sm text-slate-500">Amount Due</p>
            <p className="text-2xl font-bold text-yellow-400">
              ${bidAmount.toLocaleString()}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <button className="w-full rounded-xl bg-blue-600 py-3 font-bold hover:bg-blue-500 transition">
              Pay with Card
            </button>

            <button className="w-full rounded-xl bg-slate-800 border border-slate-700 py-3 font-semibold hover:border-purple-400 transition">
              Pay with Crypto
            </button>

            <button className="w-full rounded-xl bg-slate-800 border border-slate-700 py-3 font-semibold hover:border-emerald-400 transition">
              Pay by Bank
            </button>
          </div>

          <button
            onClick={confirmPayment}
            className="rounded-xl bg-yellow-500 text-slate-950 px-8 py-4 font-bold hover:bg-yellow-400 transition"
          >
            Confirm Payment (Demo)
          </button>
        </div>
      </section>
    </main>
  );
}
