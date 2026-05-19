export default function ForBuyersPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white px-10 xl:px-16 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="text-sm text-blue-400 font-semibold mb-3">For Buyers</p>

          <h1 className="text-5xl font-bold mb-6">
            Bid on crypto lots with live market context.
          </h1>

          <p className="text-slate-400 text-lg max-w-3xl">
            CryptoBidX gives buyers a structured way to compete for crypto
            assets, compare bids against live market pricing and only move into
            payment after winning an auction.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="text-xl font-bold text-blue-400 mb-3">
              See the market value
            </h3>
            <p className="text-slate-400 text-sm">
              Auction pages show a live spot-price comparison so you can see
              whether a current bid is below, near or above market value.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="text-xl font-bold text-emerald-400 mb-3">
              Bid competitively
            </h3>
            <p className="text-slate-400 text-sm">
              Place fiat-based bids and let the auction decide the final market
              clearing price.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="text-xl font-bold text-purple-400 mb-3">
              Pay after winning
            </h3>
            <p className="text-slate-400 text-sm">
              In the current flow, payment is completed after the auction ends
              and you are confirmed as the winner.
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8">Buyer auction flow</h2>

          <div className="grid md:grid-cols-4 gap-5">
            <div className="rounded-2xl bg-[#020617] border border-slate-800 p-5">
              <p className="text-blue-400 font-bold mb-2">01. Browse</p>
              <p className="text-sm text-slate-400">
                Review live auctions, seller listings, asset types and current
                highest bids.
              </p>
            </div>

            <div className="rounded-2xl bg-[#020617] border border-slate-800 p-5">
              <p className="text-blue-400 font-bold mb-2">02. Compare</p>
              <p className="text-sm text-slate-400">
                Use the live market-price comparison to understand the current
                auction value.
              </p>
            </div>

            <div className="rounded-2xl bg-[#020617] border border-slate-800 p-5">
              <p className="text-blue-400 font-bold mb-2">03. Bid</p>
              <p className="text-sm text-slate-400">
                Submit a fiat-based bid while the timer is live. The highest
                valid bid leads.
              </p>
            </div>

            <div className="rounded-2xl bg-[#020617] border border-slate-800 p-5">
              <p className="text-blue-400 font-bold mb-2">04. Settle</p>
              <p className="text-sm text-slate-400">
                If you win, complete payment so the asset release process can
                begin.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8">
            <h2 className="text-3xl font-bold mb-5">Why buyers benefit</h2>

            <div className="space-y-5">
              <div>
                <p className="font-semibold text-blue-400">
                  Potential below-market entries
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Auctions may create opportunities to bid below live market
                  value, depending on seller reserve and bidder demand.
                </p>
              </div>

              <div>
                <p className="font-semibold text-blue-400">
                  Transparent bidding history
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  See the active highest bid and previous bid movement before
                  deciding whether to compete.
                </p>
              </div>

              <div>
                <p className="font-semibold text-blue-400">
                  Clear payment trigger
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Payment is tied to auction outcome rather than being required
                  from every bidder upfront.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8">
            <h2 className="text-3xl font-bold mb-5">Buyer controls</h2>

            <div className="grid gap-4">
              <div className="rounded-2xl bg-[#020617] border border-slate-800 p-5">
                <p className="font-semibold text-slate-200">
                  Preferred bid currency
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Bid in supported fiat currencies while values are compared
                  internally on a USD basis.
                </p>
              </div>

              <div className="rounded-2xl bg-[#020617] border border-slate-800 p-5">
                <p className="font-semibold text-slate-200">
                  Market saving view
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  View the estimated saving or premium against current spot
                  price on the auction page.
                </p>
              </div>

              <div className="rounded-2xl bg-[#020617] border border-slate-800 p-5">
                <p className="font-semibold text-slate-200">
                  Settlement visibility
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Track auction, payment and release status through the
                  transaction flow.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-blue-600 p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Browse live auction opportunities.
          </h2>

          <p className="text-blue-100 mb-6">
            Compare bids against market value and compete only where the numbers
            make sense.
          </p>

          <a
            href="/#auctions"
            className="inline-block rounded-xl bg-white text-blue-700 px-6 py-3 font-semibold"
          >
            View Auctions
          </a>
        </div>
      </div>
    </main>
  );
}
