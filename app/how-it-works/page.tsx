'use client';

import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-12">
      <section className="max-w-[1200px] mx-auto">
        <div className="mb-12">
          <Link href="/" className="text-blue-400 hover:underline">
            ← Back to Home
          </Link>

          <p className="text-sm text-cyan-400 font-semibold mt-8">
            CryptoBidX Trust Model
          </p>

          <h1 className="text-5xl font-bold mt-3 mb-4">How CryptoBidX Works</h1>

          <p className="text-slate-400 max-w-3xl text-lg">
            CryptoBidX is a marketplace for converting cryptocurrency into fiat
            through transparent, timed auctions. Sellers list crypto, buyers bid
            in USD, and settlement is completed only after regulated payment
            confirmation.
          </p>
        </div>

        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 mb-12">
          <p className="text-sm text-blue-400 font-semibold mb-2">
            Marketplace, not exchange
          </p>

          <h2 className="text-3xl font-bold mb-4">
            The eBay-style auction layer for crypto-to-fiat conversion.
          </h2>

          <p className="text-slate-400 mb-6">
            CryptoBidX is not an exchange, broker, token issuer, order book or
            liquidity pool. It coordinates buyers and sellers through auctions,
            while payment and settlement happen through regulated and
            trust-minimised systems.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
              <p className="text-emerald-400 font-bold mb-2">No pooled funds</p>
              <p className="text-sm text-slate-400">
                CryptoBidX does not hold buyer fiat or operate as a money
                transmitter.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
              <p className="text-blue-400 font-bold mb-2">No market making</p>
              <p className="text-sm text-slate-400">
                Buyers compete transparently. The market sets the clearing
                price.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
              <p className="text-yellow-400 font-bold mb-2">
                No platform custody
              </p>
              <p className="text-sm text-slate-400">
                The platform is designed so it cannot release assets
                unilaterally.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The transaction flow</h2>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Seller Lists Crypto',
                desc: 'A seller creates a timed auction for a crypto asset they want to convert into fiat.',
              },
              {
                step: '02',
                title: 'Crypto Enters Escrow',
                desc: 'The seller deposits crypto into a trust-minimised escrow structure that CryptoBidX cannot control alone.',
              },
              {
                step: '03',
                title: 'Buyers Bid in USD',
                desc: 'Buyers compete transparently through fiat-based bids, creating price discovery.',
              },
              {
                step: '04',
                title: 'Highest Bid Wins',
                desc: 'When the auction timer ends, the highest valid bidder becomes the provisional winner.',
              },
              {
                step: '05',
                title: 'Payment Confirmed',
                desc: 'The buyer pays through a regulated payment provider. The platform acts only after verified settlement confirmation.',
              },
              {
                step: '06',
                title: 'Crypto Released',
                desc: 'Once payment is confirmed, the crypto is released to the buyer and the transaction is completed.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl bg-slate-900 border border-slate-800 p-6 hover:border-blue-500 transition"
              >
                <p className="text-blue-400 font-bold mb-2">{item.step}</p>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 mb-16">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8">
            <h2 className="text-2xl font-bold mb-4 text-emerald-400">
              Why sellers use it
            </h2>

            <p className="text-slate-400 mb-6">
              Traditional OTC selling can be opaque and loss-making. CryptoBidX
              introduces buyer competition, meaning sellers are not forced to
              accept lowball private quotes.
            </p>

            <div className="space-y-3 text-sm text-slate-300">
              <p>• Timed auctions create price discovery</p>
              <p>• More buyer competition can improve sale value</p>
              <p>• Settlement only proceeds after payment confirmation</p>
              <p>• No need to rely on private OTC trust</p>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">
              Why buyers trust it
            </h2>

            <p className="text-slate-400 mb-6">
              Buyers get a transparent auction process instead of opaque
              negotiation. They only receive the crypto after paying through a
              regulated payment channel.
            </p>

            <div className="space-y-3 text-sm text-slate-300">
              <p>• Clear auction rules</p>
              <p>• Visible winning bid logic</p>
              <p>• Regulated payment provider confirmation</p>
              <p>• Asset release only after verified settlement</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Why the trust problem is solved
          </h2>

          <p className="text-slate-400 mb-6">
            In traditional P2P or OTC trades, the core problem is always who
            moves first. CryptoBidX removes that negotiation by separating
            escrow, payment confirmation and asset release.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
              <p className="text-emerald-400 font-bold mb-2">
                Seller protected
              </p>
              <p className="text-sm text-slate-400">
                The seller’s asset only moves once payment settlement has been
                confirmed.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
              <p className="text-blue-400 font-bold mb-2">Buyer protected</p>
              <p className="text-sm text-slate-400">
                The buyer receives the crypto only after completing payment
                through a regulated channel.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
              <p className="text-purple-400 font-bold mb-2">Platform limited</p>
              <p className="text-sm text-slate-400">
                CryptoBidX coordinates the transaction but is not designed to
                control either side of the value transfer alone.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-blue-600 p-8 text-center">
          <h2 className="text-3xl font-bold mb-3">
            Transparent auctions. Regulated payment. Trust-minimised settlement.
          </h2>

          <p className="text-blue-100 mb-6 max-w-3xl mx-auto">
            CryptoBidX creates better seller outcomes, safer buyer settlement
            and a marketplace model designed to scale without taking custody of
            user funds.
          </p>

          <Link
            href="/"
            className="inline-block rounded-xl bg-white text-blue-700 px-6 py-3 font-semibold"
          >
            Browse Auctions
          </Link>
        </div>
      </section>
    </main>
  );
}
