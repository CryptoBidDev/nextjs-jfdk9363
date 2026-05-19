export default function TrustPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white px-10 xl:px-16 py-10">
      <div className="max-w-6xl mx-auto">
        {/* HERO */}
        <div className="mb-16">
          <p className="text-sm text-emerald-400 font-semibold mb-3">
            Trust & Security
          </p>

          <h1 className="text-5xl font-bold mb-6">
            Designed to reduce counterparty risk.
          </h1>

          <p className="text-slate-400 text-lg max-w-3xl">
            CryptoBidX is structured to minimise reliance on trust between
            buyers and sellers. Every transaction follows a controlled process
            with clear separation between bidding, payment and asset release.
          </p>
        </div>

        {/* CORE TRUST MODEL */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="text-xl font-bold text-emerald-400 mb-3">
              Escrow-first design
            </h3>
            <p className="text-slate-400 text-sm">
              Assets are represented as secured before the auction is active,
              preventing sellers from listing assets they cannot deliver.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="text-xl font-bold text-blue-400 mb-3">
              Payment verification
            </h3>
            <p className="text-slate-400 text-sm">
              The system ensures that payment is confirmed before any asset
              release process begins.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="text-xl font-bold text-purple-400 mb-3">
              Controlled settlement
            </h3>
            <p className="text-slate-400 text-sm">
              Transactions move through defined states, reducing ambiguity and
              limiting the risk of failed or disputed trades.
            </p>
          </div>
        </div>

        {/* PROCESS FLOW */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8">Transaction control flow</h2>

          <div className="grid md:grid-cols-5 gap-5">
            <div className="rounded-2xl bg-[#020617] border border-slate-800 p-5">
              <p className="text-emerald-400 font-bold mb-2">01. Listing</p>
              <p className="text-sm text-slate-400">
                Seller creates a listing with asset and pricing details.
              </p>
            </div>

            <div className="rounded-2xl bg-[#020617] border border-slate-800 p-5">
              <p className="text-emerald-400 font-bold mb-2">02. Escrow</p>
              <p className="text-sm text-slate-400">
                Asset is verified or deposited before the auction goes live.
              </p>
            </div>

            <div className="rounded-2xl bg-[#020617] border border-slate-800 p-5">
              <p className="text-emerald-400 font-bold mb-2">03. Auction</p>
              <p className="text-sm text-slate-400">
                Buyers compete with bids while the timer is active.
              </p>
            </div>

            <div className="rounded-2xl bg-[#020617] border border-slate-800 p-5">
              <p className="text-emerald-400 font-bold mb-2">04. Payment</p>
              <p className="text-sm text-slate-400">
                Winning bidder completes payment after auction close.
              </p>
            </div>

            <div className="rounded-2xl bg-[#020617] border border-slate-800 p-5">
              <p className="text-emerald-400 font-bold mb-2">05. Release</p>
              <p className="text-sm text-slate-400">
                Asset is released only after payment confirmation.
              </p>
            </div>
          </div>
        </div>

        {/* RISK REDUCTION */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8">
            <h2 className="text-3xl font-bold mb-5">Buyer protection</h2>

            <div className="space-y-5">
              <div>
                <p className="font-semibold text-blue-400">
                  No upfront payment during bidding
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Payment is only required after you win the auction.
                </p>
              </div>

              <div>
                <p className="font-semibold text-blue-400">
                  Verified asset availability
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Listings are structured around secured or verified assets.
                </p>
              </div>

              <div>
                <p className="font-semibold text-blue-400">
                  Clear settlement stages
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  You always know when payment is required and when assets move.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8">
            <h2 className="text-3xl font-bold mb-5">Seller protection</h2>

            <div className="space-y-5">
              <div>
                <p className="font-semibold text-emerald-400">
                  Payment before release
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Assets are not released until payment is confirmed.
                </p>
              </div>

              <div>
                <p className="font-semibold text-emerald-400">
                  Structured auction rules
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  The highest valid bidder is clearly defined at close.
                </p>
              </div>

              <div>
                <p className="font-semibold text-emerald-400">
                  Reduced negotiation risk
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Auctions replace informal deals with transparent competition.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="rounded-3xl bg-emerald-600 p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Built to remove blind trust from crypto transactions.
          </h2>

          <p className="text-emerald-50 mb-6">
            CryptoBidX introduces structure, visibility and control into every
            transaction stage.
          </p>

          <a
            href="/how-it-works"
            className="inline-block rounded-xl bg-white text-emerald-700 px-6 py-3 font-semibold"
          >
            Learn How It Works
          </a>
        </div>
      </div>
    </main>
  );
}
