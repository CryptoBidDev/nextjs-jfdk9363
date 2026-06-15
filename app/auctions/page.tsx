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

type FilterStatus = 'all' | 'live' | 'endingSoon' | 'ended' | 'sellerListings';
type SortOption = 'featured' | 'highestBid' | 'endingSoon' | 'newest';

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

function getRemainingMilliseconds(auction: Auction) {
  if (!auction.endsAt) return Number.MAX_SAFE_INTEGER;

  return new Date(auction.endsAt).getTime() - Date.now();
}

function getAuctionStatus(auction: Auction) {
  const timeLeft = getTimeLeft(auction.endsAt, auction.endsIn);

  if (timeLeft === 'Ended') {
    return {
      label: 'Ended',
      value: 'ended',
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
      value: 'endingSoon',
      className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    };
  }

  return {
    label: 'Live',
    value: 'live',
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

export default function AuctionsPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [liveBids, setLiveBids] = useState<Record<string, number>>({});
  const [bidCounts, setBidCounts] = useState<Record<string, number>>({});
  const [allAuctions, setAllAuctions] = useState<Auction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortOption, setSortOption] = useState<SortOption>('featured');

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
      console.error(error);
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
      .channel('auctions-page')
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

    return () => {
      supabase.removeChannel(auctionsChannel);
    };
  }, []);

  const auctionSymbols = useMemo(() => {
    return Array.from(
      new Set(
        allAuctions
          .map((auction) => auction.symbol)
          .filter(Boolean)
          .map((symbol) => symbol.toUpperCase())
      )
    );
  }, [allAuctions]);

  const filteredAuctions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = allAuctions.filter((auction) => {
      const status = getAuctionStatus(auction);

      const matchesSearch =
        !query ||
        auction.title.toLowerCase().includes(query) ||
        auction.symbol.toLowerCase().includes(query) ||
        auction.asset?.toLowerCase().includes(query);

      const matchesStatus =
        filterStatus === 'all' ||
        status.value === filterStatus ||
        (filterStatus === 'sellerListings' && auction.sellerCreated);

      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      const bidA = liveBids[a.id] || a.currentBid;
      const bidB = liveBids[b.id] || b.currentBid;

      if (sortOption === 'highestBid') return bidB - bidA;

      if (sortOption === 'endingSoon') {
        return getRemainingMilliseconds(a) - getRemainingMilliseconds(b);
      }

      if (sortOption === 'newest') {
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      }

      return 0;
    });
  }, [allAuctions, filterStatus, liveBids, searchQuery, sortOption]);

  return (
    <main className="min-h-screen bg-[#020617] text-white overflow-x-hidden">
      <section className="w-full mx-auto bg-[#020617] overflow-x-hidden">
        <div id="auctions" className="mb-16">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-5 sm:gap-6 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                All Live Auctions
              </h1>

              <p className="text-slate-400 mt-2 max-w-2xl text-sm sm:text-base">
                Browse active crypto auctions with transparent bidding, live
                settlement tracking and escrow-backed transaction flow.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
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

          <div className="mb-6 rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-500 mb-2">
                  Search auctions
                </label>

                <select
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-[#020617] border border-slate-800 px-4 py-3 text-sm sm:text-base outline-none focus:border-blue-500 transition"
                >
                  <option value="">All assets</option>

                  {auctionSymbols.map((symbol) => (
                    <option key={symbol} value={symbol}>
                      {symbol}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-2">
                  Filter
                </label>

                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value as FilterStatus)
                  }
                  className="w-full rounded-xl bg-[#020617] border border-slate-800 px-4 py-3 text-sm sm:text-base outline-none focus:border-blue-500 transition"
                >
                  <option value="all">All auctions</option>
                  <option value="live">Live</option>
                  <option value="endingSoon">Ending soon</option>
                  <option value="ended">Ended</option>
                  <option value="sellerListings">Seller listings</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-2">
                  Sort by
                </label>

                <select
                  value={sortOption}
                  onChange={(e) =>
                    setSortOption(e.target.value as SortOption)
                  }
                  className="w-full rounded-xl bg-[#020617] border border-slate-800 px-4 py-3 text-sm sm:text-base outline-none focus:border-blue-500 transition"
                >
                  <option value="featured">Featured</option>
                  <option value="highestBid">Highest bid</option>
                  <option value="endingSoon">Ending soon</option>
                  <option value="newest">Newest listings</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {filteredAuctions.length === 0 ? (
              <div className="sm:col-span-2 xl:col-span-4 rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center">
                <p className="text-slate-300 font-semibold">
                  No auctions found.
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  Create a listing to publish the first live auction.
                </p>
              </div>
            ) : (
              filteredAuctions.map((auction) => {
                const displayedBid = liveBids[auction.id] || auction.currentBid;
                const auctionStatus = getAuctionStatus(auction);
                const bidCount = mounted ? bidCounts[auction.id] || 0 : 0;

                return (
                  <Link key={auction.id} href={`/auction/${auction.id}`}>
                    <div className="group h-full cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5 hover:border-blue-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 transition">
                      <div className="flex items-start justify-between gap-2 sm:gap-3 mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-xl bg-[#020617] border border-slate-800 flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-105 transition">
                            {auction.image}
                          </div>

                          <div className="min-w-0">
                            <h2 className="text-sm sm:text-base font-semibold truncate">
                              {auction.title}
                            </h2>

                            <p className="text-xs text-slate-400 mt-1">
                              {auction.symbol}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold ${auctionStatus.className}`}
                        >
                          {auctionStatus.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
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

                      <div className="flex items-center justify-between gap-2 text-[10px] sm:text-[11px]">
                        <span className="rounded-full bg-[#020617] border border-slate-800 px-2.5 py-1 text-slate-400">
                          {bidCount} bids
                        </span>

                        {auction.sellerCreated ? (
                          <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 font-semibold">
                            Seller
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-emerald-400">
                            Escrow-ready
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
