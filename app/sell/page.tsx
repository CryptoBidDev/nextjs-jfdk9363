'use client';

import Link from 'next/link';
import { useState } from 'react';
import AuthGuard from '@/app/components/AuthGuard';
import { supabase } from '@/app/lib/supabase';

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

  return '◈';
}

function SellContent() {
  const [step, setStep] = useState(1);
  const [asset, setAsset] = useState('');
  const [amount, setAmount] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [duration, setDuration] = useState('24');
  const [description, setDescription] = useState('');
  const [network, setNetwork] = useState('');
  const [escrowConfirmed, setEscrowConfirmed] = useState(false);
  const [finalConfirmed, setFinalConfirmed] = useState(false);
  const [publishedAuctionId, setPublishedAuctionId] = useState('');
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');

  const totalSteps = 4;

  const canGoStep2 = Boolean(asset && amount && network);
  const canGoStep3 = Boolean(startingPrice && duration && description);
  const canGoStep4 = Boolean(escrowConfirmed);
  const canCreate = canGoStep2 && canGoStep3 && canGoStep4 && finalConfirmed;

  function goNext() {
    if (step === 1 && !canGoStep2) return;
    if (step === 2 && !canGoStep3) return;
    if (step === 3 && !canGoStep4) return;

    setStep((current) => Math.min(totalSteps, current + 1));
  }

  function goBack() {
    setStep((current) => Math.max(1, current - 1));
  }

  function resetForm() {
    setStep(1);
    setAsset('');
    setAmount('');
    setStartingPrice('');
    setDuration('24');
    setDescription('');
    setNetwork('');
    setEscrowConfirmed(false);
    setFinalConfirmed(false);
    setPublishedAuctionId('');
    setPublished(false);
    setPublishing(false);
    setPublishError('');
  }

  async function createListing(e: React.FormEvent) {
    e.preventDefault();
    setPublishError('');

    if (step !== 4) {
      goNext();
      return;
    }

    if (!canCreate || publishing) return;

    try {
      setPublishing(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error('You must be logged in to publish an auction.');
      }

      const startsAt = new Date();
      const endsAt = new Date(
        Date.now() + Number(duration) * 60 * 60 * 1000
      );

      const { data, error } = await supabase
        .from('auctions')
        .insert({
          seller_id: user.id,
          title: `${amount} ${asset} Auction`,
          description,
          symbol: asset,
          asset_name: asset,
          asset_amount: Number(amount),
          starting_price_usd: Number(startingPrice),
          current_bid_usd: Number(startingPrice),
          image: getCryptoIcon(asset),
          status: 'live',
          settlement_status: 'not_started',
          starts_at: startsAt.toISOString(),
          ends_at: endsAt.toISOString(),
          metadata: {
            network,
            escrow_status: 'secured',
            payment_status: 'awaiting_winner',
            settlement_status_label: 'auction_live',
            seller_created: true,
          },
        })
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      setPublishedAuctionId(data.id);
      setPublished(true);
    } catch (error: any) {
      console.error('Create listing error:', error);
      setPublishError(
        error?.message || 'Unable to publish auction. Please try again.'
      );
    } finally {
      setPublishing(false);
    }
  }

  if (published) {
    return (
      <main className="min-h-screen bg-[#020617] text-white px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-slate-900 border border-emerald-500/30 p-8 shadow-xl">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-20 w-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-5xl">
                {getCryptoIcon(asset)}
              </div>

              <div>
                <p className="text-sm text-emerald-400 font-semibold">
                  Listing Active
                </p>
                <h1 className="text-4xl font-bold">Your auction is now live</h1>
              </div>
            </div>

            <p className="text-slate-300 mb-6">
              Your escrow-backed auction has been created and is now visible on
              the CryptoBidX marketplace.
            </p>

            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {amount} {asset} Auction
              </h2>

              <p className="text-slate-400 mb-6">{description}</p>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
                  <p className="text-sm text-slate-500">Starting Price</p>
                  <p className="font-bold text-blue-400 mt-1">
                    {formatUsd(Number(startingPrice))}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
                  <p className="text-sm text-slate-500">Duration</p>
                  <p className="font-bold mt-1">{duration} hours</p>
                </div>

                <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
                  <p className="text-sm text-slate-500">Escrow</p>
                  <p className="font-bold text-emerald-400 mt-1">Secured</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/auction/${publishedAuctionId}`}
                className="rounded-xl bg-emerald-500 text-slate-950 px-6 py-3 font-bold hover:bg-emerald-400 transition text-center"
              >
                View Live Auction
              </Link>

              <Link
                href="/"
                className="rounded-xl bg-slate-800 border border-slate-700 px-6 py-3 font-semibold hover:border-emerald-400 transition text-center"
              >
                Back to Marketplace
              </Link>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl bg-slate-950 border border-slate-800 px-6 py-3 font-semibold hover:border-cyan-400 transition"
              >
                Create Another Listing
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <p className="text-sm text-cyan-400 font-semibold">
              Seller Listing Wizard
            </p>
            <h1 className="text-4xl font-bold">Create Crypto Auction</h1>
            <p className="text-slate-400 mt-2">
              Build an escrow-backed auction listing in four clear steps.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl bg-slate-800 border border-slate-700 px-5 py-3 font-semibold hover:border-cyan-400 transition"
          >
            Back Home
          </Link>
        </div>

        <div className="mb-8 rounded-2xl bg-slate-900 border border-slate-800 p-5">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              'Asset Details',
              'Auction Terms',
              'Escrow Check',
              'Review Listing',
            ].map((label, index) => {
              const stepNumber = index + 1;
              const active = step === stepNumber;
              const complete = step > stepNumber;

              return (
                <div
                  key={label}
                  className={`rounded-xl border p-4 ${
                    active
                      ? 'bg-cyan-500/10 border-cyan-500/30'
                      : complete
                      ? 'bg-emerald-500/10 border-emerald-500/20'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <p
                    className={`text-sm font-bold ${
                      active
                        ? 'text-cyan-400'
                        : complete
                        ? 'text-emerald-400'
                        : 'text-slate-500'
                    }`}
                  >
                    Step {stepNumber}
                  </p>
                  <p className="font-semibold mt-1">{label}</p>
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={createListing}>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
              {publishError && (
                <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300">
                  {publishError}
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold mb-2">Asset Details</h2>
                  <p className="text-slate-400 mb-8">
                    Tell buyers what crypto asset you are listing and which
                    network it will settle on.
                  </p>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm mb-2">Asset Symbol</label>
                      <select
                        value={asset}
                        onChange={(e) => setAsset(e.target.value)}
                        required
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 outline-none focus:border-cyan-400"
                      >
                        <option value="">Select asset</option>
                        <option value="BTC">Bitcoin (BTC)</option>
                        <option value="ETH">Ethereum (ETH)</option>
                        <option value="SOL">Solana (SOL)</option>
                        <option value="USDT">Tether (USDT)</option>
                        <option value="XRP">XRP</option>
                        <option value="BNB">BNB</option>
                        <option value="MATIC">Polygon (MATIC)</option>
                        <option value="DOGE">Dogecoin (DOGE)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm mb-2">
                        Amount to Sell
                      </label>
                      <input
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        type="number"
                        step="0.000001"
                        min="0.000001"
                        required
                        placeholder="0.5"
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2">
                        Settlement Network
                      </label>
                      <select
                        value={network}
                        onChange={(e) => setNetwork(e.target.value)}
                        required
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 outline-none focus:border-cyan-400"
                      >
                        <option value="">Select network</option>
                        <option value="Bitcoin">Bitcoin</option>
                        <option value="Ethereum">Ethereum</option>
                        <option value="Solana">Solana</option>
                        <option value="Tron">Tron</option>
                        <option value="Polygon">Polygon</option>
                        <option value="BNB Smart Chain">BNB Smart Chain</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold mb-2">Auction Terms</h2>
                  <p className="text-slate-400 mb-8">
                    Set the reserve price, duration and public description for
                    your listing.
                  </p>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm mb-2">
                        Starting Price / Reserve
                      </label>
                      <input
                        value={startingPrice}
                        onChange={(e) => setStartingPrice(e.target.value)}
                        type="number"
                        min="1"
                        required
                        placeholder="1000"
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2">
                        Auction Duration
                      </label>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 outline-none focus:border-cyan-400"
                      >
                        <option value="1">1 hour</option>
                        <option value="6">6 hours</option>
                        <option value="12">12 hours</option>
                        <option value="24">24 hours</option>
                        <option value="72">3 days</option>
                        <option value="168">7 days</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        placeholder="Describe the crypto being sold, settlement terms, network, wallet requirements, etc."
                        rows={6}
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Escrow Confirmation
                  </h2>
                  <p className="text-slate-400 mb-8">
                    In the live version, seller assets must be deposited into
                    platform escrow before an auction can go live.
                  </p>

                  <div className="rounded-2xl bg-cyan-500/10 border border-cyan-500/30 p-6 mb-6">
                    <h3 className="text-xl font-bold text-cyan-300 mb-4">
                      Demo Escrow Flow
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2">
                      {[
                        [
                          '01. Deposit',
                          'Seller sends crypto to a CryptoBidX escrow wallet.',
                        ],
                        [
                          '02. Lock',
                          'Asset remains locked while the auction is live.',
                        ],
                        [
                          '03. Payment',
                          'Winning bidder completes fiat or stablecoin payment.',
                        ],
                        [
                          '04. Release',
                          'Crypto is released after payment confirmation.',
                        ],
                      ].map(([title, text]) => (
                        <div
                          key={title}
                          className="rounded-xl bg-slate-950 border border-slate-800 p-4"
                        >
                          <p className="font-semibold text-cyan-400">{title}</p>
                          <p className="text-sm text-slate-400 mt-1">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <label className="flex gap-3 items-start rounded-2xl bg-slate-950 border border-slate-800 p-5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={escrowConfirmed}
                      onChange={(e) => setEscrowConfirmed(e.target.checked)}
                      className="mt-1"
                    />

                    <div>
                      <p className="font-semibold text-cyan-300">
                        I understand the escrow requirement
                      </p>
                      <p className="text-sm text-slate-300 mt-1">
                        For this front-end demo, escrow is simulated and marked
                        as secured. In production, this listing would not go
                        live until blockchain deposit confirmation is received.
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Review & Confirm Listing
                  </h2>
                  <p className="text-slate-400 mb-8">
                    Review all listing information below. Your auction will not
                    go live until you confirm and publish it.
                  </p>

                  <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6">
                    <h3 className="text-2xl font-bold mb-2">
                      {amount || '0'} {asset || 'ASSET'} Auction
                    </h3>

                    <p className="text-slate-400 mb-6">
                      {description || 'No description added yet.'}
                    </p>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
                        <p className="text-sm text-slate-500">Asset</p>
                        <p className="font-bold mt-1">{asset || 'ASSET'}</p>
                      </div>

                      <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
                        <p className="text-sm text-slate-500">Amount</p>
                        <p className="font-bold mt-1">
                          {amount || '0'} {asset || ''}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
                        <p className="text-sm text-slate-500">Network</p>
                        <p className="font-bold mt-1">
                          {network || 'Not selected'}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
                        <p className="text-sm text-slate-500">Starting Price</p>
                        <p className="font-bold text-blue-400 mt-1">
                          {formatUsd(Number(startingPrice))}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
                        <p className="text-sm text-slate-500">Duration</p>
                        <p className="font-bold mt-1">{duration} hours</p>
                      </div>

                      <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
                        <p className="text-sm text-slate-500">Escrow Status</p>
                        <p className="font-bold text-emerald-400 mt-1">
                          Secured / Confirmed
                        </p>
                      </div>
                    </div>

                    <label className="mt-6 flex gap-3 items-start rounded-2xl bg-slate-900 border border-emerald-500/20 p-5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={finalConfirmed}
                        onChange={(e) => setFinalConfirmed(e.target.checked)}
                        className="mt-1"
                      />

                      <div>
                        <p className="font-semibold text-emerald-400">
                          I confirm this listing is correct
                        </p>
                        <p className="text-sm text-slate-300 mt-1">
                          I have reviewed the asset, amount, network, reserve
                          price, duration, description and escrow status, and I
                          am happy to publish this auction.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              <div className="flex justify-between gap-4 mt-8">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 1 || publishing}
                  className="rounded-xl bg-slate-800 border border-slate-700 px-6 py-3 font-semibold hover:border-cyan-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Back
                </button>

                {step < totalSteps ? (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={
                      publishing ||
                      (step === 1 && !canGoStep2) ||
                      (step === 2 && !canGoStep3) ||
                      (step === 3 && !canGoStep4)
                    }
                    className="rounded-xl bg-cyan-500 text-slate-950 px-6 py-3 font-bold hover:bg-cyan-400 transition disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed"
                  >
                    {step === 3 ? 'Review Listing' : 'Continue'}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!canCreate || publishing}
                    className="rounded-xl bg-emerald-500 text-slate-950 px-6 py-3 font-bold hover:bg-emerald-400 transition disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed"
                  >
                    {publishing ? 'Publishing...' : 'Publish Auction'}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
                <h3 className="text-xl font-bold mb-4">Listing Preview</h3>

                <div className="rounded-xl bg-slate-950 border border-slate-800 p-5">
                  <div className="h-16 w-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-4xl mb-4">
                    {getCryptoIcon(asset)}
                  </div>

                  <p className="text-lg font-semibold">
                    {amount || '0.00'} {asset || 'ASSET'} Auction
                  </p>

                  <p className="text-sm text-slate-400 mt-1">
                    Starting at{' '}
                    {startingPrice ? formatUsd(Number(startingPrice)) : '$0'}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4 text-xs">
                    <span className="rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-slate-400">
                      {network || 'Network pending'}
                    </span>

                    <span
                      className={`rounded-full border px-3 py-1 ${
                        escrowConfirmed
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}
                    >
                      Escrow: {escrowConfirmed ? 'Secured' : 'Pending'}
                    </span>

                    <span
                      className={`rounded-full border px-3 py-1 ${
                        finalConfirmed
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}
                    >
                      Final Review: {finalConfirmed ? 'Confirmed' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
                <h3 className="text-xl font-bold mb-4">Publishing Checklist</h3>

                <div className="space-y-3 text-sm">
                  {[
                    ['Asset details', canGoStep2],
                    ['Auction terms', canGoStep3],
                    ['Escrow confirmation', escrowConfirmed],
                    ['Final review', finalConfirmed],
                  ].map(([label, complete]) => (
                    <div
                      key={String(label)}
                      className="flex justify-between gap-4 rounded-xl bg-slate-950 border border-slate-800 p-4"
                    >
                      <span className="text-slate-400">{label}</span>
                      <span
                        className={
                          complete ? 'text-emerald-400' : 'text-yellow-400'
                        }
                      >
                        {complete ? 'Complete' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-cyan-500/10 border border-cyan-500/20 p-6">
                <h3 className="text-xl font-bold text-cyan-300 mb-3">
                  Production Note
                </h3>
                <p className="text-sm text-slate-300">
                  In the live platform, this wizard will connect to wallet
                  deposit tracking, blockchain confirmations, Supabase auction
                  records and admin escrow approval before publication.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function SellPage() {
  return (
    <AuthGuard>
      <SellContent />
    </AuthGuard>
  );
}