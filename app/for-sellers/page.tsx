export default function ForSellersPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white px-10 xl:px-16 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="text-sm text-emerald-400 font-semibold mb-3">
            For Sellers
          </p>

          <h1 className="text-5xl font-bold mb-6">
            Sell crypto through competitive, escrow-backed auctions.
          </h1>

          <p className="text-slate-400 text-lg max-w-3xl">
            CryptoBidX gives sellers a structured way to convert crypto into
            fiat value without relying on risky private deals, rushed OTC
            pricing or blind counterparty trust.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="text-xl font-bold text-emerald-400 mb-3">
              Set your reserve
            </h3>
            <p className="text-slate-400 text-sm">
              Choose the minimum starting price you are willing to accept before
              your auction goes live.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="text-xl font-bold text-blue-400 mb-3">
              Let buyers compete
            </h3>
            <p className="text-slate-400 text-sm">
              Multiple bidders can compete for your asset, creating transparent
              price discovery instead of one-to-one negotiation.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="text-xl font-bold text-purple-400 mb-3">
              Release after payment
            </h3>
            <p className="text-slate-400 text-sm">
              The asset release flow is structured around confirmed payment and
              controlled settlement.
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8">Seller auction flow</h2>

          <div className="grid md:grid-cols-4 gap-5">
            <div className="rounded-2xl bg-[#020617] border border-slate-800 p-5">
              <p className="text-emerald-400 font-bold mb-2">01. List</p>
              <p className="text-sm text-slate-400">
                Enter the asset, quantity, network, starting price and auction
                duration.
              </p>
            </div>

            <div className="rounded-2xl bg-[#020617] border border-slate-800 p-5">
              <p className="text-emerald-400 font-bold mb-2">02. Secure</p>
              <p className="text-sm text-slate-400">
                In production, the asset is deposited or verified before the
                auction is published.
              </p>
            </div>

            <div className="rounded-2xl bg-[#020617] border border-slate-800 p-5">
              <p className="text-emerald-400 font-bold mb-2">03. Auction</p>
              <p className="text-sm text-slate-400">
                Buyers bid in fiat value while the platform tracks the highest
                valid bid.
              </p>
            </div>

            <div className="rounded-2xl bg-[#020617] border border-slate-800 p-5">
              <p className="text-emerald-400 font-bold mb-2">04. Settle</p>
              <p className="text-sm text-slate-400">
                Once payment is confirmed, the asset can be released through the
                settlement process.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8">
            <h2 className="text-3xl font-bold mb-5">Why sellers benefit</h2>

            <div className="space-y-5">
              <div>
                <p className="font-semibold text-emerald-400">
                  Avoid underpriced private deals
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Auctions allow the market to compete for your asset instead of
                  relying on a single buyer's offer.
                </p>
              </div>

              <div>
                <p className="font-semibold text-emerald-400">
                  Keep a clear audit trail
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Listing details, bid history and settlement status are visible
                  throughout the transaction.
                </p>
              </div>

              <div>
                <p className="font-semibold text-emerald-400">
                  Reduce payment uncertainty
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  The platform separates bidding, payment confirmation and asset
                  release into clear stages.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8">
            <h2 className="text-3xl font-bold mb-5">Seller controls</h2>

            <div className="grid gap-4">
              <div className="rounded-2xl bg-[#020617] border border-slate-800 p-5">
                <p className="font-semibold text-slate-200">Reserve price</p>
                <p className="text-sm text-slate-400 mt-1">
                  Set the minimum auction starting value.
                </p>
              </div>

              <div className="rounded-2xl bg-[#020617] border border-slate-800 p-5">
                <p className="font-semibold text-slate-200">Auction duration</p>
                <p className="text-sm text-slate-400 mt-1">
                  Choose how long buyers can compete.
                </p>
              </div>

              <div className="rounded-2xl bg-[#020617] border border-slate-800 p-5">
                <p className="font-semibold text-slate-200">Network details</p>
                <p className="text-sm text-slate-400 mt-1">
                  Specify the asset and settlement network clearly.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-emerald-600 p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to list your crypto?
          </h2>

          <p className="text-emerald-50 mb-6">
            Create an auction, set your reserve and let buyers compete.
          </p>

          <a
            href="/sell"
            className="inline-block rounded-xl bg-white text-emerald-700 px-6 py-3 font-semibold"
          >
            Create Seller Listing
          </a>
        </div>
      </div>
    </main>
  );
}
