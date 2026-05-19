'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { notifyBidPlaced, notifyOutbid } from '@/app/lib/notifications';

const exchangeRates = {
  USD: 1,
  GBP: 0.8,
  EUR: 0.93,
};

type Currency = 'USD' | 'GBP' | 'EUR';

type User = {
  id?: string;
  email: string;
  accountStatus: string;
};

type Auction = {
  id: string;
  title: string;
  symbol: string;
  currentBidUsd: number;
  image: string;
  durationSeconds: number;
  description: string;
  sellerCreated?: boolean;
  assetAmount?: string;
  escrowStatus?: string;
  paymentStatus?: string;
  settlementStatus?: string;
  endsAt?: string;
};

type BidHistoryItem = {
  bidder: string;
  amountUsd: number;
  currency?: Currency;
  displayAmount?: number;
  time: string;
};

function formatTime(seconds: number) {
  if (seconds <= 0) return 'Auction ended';

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m ${secs}s`;

  return `${hours}h ${minutes}m ${secs}s`;
}

function formatCurrency(amount: number, currency?: Currency) {
  const safeCurrency = currency || 'USD';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: safeCurrency,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function formatCryptoAmount(amount: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 8,
  }).format(amount || 0);
}

function convertToUsd(amount: number, currency: Currency) {
  return amount / exchangeRates[currency];
}

function convertFromUsd(amountUsd: number, currency: Currency) {
  return amountUsd * exchangeRates[currency];
}

function getCryptoIcon(symbol: string) {
  const clean = symbol.toUpperCase();

  if (clean.includes('BTC') || clean.includes('BITCOIN')) return '₿';
  if (clean.includes('ETH') || clean.includes('ETHEREUM')) return 'Ξ';
  if (clean.includes('SOL') || clean.includes('SOLANA')) return '◎';
  if (clean.includes('USDT') || clean.includes('TETHER')) return '₮';
  if (clean.includes('XRP')) return '✕';

  return '◈';
}

function getCoinGeckoId(symbol: string) {
  const clean = symbol.toUpperCase();

  if (clean.includes('BTC') || clean.includes('BITCOIN')) return 'bitcoin';
  if (clean.includes('ETH') || clean.includes('ETHEREUM')) return 'ethereum';
  if (clean.includes('SOL') || clean.includes('SOLANA')) return 'solana';
  if (clean.includes('USDT') || clean.includes('TETHER')) return 'tether';
  if (clean.includes('XRP')) return 'ripple';

  return '';
}

function getAssetQuantity(assetAmount?: string) {
  if (!assetAmount) return 1;

  const match = assetAmount.match(/[\d.]+/);
  const parsedAmount = match ? Number(match[0]) : 1;

  if (!parsedAmount || parsedAmount <= 0) return 1;

  return parsedAmount;
}

function getSecondsUntilEnd(endsAt?: string, fallbackSeconds = 0) {
  if (!endsAt) return fallbackSeconds;

  return Math.max(
    0,
    Math.floor((new Date(endsAt).getTime() - Date.now()) / 1000)
  );
}

function mapSupabaseAuction(row: any): Auction {
  const symbol = row.symbol || row.asset_name || 'CRYPTO';
  const currentBidUsd = Number(
    row.current_bid_usd || row.starting_price_usd || 0
  );

  return {
    id: row.id,
    title: row.title || `${symbol} Auction`,
    symbol,
    currentBidUsd,
    image: row.image || getCryptoIcon(symbol),
    durationSeconds: getSecondsUntilEnd(row.ends_at),
    description:
      row.description ||
      'Seller-created crypto auction with escrow-backed settlement.',
    sellerCreated: true,
    assetAmount: row.asset_amount ? String(row.asset_amount) : '1',
    escrowStatus: row.escrow_reference ? 'secured' : 'secured',
    paymentStatus: row.external_payment_reference
      ? 'payment_tracked'
      : 'awaiting_winner',
    settlementStatus: row.settlement_status || 'auction_live',
    endsAt: row.ends_at,
  };
}

function mapSupabaseBid(row: any): BidHistoryItem {
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

  const email =
    profile?.email ||
    profile?.display_name ||
    row.bidder_email ||
    'Bidder';

  return {
    bidder: email,
    amountUsd: Number(row.amount_usd || 0),
    currency: 'USD',
    displayAmount: Number(row.amount_usd || 0),
    time: row.created_at
      ? new Date(row.created_at).toLocaleTimeString()
      : '',
  };
}

function getSettlementStatus(
  user: User | null,
  bidHistory: BidHistoryItem[],
  timeLeft: number
) {
  const highestBid = bidHistory[0];

  if (timeLeft > 0) {
    return {
      title: 'Auction Live',
      description:
        'Bidding is open. The highest valid bidder when the timer ends will move into settlement.',
      badge: 'Live',
      className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      actionRequired: false,
    };
  }

  if (!highestBid) {
    return {
      title: 'Auction Ended',
      description:
        'This auction ended without bids. No payment or transfer action is required.',
      badge: 'No Winner',
      className: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
      actionRequired: false,
    };
  }

  if (!user) {
    return {
      title: 'Auction Ended',
      description:
        'This auction has ended. Log in to check whether settlement action is required.',
      badge: 'Ended',
      className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      actionRequired: false,
    };
  }

  if (highestBid.bidder === user.email) {
    return {
      title: 'You Won This Auction',
      description:
        'You are the highest bidder. Complete payment so the crypto asset can move through settlement and release.',
      badge: 'Awaiting Payment',
      className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      actionRequired: true,
    };
  }

  const userPlacedBid = bidHistory.some((item) => item.bidder === user.email);

  if (userPlacedBid) {
    return {
      title: 'You Were Outbid',
      description:
        'Another bidder finished higher. No payment is required from your account.',
      badge: 'Lost Auction',
      className: 'bg-red-500/10 text-red-400 border-red-500/20',
      actionRequired: false,
    };
  }

  return {
    title: 'Auction Ended',
    description:
      'The highest bidder will now move through payment and settlement.',
    badge: 'Settlement Pending',
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    actionRequired: false,
  };
}

function statusPillClass(status?: string) {
  const safeStatus = status || '';

  if (
    safeStatus.includes('paid') ||
    safeStatus.includes('secured') ||
    safeStatus.includes('completed')
  ) {
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  }

  if (
    safeStatus.includes('awaiting') ||
    safeStatus.includes('pending') ||
    safeStatus.includes('ready')
  ) {
    return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
  }

  return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
}

export default function AuctionPage({ params }: { params: { id: string } }) {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loadingAuction, setLoadingAuction] = useState(true);

  const [user, setUser] = useState<User | null>(null);
  const [bid, setBid] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');
  const [currentBidUsd, setCurrentBidUsd] = useState(0);
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [bidHistory, setBidHistory] = useState<BidHistoryItem[]>([]);
  const [livePriceUsd, setLivePriceUsd] = useState<number | null>(null);
  const [marketPriceLoading, setMarketPriceLoading] = useState(false);
  const [marketPriceError, setMarketPriceError] = useState('');

  async function loadAuctionData() {
    setLoadingAuction(true);

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser?.email) {
      setUser({
        id: authUser.id,
        email: authUser.email,
        accountStatus: 'active',
      });

      localStorage.setItem(
        'cryptobidx-user',
        JSON.stringify({
          id: authUser.id,
          email: authUser.email,
          accountStatus: 'active',
        })
      );
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

    const { data: auctionData, error: auctionError } = await supabase
      .from('auctions')
      .select('*')
      .eq('id', params.id)
      .maybeSingle();

    console.log('AUCTION PARAM ID:', params.id);
    console.log('AUCTION DATA:', auctionData);
    console.log('AUCTION ERROR:', auctionError);

    if (auctionError) {
      console.error('Supabase auction error:', auctionError);
      setAuction(null);
      setLoadingAuction(false);
      return;
    }

    if (!auctionData) {
      setAuction(null);
      setLoadingAuction(false);
      return;
    }

    const mappedAuction = mapSupabaseAuction(auctionData);

    setAuction(mappedAuction);
    setCurrentBidUsd(mappedAuction.currentBidUsd);
    setTimeLeft(mappedAuction.durationSeconds);

    const { data: bidsData, error: bidsError } = await supabase
      .from('bids')
      .select(
        `
        id,
        amount_usd,
        status,
        created_at,
        bidder_id,
        profiles:bidder_id (
          email,
          display_name
        )
      `
      )
      .eq('auction_id', params.id)
      .order('amount_usd', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(8);

    if (bidsError) {
      console.error('Supabase bids error:', bidsError);
      setBidHistory([]);
      setLoadingAuction(false);
      return;
    }

    const mappedBids = bidsData?.map(mapSupabaseBid) || [];
    setBidHistory(mappedBids);

    if (mappedBids[0]) {
      setCurrentBidUsd(mappedBids[0].amountUsd);
    }

    setLoadingAuction(false);
  }

  useEffect(() => {
    loadAuctionData();

    const auctionChannel = supabase
      .channel(`auction-detail-${params.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'auctions',
          filter: `id=eq.${params.id}`,
        },
        () => {
          loadAuctionData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bids',
          filter: `auction_id=eq.${params.id}`,
        },
        () => {
          loadAuctionData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(auctionChannel);
    };
  }, [params.id]);

  useEffect(() => {
    if (!auction) return;

    const timer = setInterval(() => {
      const remaining = getSecondsUntilEnd(auction.endsAt, timeLeft);

      setTimeLeft(remaining);

      if (remaining <= 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [auction, timeLeft]);

  useEffect(() => {
    if (!auction) return;

    const coinGeckoId = getCoinGeckoId(auction.symbol);

    if (!coinGeckoId) {
      setMarketPriceError('Live market price is not available for this asset.');
      setLivePriceUsd(null);
      return;
    }

    let cancelled = false;

    async function fetchLivePrice() {
      try {
        setMarketPriceLoading(true);
        setMarketPriceError('');

        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoId}&vs_currencies=usd`
        );

        if (!response.ok) {
          throw new Error('Unable to fetch market price.');
        }

        const data = await response.json();
        const price = data?.[coinGeckoId]?.usd;

        if (!cancelled) {
          if (price) {
            setLivePriceUsd(Number(price));
          } else {
            setLivePriceUsd(null);
            setMarketPriceError(
              'Live market price is temporarily unavailable.'
            );
          }
        }
      } catch (error) {
        if (!cancelled) {
          setLivePriceUsd(null);
          setMarketPriceError('Live market price is temporarily unavailable.');
        }
      } finally {
        if (!cancelled) {
          setMarketPriceLoading(false);
        }
      }
    }

    fetchLivePrice();

    const interval = setInterval(fetchLivePrice, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [auction]);

  if (loadingAuction) {
    return (
      <main className="min-h-screen bg-slate-950 text-white px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-slate-400">Loading auction...</p>
        </div>
      </main>
    );
  }

  if (!auction) {
    return (
      <main className="min-h-screen bg-slate-950 text-white px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-red-400 mb-4">Auction not found.</p>
          <Link href="/" className="text-blue-400 hover:underline">
            Back to homepage
          </Link>
        </div>
      </main>
    );
  }

  const currentBidSelectedCurrency = convertFromUsd(
    currentBidUsd,
    selectedCurrency
  );

  const settlementStatus = getSettlementStatus(user, bidHistory, timeLeft);
  const highestBid = bidHistory[0];
  const userIsHighestBidder = Boolean(
    user && highestBid && highestBid.bidder === user.email
  );
  const userHasBid = Boolean(
    user && bidHistory.some((item) => item.bidder === user.email)
  );

  const assetQuantity = getAssetQuantity(auction.assetAmount);
  const marketValueUsd = livePriceUsd ? livePriceUsd * assetQuantity : null;
  const savingUsd = marketValueUsd ? marketValueUsd - currentBidUsd : null;
  const savingPercent =
    marketValueUsd && savingUsd !== null
      ? (savingUsd / marketValueUsd) * 100
      : null;
  const isBelowMarket = savingUsd !== null && savingUsd > 0;
  const isAboveMarket = savingUsd !== null && savingUsd < 0;

  async function placeBid() {
    const bidAmount = Number(bid);
    const bidAmountUsd = convertToUsd(bidAmount, selectedCurrency);
    const previousHighestBid = bidHistory[0];

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      setMessage(
        'You must be logged in with an active Supabase account to place a bid.'
      );
      return;
    }

    if (!user) {
      setMessage(
        'You must be logged in with an active account to place a bid.'
      );
      return;
    }

    if (user.accountStatus !== 'active') {
      setMessage('Your account must be active before you can place a bid.');
      return;
    }

    if (timeLeft <= 0) {
      setMessage('This auction has ended.');
      return;
    }

    if (!bidAmount || bidAmountUsd <= currentBidUsd) {
      setMessage(
        `Your bid must be higher than ${formatCurrency(
          currentBidSelectedCurrency,
          selectedCurrency
        )}.`
      );
      return;
    }

    const { error } = await supabase.rpc('place_bid', {
      p_auction_id: params.id,
      p_amount_usd: bidAmountUsd,
    });

    if (error) {
      console.error('Place bid error:', error);
      setMessage(error.message || 'Unable to place bid.');
      return;
    }

    notifyBidPlaced({
      auctionId: params.id,
      assetName: auction?.title || 'Auction',
      amount: bidAmountUsd,
    });

    if (previousHighestBid && previousHighestBid.bidder !== user.email) {
      notifyOutbid({
        auctionId: params.id,
        assetName: auction.title,
        amount: bidAmountUsd,
      });
    }

    setBid('');
    setMessage('Your bid was placed successfully.');
    await loadAuctionData();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 xl:px-10 py-10">
      <section className="w-full">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <Link href="/" className="text-blue-400 hover:underline">
            ← Back to Home Page
          </Link>

          {user ? (
            <div className="rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 text-right">
              <p className="text-xs text-slate-500">Logged in as</p>
              <p className="text-sm font-semibold">{user.email}</p>
            </div>
          ) : (
            <Link
              href="/login"
              className="w-fit rounded-xl bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-500 transition"
            >
              Login / Register
            </Link>
          )}
        </div>

        {!user && (
          <div className="mb-6 rounded-2xl bg-slate-900 border border-blue-500 p-5">
            <h2 className="text-xl font-semibold mb-2">
              Login required to bid
            </h2>
            <p className="text-slate-400 mb-4">
              You can view auction details without an account, but only active
              CryptoBidX users can place bids.
            </p>
            <Link
              href="/login"
              className="inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500 transition"
            >
              Login / Register
            </Link>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-12">
          <div className="xl:col-span-8 space-y-6">
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 xl:p-8">
              <div className="flex flex-col lg:flex-row lg:justify-between gap-8">
                <div>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="h-20 w-20 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center text-6xl">
                      {auction.image}
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${settlementStatus.className}`}
                        >
                          {settlementStatus.badge}
                        </span>

                        <span className="rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 text-xs font-semibold">
                          {auction.symbol}
                        </span>

                        {auction.sellerCreated && (
                          <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 text-xs font-semibold">
                            Seller Listing
                          </span>
                        )}

                        {marketValueUsd && (
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                              isBelowMarket
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : isAboveMarket
                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                : 'bg-slate-500/10 text-slate-300 border-slate-500/20'
                            }`}
                          >
                            {isBelowMarket
                              ? 'Below Market'
                              : isAboveMarket
                              ? 'Above Market'
                              : 'At Market'}
                          </span>
                        )}
                      </div>

                      <h1 className="text-4xl font-bold">{auction.title}</h1>
                    </div>
                  </div>

                  <p className="text-slate-400 max-w-3xl">
                    {auction.description}
                  </p>
                </div>

                <div className="rounded-3xl bg-slate-950 border border-slate-800 p-5 min-w-full lg:min-w-[320px]">
                  <p className="text-xs text-slate-500 mb-1">
                    Current Highest Bid
                  </p>
                  <p className="text-4xl font-bold text-blue-400">
                    {formatCurrency(
                      currentBidSelectedCurrency,
                      selectedCurrency
                    )}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Base value: {formatCurrency(currentBidUsd, 'USD')}
                  </p>

                  <div className="mt-5 rounded-2xl bg-slate-900 border border-slate-800 p-4">
                    <div className="flex justify-between gap-4 items-start">
                      <div>
                        <p className="text-xs text-slate-500">
                          Live Market Value
                        </p>
                        <p className="text-2xl font-bold mt-1 text-emerald-400">
                          {marketPriceLoading && !marketValueUsd
                            ? 'Loading...'
                            : marketValueUsd
                            ? formatCurrency(marketValueUsd, 'USD')
                            : 'Unavailable'}
                        </p>
                      </div>

                      {savingPercent !== null && (
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                            isBelowMarket
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : isAboveMarket
                              ? 'bg-red-500/10 text-red-400 border-red-500/20'
                              : 'bg-slate-500/10 text-slate-300 border-slate-500/20'
                          }`}
                        >
                          {isBelowMarket
                            ? `${savingPercent.toFixed(2)}% saving`
                            : isAboveMarket
                            ? `${Math.abs(savingPercent).toFixed(
                                2
                              )}% over market`
                            : 'Market match'}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl bg-slate-950 border border-slate-800 p-3">
                        <p className="text-slate-500">Spot Price</p>
                        <p className="mt-1 font-semibold text-slate-200">
                          {livePriceUsd
                            ? `${formatCurrency(livePriceUsd, 'USD')} / ${
                                auction.symbol
                              }`
                            : 'Unavailable'}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-950 border border-slate-800 p-3">
                        <p className="text-slate-500">Lot Size</p>
                        <p className="mt-1 font-semibold text-slate-200">
                          {formatCryptoAmount(assetQuantity)} {auction.symbol}
                        </p>
                      </div>
                    </div>

                    {savingUsd !== null && (
                      <div className="mt-4 rounded-xl bg-slate-950 border border-slate-800 p-3">
                        <p className="text-xs text-slate-500">
                          Current Bid vs Live Market
                        </p>
                        <p
                          className={`mt-1 text-lg font-bold ${
                            isBelowMarket
                              ? 'text-emerald-400'
                              : isAboveMarket
                              ? 'text-red-400'
                              : 'text-slate-300'
                          }`}
                        >
                          {isBelowMarket
                            ? `Estimated saving: ${formatCurrency(
                                savingUsd,
                                'USD'
                              )}`
                            : isAboveMarket
                            ? `Currently above market by ${formatCurrency(
                                Math.abs(savingUsd),
                                'USD'
                              )}`
                            : 'Current bid is matching live market value'}
                        </p>
                      </div>
                    )}

                    {marketPriceError && (
                      <p className="text-xs text-yellow-400 mt-3">
                        {marketPriceError}
                      </p>
                    )}

                    <p className="text-[11px] text-slate-600 mt-3">
                      Live pricing is indicative and refreshes automatically.
                      Final settlement pricing should be verified before asset
                      release.
                    </p>
                  </div>

                  <div className="mt-5 rounded-2xl bg-slate-900 border border-slate-800 p-4">
                    <p className="text-xs text-slate-500">Auction Ends In</p>
                    <p className="text-2xl font-bold mt-1">
                      {formatTime(timeLeft)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
                <p className="text-xs text-slate-500">Escrow</p>
                <p
                  className={`mt-2 inline-block rounded-full border px-3 py-1 text-xs font-semibold ${statusPillClass(
                    auction.escrowStatus || 'secured'
                  )}`}
                >
                  {auction.escrowStatus || 'secured'}
                </p>
                <p className="text-sm text-slate-400 mt-3">
                  Asset represented as secured before settlement.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
                <p className="text-xs text-slate-500">Payment</p>
                <p
                  className={`mt-2 inline-block rounded-full border px-3 py-1 text-xs font-semibold ${statusPillClass(
                    auction.paymentStatus || 'awaiting_winner'
                  )}`}
                >
                  {auction.paymentStatus || 'awaiting_winner'}
                </p>
                <p className="text-sm text-slate-400 mt-3">
                  Winner pays after the auction closes.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
                <p className="text-xs text-slate-500">Settlement</p>
                <p
                  className={`mt-2 inline-block rounded-full border px-3 py-1 text-xs font-semibold ${statusPillClass(
                    auction.settlementStatus || 'auction_live'
                  )}`}
                >
                  {auction.settlementStatus || 'auction_live'}
                </p>
                <p className="text-sm text-slate-400 mt-3">
                  Release flow activates after verified payment.
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">
              <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {settlementStatus.title}
                  </h2>
                  <p className="text-sm text-slate-400 max-w-2xl">
                    {settlementStatus.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3 text-xs">
                    {userIsHighestBidder && (
                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-emerald-400 font-semibold">
                        You are currently winning
                      </span>
                    )}

                    {userHasBid && !userIsHighestBidder && (
                      <span className="rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-red-400 font-semibold">
                        You have been outbid
                      </span>
                    )}

                    {!userHasBid && user && timeLeft > 0 && (
                      <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-blue-400 font-semibold">
                        You have not bid yet
                      </span>
                    )}
                  </div>
                </div>

                {settlementStatus.actionRequired && (
                  <Link
                    href={`/payment/${params.id}`}
                    className="h-fit rounded-xl bg-yellow-500 text-slate-950 px-6 py-4 font-bold hover:bg-yellow-400 transition text-center"
                  >
                    Continue to Payment
                  </Link>
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">
              <h2 className="text-2xl font-bold mb-2">Place a Bid</h2>
              <p className="text-sm text-slate-400 mb-5">
                Enter your bid in your preferred fiat currency. CryptoBidX
                stores the value in USD internally so every bid is compared
                fairly.
              </p>

              {marketValueUsd && (
                <div className="mb-5 rounded-2xl bg-slate-950 border border-slate-800 p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-500">
                        Bid Guidance Based on Live Market
                      </p>
                      <p className="text-sm text-slate-300 mt-1">
                        Current market value for this lot is{' '}
                        <span className="font-semibold text-white">
                          {formatCurrency(marketValueUsd, 'USD')}
                        </span>
                        .
                      </p>
                    </div>

                    {savingUsd !== null && (
                      <div
                        className={`rounded-xl border px-4 py-3 ${
                          isBelowMarket
                            ? 'bg-emerald-500/10 border-emerald-500/20'
                            : isAboveMarket
                            ? 'bg-red-500/10 border-red-500/20'
                            : 'bg-slate-500/10 border-slate-500/20'
                        }`}
                      >
                        <p
                          className={`text-sm font-bold ${
                            isBelowMarket
                              ? 'text-emerald-400'
                              : isAboveMarket
                              ? 'text-red-400'
                              : 'text-slate-300'
                          }`}
                        >
                          {isBelowMarket
                            ? `${formatCurrency(savingUsd, 'USD')} below market`
                            : isAboveMarket
                            ? `${formatCurrency(
                                Math.abs(savingUsd),
                                'USD'
                              )} above market`
                            : 'At market'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid gap-3 md:grid-cols-[160px_1fr_180px]">
                <select
                  value={selectedCurrency}
                  onChange={(e) =>
                    setSelectedCurrency(e.target.value as Currency)
                  }
                  disabled={!user || timeLeft <= 0}
                  className="rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                  <option value="EUR">EUR</option>
                </select>

                <input
                  type="number"
                  value={bid}
                  onChange={(e) => setBid(e.target.value)}
                  placeholder={`Enter bid in ${selectedCurrency}`}
                  disabled={!user || timeLeft <= 0}
                  className="rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500 disabled:opacity-50"
                />

                <button
                  onClick={placeBid}
                  disabled={!user || timeLeft <= 0}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 active:scale-95 transition disabled:opacity-50"
                >
                  Place Bid
                </button>
              </div>

              {message && (
                <p className="mt-4 rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-slate-300">
                  {message}
                </p>
              )}
            </div>
          </div>

          <aside className="xl:col-span-4 space-y-6">
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold">Bid History</h2>
                <span className="rounded-full bg-slate-950 border border-slate-800 px-3 py-1 text-xs text-slate-400">
                  {bidHistory.length} bids
                </span>
              </div>

              {bidHistory.length === 0 ? (
                <p className="text-slate-500 text-sm">
                  No bids yet. Place the first bid.
                </p>
              ) : (
                <div className="space-y-3">
                  {bidHistory.map((item, index) => (
                    <div
                      key={index}
                      className={`rounded-xl border p-4 ${
                        index === 0
                          ? 'bg-blue-500/10 border-blue-500/20'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="flex justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold truncate">
                            {item.bidder}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {index === 0 ? 'Highest bid' : 'Previous bid'}
                          </p>
                        </div>

                        <p className="text-blue-400 font-bold shrink-0">
                          {formatCurrency(
                            item.displayAmount || item.amountUsd,
                            item.currency
                          )}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        Base: {formatCurrency(item.amountUsd, 'USD')} ·{' '}
                        {item.time}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">
              <h2 className="text-xl font-semibold mb-4">Trust Controls</h2>

              <div className="space-y-4">
                <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">
                  <p className="text-emerald-400 font-bold">
                    Escrow-backed listing
                  </p>
                  <p className="text-sm text-slate-400 mt-2">
                    Seller assets are represented as secured before completion.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">
                  <p className="text-blue-400 font-bold">
                    Fiat-based price discovery
                  </p>
                  <p className="text-sm text-slate-400 mt-2">
                    Bids are compared on a USD base value for consistency.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">
                  <p className="text-yellow-400 font-bold">
                    Settlement after close
                  </p>
                  <p className="text-sm text-slate-400 mt-2">
                    Payment and asset release happen only after the auction
                    result is final.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">
              <h2 className="text-xl font-semibold mb-4">Auction Process</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-blue-400 font-bold">01. Bid</p>
                  <p className="text-sm text-slate-400">
                    Active users submit fiat bids while the timer is live.
                  </p>
                </div>

                <div>
                  <p className="text-blue-400 font-bold">02. Compare</p>
                  <p className="text-sm text-slate-400">
                    The platform compares every bid using a USD base value.
                  </p>
                </div>

                <div>
                  <p className="text-blue-400 font-bold">03. Close</p>
                  <p className="text-sm text-slate-400">
                    When the timer reaches zero, bidding closes automatically.
                  </p>
                </div>

                <div>
                  <p className="text-blue-400 font-bold">04. Settle</p>
                  <p className="text-sm text-slate-400">
                    The winner completes payment, then asset release can follow.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="text-lg font-semibold mb-2">How bidding works</h3>
            <p className="text-slate-400 text-sm">
              Bids are placed in fiat currency. Even if a user selects GBP or
              EUR, the platform stores the value in USD internally so bids
              remain comparable.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="text-lg font-semibold mb-2">When payment happens</h3>
            <p className="text-slate-400 text-sm">
              Payment does not happen at bid entry in this prototype. The
              winning bidder completes payment after the auction closes.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="text-lg font-semibold mb-2">After winning</h3>
            <p className="text-slate-400 text-sm">
              The winner is confirmed, payment is completed, and the crypto
              asset is transferred once settlement requirements are satisfied.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}