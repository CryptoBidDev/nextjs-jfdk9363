export default function WhyPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white px-10 xl:px-16 py-10">
      <div className="max-w-6xl mx-auto">
        {/* HERO */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold mb-6">Why use CryptoBidX?</h1>

          <p className="text-slate-400 text-lg max-w-3xl">
            CryptoBidX is built to remove the biggest problems in crypto-to-fiat
            transactions: lack of trust, poor pricing transparency and
            counterparty risk. Instead of relying on blind agreements, the
            platform introduces structured auctions with controlled settlement.
          </p>
        </div>

        {/* CORE VALUE */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="text-xl font-bold text-emerald-400 mb-3">
              Better price discovery
            </h3>
            <p className="text-slate-400 text-sm">
              Auctions allow multiple buyers to compete in real time, often
              achieving stronger pricing than fixed OTC deals or rushed sales.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="text-xl font-bold text-blue-400 mb-3">
              Reduced counterparty risk
            </h3>
            <p className="text-slate-400 text-sm">
              The platform is structured to minimise reliance on trust by
              controlling when assets and payments move.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="text-xl font-bold text-purple-400 mb-3">
              Transparent market comparison
            </h3>
            <p className="text-slate-400 text-sm">
              Buyers and sellers can compare auction outcomes against live
              market pricing, giving context to every transaction.
            </p>
          </div>
        </div>

        {/* SELLERS */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Built for sellers</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              <p className="font-semibold text-emerald-400 mb-2">
                Controlled sale process
              </p>
              <p className="text-slate-400 text-sm">
                Set pricing expectations, run timed auctions and maintain
                visibility over demand.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              <p className="font-semibold text-emerald-400 mb-2">
                Escrow-backed structure
              </p>
              <p className="text-slate-400 text-sm">
                Assets are only released when payment conditions are satisfied.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              <p className="font-semibold text-emerald-400 mb-2">
                Better liquidity access
              </p>
              <p className="text-slate-400 text-sm">
                Reach multiple buyers instead of negotiating one-to-one deals.
              </p>
            </div>
          </div>
        </div>

        {/* BUYERS */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Built for buyers</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              <p className="font-semibold text-blue-400 mb-2">
                Competitive pricing
              </p>
              <p className="text-slate-400 text-sm">
                Bid dynamically and secure assets below or at market value.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              <p className="font-semibold text-blue-400 mb-2">
                Clear transaction flow
              </p>
              <p className="text-slate-400 text-sm">
                Know exactly when payment is required and when assets are
                released.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              <p className="font-semibold text-blue-400 mb-2">
                Reduced risk exposure
              </p>
              <p className="text-slate-400 text-sm">
                Structured settlement reduces the uncertainty of peer-to-peer
                trades.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl bg-blue-600 p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start using CryptoBidX today
          </h2>

          <p className="text-blue-100 mb-6">
            Whether you're buying or selling, CryptoBidX is designed to give you
            more control, more visibility and less risk.
          </p>

          <a
            href="/sell"
            className="inline-block rounded-xl bg-white text-blue-700 px-6 py-3 font-semibold"
          >
            Create Listing
          </a>
        </div>
      </div>
    </main>
  );
}
