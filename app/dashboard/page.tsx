'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { notifyAssetReleased } from '@/app/lib/notifications';
import AuthGuard from '@/app/components/AuthGuard';

type User = {
  email: string;
  accountStatus: string;
};

type Profile = {
  fullName: string;
  phone: string;
  country: string;
  address: string;
  bankName: string;
  accountName: string;
  iban: string;
  swift: string;
};

type Auction = {
  id: string;
  title: string;
  asset: string;
  symbol?: string;
  assetAmount?: string;
  currentBid: number;
  escrowStatus?: string;
  paymentStatus?: string;
  settlementStatus?: string;
  endsAt?: string;
};

type UserBid = {
  auctionId: string;
  auctionTitle: string;
  symbol: string;
  userEmail: string;
  bidAmountUsd: number;
  displayAmount: number;
  currency: string;
  currentHighestBidUsd: number;
  status: string;
  auctionStatus: string;
  placedAt: string;
};

type Tab =
  | 'overview'
  | 'profile'
  | 'bids'
  | 'listings'
  | 'actions'
  | 'security';

const emptyProfile: Profile = {
  fullName: '',
  phone: '',
  country: '',
  address: '',
  bankName: '',
  accountName: '',
  iban: '',
  swift: '',
};

function formatUsd(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function getBidStatus(bid: UserBid) {
  const latestHighestBid = Number(
    localStorage.getItem(`bid-usd-${bid.auctionId}`) ||
      bid.currentHighestBidUsd ||
      bid.bidAmountUsd
  );

  const endTime = localStorage.getItem(`auction-end-${bid.auctionId}`);
  const hasEnded = endTime ? Date.now() > Number(endTime) : false;
  const isOutbid = latestHighestBid > bid.bidAmountUsd;

  if (hasEnded && isOutbid) {
    return {
      label: 'Lost Auction',
      settlementLabel: 'No action required',
      className: 'bg-red-500/10 text-red-400 border-red-500/20',
      latestHighestBid,
      requiresAction: false,
    };
  }

  if (hasEnded && !isOutbid) {
    return {
      label: 'Awaiting Payment',
      settlementLabel: 'Payment required',
      className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      latestHighestBid,
      requiresAction: true,
    };
  }

  if (isOutbid) {
    return {
      label: 'Outbid',
      settlementLabel: 'Increase bid to compete',
      className: 'bg-red-500/10 text-red-400 border-red-500/20',
      latestHighestBid,
      requiresAction: false,
    };
  }

  return {
    label: 'Winning',
    settlementLabel: 'Auction still live',
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    latestHighestBid,
    requiresAction: false,
  };
}

function getListingAction(listing: Auction) {
  if (listing.settlementStatus === 'completed') return null;
  if (listing.escrowStatus !== 'secured') return 'Deposit crypto to escrow';
  if (listing.paymentStatus === 'paid') return 'Release crypto to buyer';
  if (listing.paymentStatus === 'awaiting_payment')
    return 'Awaiting buyer payment';

  if (
    listing.settlementStatus === 'awaiting_release' ||
    listing.settlementStatus === 'ready_for_release'
  ) {
    return 'Release crypto to buyer';
  }

  return null;
}

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [sellerListings, setSellerListings] = useState<Auction[]>([]);
  const [userBids, setUserBids] = useState<UserBid[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('cryptobidx-user');
    const savedProfile = localStorage.getItem('cryptobidx-profile');
    const savedListings = localStorage.getItem('sellerAuctions');
    const savedUserBids = localStorage.getItem('cryptobidx-user-bids');

    const parsedUser = savedUser ? JSON.parse(savedUser) : null;

    if (parsedUser) setUser(parsedUser);
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedListings) setSellerListings(JSON.parse(savedListings));

    if (savedUserBids) {
      const parsedBids: UserBid[] = JSON.parse(savedUserBids);

      const filteredBids = parsedUser
        ? parsedBids.filter((bid) => bid.userEmail === parsedUser.email)
        : parsedBids;

      setUserBids(filteredBids);
    }
  }, []);

  function updateProfile(field: keyof Profile, value: string) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    localStorage.setItem('cryptobidx-profile', JSON.stringify(profile));
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  function releaseAsset(id: string) {
    const sellerAuctionsRaw = localStorage.getItem('sellerAuctions');
    const sellerAuctions: Auction[] = sellerAuctionsRaw
      ? JSON.parse(sellerAuctionsRaw)
      : [];

    let releasedAuctionTitle = 'Auction';

    const updated = sellerAuctions.map((auction) => {
      if (auction.id === id) {
        releasedAuctionTitle = auction.title || 'Auction';

        return {
          ...auction,
          settlementStatus: 'completed',
        };
      }

      return auction;
    });

    localStorage.setItem('sellerAuctions', JSON.stringify(updated));
    setSellerListings(updated);

    notifyAssetReleased({
      auctionId: id,
      assetName: releasedAuctionTitle,
    });

    alert('Asset released to buyer (demo). Settlement complete.');
  }

  const bidActions = userBids
    .map((bid) => ({
      bid,
      status: getBidStatus(bid),
    }))
    .filter((item) => item.status.requiresAction);

  const listingActions = sellerListings
    .map((listing) => ({
      listing,
      action: getListingAction(listing),
    }))
    .filter((item) => item.action);

  const requiredActionCount = bidActions.length + listingActions.length;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'profile', label: 'Profile' },
    { id: 'bids', label: 'Active Bids' },
    { id: 'listings', label: 'Listings' },
    { id: 'actions', label: 'Required Actions' },
    { id: 'security', label: 'Security' },
  ];

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="max-w-full">
        <div className="flex justify-between items-center mb-10">
          <div>
            <p className="text-sm text-cyan-400 font-semibold">
              Account Control Centre
            </p>
            <h1 className="text-4xl font-bold">User Dashboard</h1>
            <p className="text-slate-400 mt-2">
              Manage profile, bids, listings, security and settlement actions.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/wallet"
              className="rounded-xl bg-purple-600 px-5 py-3 font-semibold hover:bg-purple-500 transition"
            >
              Wallet
            </Link>

            <Link
              href="/sell"
              className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold hover:bg-emerald-500 transition"
            >
              Sell Crypto
            </Link>

            <Link
              href="/"
              className="rounded-xl bg-slate-800 border border-slate-700 px-5 py-3 font-semibold hover:border-cyan-400 transition"
            >
              Home
            </Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sticky top-6">
              <div className="rounded-xl bg-[#020617] border border-slate-800 p-4 mb-5">
                <p className="text-xs text-slate-500">Logged in as</p>
                <p className="font-semibold truncate mt-1">
                  {user?.email || 'Not logged in'}
                </p>
                <p className="text-xs text-emerald-400 mt-2">
                  {user?.accountStatus || 'Demo Active'}
                </p>
              </div>

              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left rounded-xl px-4 py-3 font-semibold transition ${
                      activeTab === tab.id
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-[#020617] border border-slate-800 text-slate-300 hover:border-cyan-400'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid gap-6 md:grid-cols-4">
                  <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
                    <p className="text-sm text-slate-500">Account</p>
                    <p className="text-xl font-bold mt-2">
                      {user?.accountStatus || 'Demo Active'}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
                    <p className="text-sm text-slate-500">Verification</p>
                    <p className="text-xl font-bold mt-2 text-yellow-400">
                      Pending
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
                    <p className="text-sm text-slate-500">Active Listings</p>
                    <p className="text-xl font-bold mt-2">
                      {sellerListings.length}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
                    <p className="text-sm text-slate-500">Required Actions</p>
                    <p className="text-xl font-bold mt-2 text-red-400">
                      {requiredActionCount}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8">
                  <h2 className="text-2xl font-bold mb-4">Account Overview</h2>

                  <div className="grid gap-5 md:grid-cols-3">
                    <div className="rounded-xl bg-[#020617] border border-slate-800 p-5">
                      <p className="text-slate-500 text-sm">Active Bids</p>
                      <p className="text-3xl font-bold mt-2">
                        {userBids.length}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#020617] border border-slate-800 p-5">
                      <p className="text-slate-500 text-sm">Seller Auctions</p>
                      <p className="text-3xl font-bold mt-2">
                        {sellerListings.length}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#020617] border border-slate-800 p-5">
                      <p className="text-slate-500 text-sm">Settlement Tasks</p>
                      <p className="text-3xl font-bold mt-2 text-red-400">
                        {requiredActionCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8">
                <h2 className="text-2xl font-bold mb-2">
                  Personal Information
                </h2>
                <p className="text-slate-400 mb-6">
                  These details will later be used for KYC, payout processing
                  and auction settlement.
                </p>

                <form onSubmit={saveProfile} className="space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    {[
                      ['fullName', 'Full Legal Name', 'Full legal name'],
                      ['phone', 'Phone Number', '+44...'],
                      ['country', 'Country', 'United Kingdom'],
                      ['address', 'Address', 'Residential address'],
                      ['bankName', 'Bank Name', 'Bank name'],
                      ['accountName', 'Account Name', 'Account holder name'],
                      ['iban', 'IBAN', 'IBAN / account number'],
                      ['swift', 'SWIFT / BIC', 'SWIFT / BIC'],
                    ].map(([field, label, placeholder]) => (
                      <div key={field}>
                        <label className="block text-sm mb-2">{label}</label>
                        <input
                          value={profile[field as keyof Profile]}
                          onChange={(e) =>
                            updateProfile(
                              field as keyof Profile,
                              e.target.value
                            )
                          }
                          placeholder={placeholder}
                          className="w-full rounded-xl bg-[#020617] border border-slate-700 px-4 py-3 outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-3 font-bold"
                  >
                    Save Profile
                  </button>

                  {saved && (
                    <p className="text-sm text-emerald-400">
                      Profile saved successfully.
                    </p>
                  )}
                </form>
              </div>
            )}

            {activeTab === 'bids' && (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8">
                <h2 className="text-2xl font-bold mb-2">Active Bids</h2>
                <p className="text-slate-400 mb-6">
                  Auctions you are bidding on.
                </p>

                {userBids.length === 0 ? (
                  <p className="text-slate-500">No active bids found.</p>
                ) : (
                  <div className="space-y-4">
                    {userBids.map((bid) => {
                      const bidStatus = getBidStatus(bid);

                      return (
                        <Link
                          key={`${bid.auctionId}-${bid.placedAt}`}
                          href={`/auction/${bid.auctionId}`}
                          className="block rounded-xl bg-[#020617] border border-slate-800 p-5 hover:border-blue-400 transition"
                        >
                          <div className="flex justify-between gap-3">
                            <div>
                              <p className="font-semibold">
                                {bid.auctionTitle}
                              </p>
                              <p className="text-sm text-slate-400">
                                Asset: {bid.symbol}
                              </p>
                            </div>

                            <span
                              className={`rounded-full border px-3 py-1 text-xs h-fit ${bidStatus.className}`}
                            >
                              {bidStatus.label}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-slate-500">Your Bid</p>
                              <p className="font-bold text-blue-400">
                                {formatUsd(bid.bidAmountUsd)}
                              </p>
                            </div>

                            <div>
                              <p className="text-slate-500">Current Highest</p>
                              <p className="font-semibold">
                                {formatUsd(bidStatus.latestHighestBid)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 rounded-xl bg-slate-900 border border-slate-800 p-3">
                            <p className="text-xs text-slate-500">
                              Settlement Status
                            </p>
                            <p className="text-sm font-semibold mt-1">
                              {bidStatus.settlementLabel}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'listings' && (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8">
                <h2 className="text-2xl font-bold mb-2">Active Listings</h2>
                <p className="text-slate-400 mb-6">
                  Auctions you have created as a seller.
                </p>

                {sellerListings.length === 0 ? (
                  <p className="text-slate-500">No active listings yet.</p>
                ) : (
                  <div className="space-y-4">
                    {sellerListings.map((listing) => {
                      const listingAction = getListingAction(listing);
                      const canReleaseAsset =
                        listing.paymentStatus === 'paid' &&
                        listing.settlementStatus !== 'completed';

                      return (
                        <div
                          key={listing.id}
                          className="rounded-xl bg-[#020617] border border-slate-800 p-5 hover:border-cyan-400 transition"
                        >
                          <Link
                            href={`/auction/${listing.id}`}
                            className="block"
                          >
                            <div className="flex justify-between gap-4">
                              <div>
                                <p className="font-semibold">{listing.title}</p>
                                <p className="text-sm text-slate-400 mt-1">
                                  {listing.assetAmount || '0'}{' '}
                                  {listing.symbol || listing.asset}
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="text-sm text-slate-500">
                                  Current Bid
                                </p>
                                <p className="font-bold text-blue-400">
                                  {formatUsd(listing.currentBid)}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-4 text-xs">
                              <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1">
                                Escrow: {listing.escrowStatus || 'pending'}
                              </span>

                              <span className="rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1">
                                Payment:{' '}
                                {listing.paymentStatus || 'awaiting_winner'}
                              </span>

                              <span className="rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1">
                                Settlement:{' '}
                                {listing.settlementStatus || 'auction_live'}
                              </span>

                              {listingAction && (
                                <span className="rounded-full bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1">
                                  Action: {listingAction}
                                </span>
                              )}
                            </div>
                          </Link>

                          {canReleaseAsset && (
                            <button
                              onClick={() => releaseAsset(listing.id)}
                              className="mt-4 w-full rounded-xl bg-cyan-500 text-slate-950 py-3 font-bold hover:bg-cyan-400 transition"
                            >
                              Release Asset to Buyer
                            </button>
                          )}

                          {listing.settlementStatus === 'completed' && (
                            <div className="mt-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
                              <p className="text-sm font-semibold text-emerald-400">
                                Settlement complete. Asset has been released.
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'actions' && (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8">
                <h2 className="text-2xl font-bold mb-2">Required Actions</h2>
                <p className="text-slate-400 mb-6">
                  Items needing payment, release or settlement attention.
                </p>

                {requiredActionCount === 0 ? (
                  <p className="text-slate-500">
                    No required actions right now.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {bidActions.map((item) => (
                      <Link
                        key={`bid-action-${item.bid.auctionId}`}
                        href={`/auction/${item.bid.auctionId}`}
                        className="block rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-4 hover:border-yellow-400 transition"
                      >
                        <p className="font-semibold">{item.bid.auctionTitle}</p>
                        <p className="text-sm text-yellow-300 mt-1">
                          {item.status.settlementLabel}
                        </p>
                      </Link>
                    ))}

                    {listingActions.map((item) => (
                      <Link
                        key={`listing-action-${item.listing.id}`}
                        href={`/auction/${item.listing.id}`}
                        className="block rounded-xl bg-red-500/10 border border-red-500/20 p-4 hover:border-red-400 transition"
                      >
                        <p className="font-semibold">{item.listing.title}</p>
                        <p className="text-sm text-red-300 mt-1">
                          {item.action}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8">
                <h2 className="text-2xl font-bold mb-2">Security</h2>
                <p className="text-slate-400 mb-6">
                  Account security controls will connect to real authentication
                  later.
                </p>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="rounded-xl bg-[#020617] border border-slate-800 p-5">
                    <p className="text-slate-500 text-sm">Email</p>
                    <p className="font-semibold mt-1">
                      {user?.email || 'Not logged in'}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#020617] border border-slate-800 p-5">
                    <p className="text-slate-500 text-sm">Password</p>
                    <button className="mt-3 rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 font-semibold">
                      Change Password
                    </button>
                  </div>

                  <div className="rounded-xl bg-[#020617] border border-slate-800 p-5">
                    <p className="text-slate-500 text-sm">2FA</p>
                    <p className="text-yellow-400 font-semibold mt-1">
                      Not enabled
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#020617] border border-slate-800 p-5">
                    <p className="text-slate-500 text-sm">KYC Verification</p>
                    <p className="text-yellow-400 font-semibold mt-1">
                      Required before live payouts
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
