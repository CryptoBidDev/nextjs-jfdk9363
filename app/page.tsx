'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/app/lib/supabase';

type User = {
  id?: string;
  email: string;
  accountStatus: string;
};

type Auction = {
  id: string;
  title: string;
  symbol: string;
  currentBid: number;
  image: string;
  endsIn: string;
  description?: string;
  startingPrice?: number;
  durationHours?: number;
  createdAt?: string;
  endsAt?: string;
  sellerCreated?: boolean;
  bidHistory?: any[];
  asset?: string;
  assetAmount?: string;
  escrowStatus?: string;
  paymentStatus?: string;
  settlementStatus?: string;
  bidCount?: number;
};

function formatUsd(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function getCryptoIcon(symbol: string) {
  const clean = symbol.toUpperCase();

  if (clean.includes('BTC') || clean.includes('BITCOIN')) return '₿';
  if (clean.includes('ETH') || clean.includes('ETHEREUM')) return 'Ξ';
  if (clean.includes('SOL') || clean.includes('SOLANA')) return '◎';
  if (clean.includes('USDT') || clean.includes('TETHER')) return '₮';
  if (clean.includes('XRP')) return '✕';
  if (clean.includes('BNB')) return '◇';
  if (clean.includes('MATIC')) return '⬡';
  if (clean.includes('DOGE')) return 'Ð';

  return '◈';
}

function getTimeLeft(endsAt?: string, fallback?: string) {
  if (!endsAt) return fallback || 'Live';

  const now = Date.now();
  const end = new Date(endsAt).getTime();
  const diff = end - now;

  if (diff <= 0) return 'Ended';

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;

  return `${minutes}m`;
}

function getAuctionStatus(auction: Auction) {
  const timeLeft = getTimeLeft(auction.endsAt, auction.endsIn);

  if (timeLeft === 'Ended') {
    return {
      label: 'Ended',
      className: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
    };
  }

  if (
    timeLeft.includes('m') &&
    !timeLeft.includes('h') &&
    !timeLeft.includes('d')
  ) {
    return {
      label: 'Ending Soon',
      className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    };
  }

  return {
    label: 'Live',
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };
}

function mapSupabaseAuction(row: any): Auction {
  const symbol = row.symbol || row.asset_name || 'CRYPTO';
  const currentBid = Number(row.current_bid_usd || row.starting_price_usd || 0);

  return {
    id: row.id,
    title: row.title || `${symbol} Auction`,
    symbol,
    currentBid,
    image: row.image || getCryptoIcon(symbol),
    endsIn: getTimeLeft(row.ends_at),
    description: row.description,
    startingPrice: Number(row.starting_price_usd || 0),
    createdAt: row.created_at,
    endsAt: row.ends_at,
    sellerCreated: true,
    asset: row.asset_name || symbol,
    assetAmount: row.asset_amount ? String(row.asset_amount) : undefined,
    escrowStatus: row.metadata?.escrow_status || 'secured',
    paymentStatus: row.metadata?.payment_status || 'awaiting_winner',
    settlementStatus: row.settlement_status || 'auction_live',
    bidCount: Number(row.bid_count || 0),
  };
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [liveBids, setLiveBids] = useState<Record<string, number>>({});
  const [bidCounts, setBidCounts] = useState<Record<string, number>>({});
  const [allAuctions, setAllAuctions] = useState<Auction[]>([]);

  async function loadMarketplaceData() {
    setMounted(true);

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser?.email) {
      const authUserObject = {
        id: authUser.id,
        email: authUser.email,
        accountStatus: 'active',
      };

      setUser(authUserObject);
      localStorage.setItem('cryptobidx-user', JSON.stringify(authUserObject));
    } else {
      const savedUser = localStorage.getItem('cryptobidx-user');

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }

    const { data, error } = await supabase
      .from('auctions')
      .select(
        `
        id,
        seller_id,
        title,
        description,
        symbol,
        asset_name,
        asset_amount,
        starting_price_usd,
        current_bid_usd,
        image,
        status,
        settlement_status,
        starts_at,
        ends_at,
        created_at,
        bid_count,
        metadata
      `
      )
      .not('status', 'in', '("cancelled","cancel_requested")')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Homepage auction load error:', error);
      setAllAuctions([]);
      setLiveBids({});
      setBidCounts({});
      return;
    }

    const mappedAuctions = (data || []).map(mapSupabaseAuction);

    const bids: Record<string, number> = {};
    const counts: Record<string, number> = {};

    mappedAuctions.forEach((auction) => {
      bids[auction.id] = auction.currentBid;
      counts[auction.id] = auction.bidCount || 0;
    });

    setAllAuctions(mappedAuctions);
    setLiveBids(bids);
    setBidCounts(counts);
  }

  useEffect(() => {
    loadMarketplaceData();

    const auctionsChannel = supabase
      .channel('homepage-auctions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'auctions',
        },
        () => {
          loadMarketplaceData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bids',
        },
        () => {
          loadMarketplaceData();
        }
      )
      .subscribe();

    window.addEventListener('storage', loadMarketplaceData);
    window.addEventListener('cryptobidx_data_updated', loadMarketplaceData);
    window.addEventListener(
      'cryptobidx_notifications_updated',
      loadMarketplaceData
    );

    return () => {
      supabase.removeChannel(auctionsChannel);
      window.removeEventListener('storage', loadMarketplaceData);
      window.removeEventListener(
        'cryptobidx_data_updated',
        loadMarketplaceData
      );
      window.removeEventListener(
        'cryptobidx_notifications_updated',
        loadMarketplaceData
      );
    };
  }, []);

  const totalLiveValue = allAuctions.reduce((total, auction) => {
    const displayedBid = liveBids[auction.id] || auction.currentBid;
    return total + displayedBid;
  }, 0);

  const sellerListingCount = allAuctions.filter(
    (auction) => auction.sellerCreated
  ).length;

  const latestAuctions = useMemo(() => {
    return allAuctions.slice(0, 8);
  }, [allAuctions]);

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="w-full mx-auto bg-[#020617]">
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 items-center mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm text-emerald-300 mb-5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Non-custodial marketplace design
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Convert crypto to fiat through secure, escrow-backed auctions.
            </h1>

            <p className="text-slate-400 text-base sm:text-lg mb-8 max-w-2xl">
              CryptoBidX gives sellers transparent price discovery and gives
              buyers confidence through regulated payment confirmation,
              escrow-based settlement and a platform design that does not rely
              on blind trust.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap">
              <Link
                href="/auctions"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 transition text-center"
              >
                View All Auctions
              </Link>

              <Link
                href="/sell"
                className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold hover:bg-emerald-500 transition text-center"
              >
                Create Secure Listing
              </Link>

              {user && (
                <Link
                  href="/manage-auctions"
                  className="rounded-xl bg-slate-800 border border-emerald-500/20 px-6 py-3 font-semibold hover:border-emerald-400 transition text-center"
                >
                  Auction Management
                </Link>
              )}

              {!user && (
                <Link
                  href="/login"
                  className="rounded-xl bg-slate-800 border border-slate-700 px-6 py-3 font-semibold hover:border-blue-500 transition text-center"
                >
                  Create Account
                </Link>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-8 shadow-2xl shadow-blue-500/5">
            <div className="mb-6">
              <p className="text-sm text-slate-500">Marketplace Trust Layer</p>
              <h2 className="text-xl sm:text-2xl font-bold mt-1">
                Built for price discovery, verified payment and controlled
                settlement.
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-2xl bg-[#020617] border border-slate-800 p-4 sm:p-5">
                <p className="text-slate-500 text-xs sm:text-sm">
                  Live Auctions
                </p>
                <p className="text-2xl sm:text-3xl font-bold mt-2">
                  {mounted ? allAuctions.length : 0}
                </p>
              </div>

              <div className="rounded-2xl bg-[#020617] border border-slate-800 p-4 sm:p-5">
                <p className="text-slate-500 text-xs sm:text-sm">
                  Seller Listings
                </p>
                <p className="text-2xl sm:text-3xl font-bold mt-2">
                  {mounted ? sellerListingCount : 0}
                </p>
              </div>

              <div className="rounded-2xl bg-[#020617] border border-slate-800 p-4 sm:p-5">
                <p className="text-slate-500 text-xs sm:text-sm">
                  Auction Bid Value
                </p>
                <p className="text-xl sm:text-2xl font-bold mt-2">
                  {formatUsd(mounted ? totalLiveValue : 0)}
                </p>
              </div>

              <div className="rounded-2xl bg-[#020617] border border-slate-800 p-4 sm:p-5">
                <p className="text-slate-500 text-xs sm:text-sm">
                  Trust Model
                </p>
                <p className="text-xl sm:text-2xl font-bold mt-2">Escrow</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 sm:p-5">
              <p className="font-semibold text-emerald-400">
                Designed to reduce counterparty risk
              </p>
              <p className="text-sm text-slate-300 mt-2">
                Seller assets are represented as secured before completion, and
                buyer payment is tracked before release. The goal is simple: no
                blind trust between buyer, seller or platform.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-16">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
            <p className="text-emerald-400 font-bold mb-2">
              Escrow-first protection
            </p>
            <p className="text-sm text-slate-400">
              Assets are only released after the transaction reaches the correct
              settlement state.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
            <p className="text-blue-400 font-bold mb-2">
              Regulated payment confirmation
            </p>
            <p className="text-sm text-slate-400">
              Fiat payment is treated as verified before release action is
              allowed.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
            <p className="text-purple-400 font-bold mb-2">
              Marketplace, not exchange
            </p>
            <p className="text-sm text-slate-400">
              CryptoBidX coordinates auctions and settlement flow rather than
              acting as a pooled liquidity venue.
            </p>
          </div>
        </div>

        <div id="auctions" className="mb-16">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">
                Latest Auctions
              </h2>
              <p className="text-slate-400 mt-2 max-w-3xl">
                A snapshot of the newest live listings on CryptoBidX. Visit the
                full auction marketplace to browse every available listing.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/auctions"
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500 transition text-center"
              >
                View All Auctions
              </Link>

              <Link
                href="/sell"
                className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold hover:bg-emerald-500 transition text-center"
              >
                Create Listing
              </Link>

              {user && (
                <Link
                  href="/manage-auctions"
                  className="rounded-xl bg-slate-800 border border-emerald-500/20 px-5 py-3 font-semibold hover:border-emerald-400 transition text-center"
                >
                  Auction Management
                </Link>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {latestAuctions.length === 0 ? (
              <div className="sm:col-span-2 xl:col-span-4 rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center">
                <p className="text-slate-300 font-semibold">
                  No auctions found.
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Create a listing to publish the first live auction.
                </p>
              </div>
            ) : (
              latestAuctions.map((auction) => {
                const displayedBid = liveBids[auction.id] || auction.currentBid;
                const auctionStatus = getAuctionStatus(auction);
                const bidCount = mounted ? bidCounts[auction.id] || 0 : 0;

                return (
                  <Link key={auction.id} href={`/auction/${auction.id}`}>
                    <div className="group h-full cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 p-4 hover:border-blue-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 transition">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-12 w-12 shrink-0 rounded-xl bg-[#020617] border border-slate-800 flex items-center justify-center text-3xl group-hover:scale-105 transition">
                            {auction.image}
                          </div>

                          <div className="min-w-0">
                            <h2 className="text-base font-semibold truncate">
                              {auction.title}
                            </h2>
                            <p className="text-xs text-slate-400 mt-1">
                              {auction.symbol}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${auctionStatus.className}`}
                        >
                          {auctionStatus.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="rounded-xl bg-[#020617] border border-slate-800 p-3">
                          <p className="text-[11px] text-slate-500">Bid</p>
                          <p className="font-bold text-blue-400 mt-1 text-sm">
                            {formatUsd(displayedBid)}
                          </p>
                        </div>

                        <div className="rounded-xl bg-[#020617] border border-slate-800 p-3">
                          <p className="text-[11px] text-slate-500">Ends</p>
                          <p className="font-bold mt-1 text-sm">
                            {getTimeLeft(auction.endsAt, auction.endsIn)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="rounded-full bg-[#020617] border border-slate-800 px-2.5 py-1 text-slate-400">
                          {bidCount} bids
                        </span>

                        <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 font-semibold">
                          Seller
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-blue-600 p-6 sm:p-8 text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Sell with better price discovery. Buy with greater confidence.
          </h2>

          <p className="text-blue-100 mb-6 max-w-3xl mx-auto">
            CryptoBidX combines transparent auctions, escrow-backed settlement
            and regulated payment confirmation to reduce risk on both sides of
            the transaction.
          </p>

          {user ? (
            <Link
              href="/auctions"
              className="inline-block rounded-xl bg-white text-blue-700 px-6 py-3 font-semibold"
            >
              Browse All Auctions
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-block rounded-xl bg-white text-blue-700 px-6 py-3 font-semibold"
            >
              Create Account
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
