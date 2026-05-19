'use client';

import Link from 'next/link';

const sections = [
  { id: 'overview', title: '1. Overview' },
  { id: 'auction-close', title: '2. Auction Close' },
  { id: 'buyer-payment', title: '3. Buyer Payment' },
  { id: 'seller-obligations', title: '4. Seller Obligations' },
  { id: 'escrow', title: '5. Escrow-Assisted Settlement' },
  { id: 'release', title: '6. Release Conditions' },
  { id: 'delays', title: '7. Delays & Reviews' },
  { id: 'failed-payment', title: '8. Failed Payment' },
  { id: 'cancellations', title: '9. Cancellations' },
  { id: 'disputes', title: '10. Disputes' },
  { id: 'finality', title: '11. Settlement Finality' },
  { id: 'limitations', title: '12. Limitations' },
];

export default function SettlementPolicyPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white px-6 py-10">
      <section className="max-w-7xl mx-auto">
        <div className="mb-10">
          <Link href="/" className="text-blue-400 hover:underline text-sm">
            ← Back to homepage
          </Link>

          <p className="mt-6 text-sm text-emerald-400 font-semibold">
            Legal Documentation
          </p>

          <h1 className="text-5xl font-bold mt-2">Settlement Policy</h1>

          <p className="text-slate-400 mt-4 max-w-4xl text-lg leading-8">
            This Settlement Policy explains how CryptoBidX coordinates auction
            completion, payment verification, escrow-assisted settlement and
            asset release between independent marketplace participants.
          </p>

          <p className="text-sm text-slate-500 mt-4">
            Last updated: May 2026
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="h-fit sticky top-6 rounded-3xl bg-slate-900 border border-slate-800 p-6">
            <h2 className="text-lg font-semibold mb-4">Contents</h2>

            <div className="space-y-3">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block text-sm text-slate-400 hover:text-white transition"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </aside>

          <div className="space-y-10">
            <section
              id="overview"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">1. Overview</h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  CryptoBidX provides marketplace technology designed to support
                  structured auction settlement between buyers and sellers.
                </p>

                <p>
                  The platform may coordinate auction status, payment status,
                  settlement status and release workflows, but does not
                  guarantee completion of any transaction.
                </p>

                <p>
                  CryptoBidX is not a bank, exchange, broker, investment adviser
                  or financial custodian.
                </p>

                <p>
                  Settlement may depend on user cooperation, third-party payment
                  providers, escrow partners, blockchain network conditions,
                  compliance reviews and operational checks.
                </p>
              </div>
            </section>

            <section
              id="auction-close"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">2. Auction Close</h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  When an auction timer expires, the highest valid bid may be
                  treated as the winning bid, subject to platform rules,
                  verification and compliance review.
                </p>

                <p>
                  If no valid bid exists at auction close, the auction may end
                  without a winner and no payment obligation will arise.
                </p>

                <p>
                  CryptoBidX may pause or review auction results where fraud,
                  abuse, technical issues, manipulation or compliance concerns
                  are identified.
                </p>
              </div>
            </section>

            <section
              id="buyer-payment"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">3. Buyer Payment</h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  A winning buyer may be required to complete payment within the
                  timeframe specified by the platform or settlement instructions.
                </p>

                <p>
                  Payment may be handled through approved payment channels,
                  regulated payment providers, stablecoin rails or other
                  settlement methods supported by CryptoBidX.
                </p>

                <p>
                  Buyers must follow payment instructions accurately and must not
                  attempt to bypass platform settlement procedures.
                </p>

                <p>
                  Failure to complete payment may result in cancellation,
                  account restrictions, loss of access to marketplace features or
                  other enforcement action.
                </p>
              </div>
            </section>

            <section
              id="seller-obligations"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                4. Seller Obligations
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Sellers must ensure they lawfully own or control the crypto
                  assets listed for auction.
                </p>

                <p>
                  Sellers may be required to provide wallet confirmation,
                  blockchain transaction evidence, escrow deposit confirmation or
                  other documentation before settlement can proceed.
                </p>

                <p>
                  Sellers must not list assets that are stolen, restricted,
                  sanctioned, frozen, encumbered or otherwise unavailable for
                  transfer.
                </p>

                <p>
                  Failure to cooperate with settlement requirements may result in
                  listing cancellation, account restrictions or dispute review.
                </p>
              </div>
            </section>

            <section
              id="escrow"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                5. Escrow-Assisted Settlement
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  CryptoBidX may use escrow-assisted workflows to reduce
                  counterparty risk between buyers and sellers.
                </p>

                <p>
                  Escrow-assisted settlement may involve confirmation that seller
                  assets are secured or represented as secured before buyer
                  payment is finalised.
                </p>

                <p>
                  Escrow arrangements may be provided directly, through
                  integrated wallet infrastructure, or through approved
                  third-party escrow partners, depending on platform structure
                  and jurisdictional requirements.
                </p>

                <p>
                  Escrow-assisted settlement reduces certain risks but does not
                  eliminate fraud, compliance, technical, wallet, payment or
                  blockchain risks.
                </p>
              </div>
            </section>

            <section
              id="release"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">6. Release Conditions</h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Crypto assets should only be released after the required
                  settlement conditions have been satisfied.
                </p>

                <p>
                  Release conditions may include payment confirmation, compliance
                  clearance, fraud review, wallet verification and any additional
                  checks required by the platform.
                </p>

                <p>
                  CryptoBidX may delay release where payment confirmation is
                  incomplete, disputed, reversed, suspicious or otherwise
                  unreliable.
                </p>

                <p>
                  Users acknowledge that release timing may vary depending on
                  payment provider processing, blockchain confirmations and
                  operational review.
                </p>
              </div>
            </section>

            <section
              id="delays"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">7. Delays & Reviews</h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Settlement may be delayed due to compliance checks, technical
                  issues, blockchain congestion, banking delays, provider
                  outages, fraud concerns or incomplete user information.
                </p>

                <p>
                  CryptoBidX may request additional information from buyers or
                  sellers before allowing settlement to continue.
                </p>

                <p>
                  Users must cooperate promptly with reasonable information
                  requests relating to settlement, fraud prevention, compliance
                  review or dispute resolution.
                </p>
              </div>
            </section>

            <section
              id="failed-payment"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">8. Failed Payment</h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  If a winning buyer fails to complete payment within the
                  required timeframe, CryptoBidX may cancel the settlement,
                  reopen the auction, offer the asset to another bidder or take
                  other appropriate action.
                </p>

                <p>
                  Failed payment may result in account restrictions, reduced
                  trust score, bidding limitations or permanent suspension.
                </p>

                <p>
                  CryptoBidX may retain records of failed payment activity for
                  fraud prevention, compliance and marketplace integrity
                  purposes.
                </p>
              </div>
            </section>

            <section
              id="cancellations"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">9. Cancellations</h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Sellers may cancel listings before bids are placed, subject to
                  platform rules and audit logging.
                </p>

                <p>
                  Where bids already exist, seller cancellation may require
                  review and approval to protect bidder trust and marketplace
                  integrity.
                </p>

                <p>
                  CryptoBidX may cancel or suspend auctions where fraud,
                  manipulation, incorrect listing information, technical errors
                  or compliance concerns are identified.
                </p>

                <p>
                  Cancellation reasons and related notes may be retained for
                  support, compliance, dispute and marketplace analytics
                  purposes.
                </p>
              </div>
            </section>

            <section
              id="disputes"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">10. Disputes</h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Disputes may arise from payment failure, alleged asset
                  misrepresentation, wallet transfer issues, delayed release,
                  compliance holds or counterparty non-cooperation.
                </p>

                <p>
                  CryptoBidX may review available records, auction data,
                  blockchain evidence, payment information and user
                  communications when evaluating disputes.
                </p>

                <p>
                  CryptoBidX may pause settlement activity while a dispute is
                  under review.
                </p>

                <p>
                  The platform does not guarantee a particular dispute outcome
                  and may refer users to external legal, regulatory or payment
                  processes where appropriate.
                </p>
              </div>
            </section>

            <section
              id="finality"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                11. Settlement Finality
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Blockchain transfers may be irreversible once broadcast and
                  confirmed on the relevant network.
                </p>

                <p>
                  Users must carefully verify wallet addresses, network
                  compatibility and settlement details before any release occurs.
                </p>

                <p>
                  CryptoBidX is not responsible for losses caused by incorrect
                  wallet addresses, unsupported networks, user error or external
                  blockchain failures.
                </p>
              </div>
            </section>

            <section
              id="limitations"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">12. Limitations</h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  CryptoBidX does not guarantee settlement completion, payment
                  success, asset value, counterparty performance or dispute-free
                  transactions.
                </p>

                <p>
                  Users participate in marketplace activity at their own risk and
                  remain responsible for evaluating transaction suitability.
                </p>

                <p>
                  This Settlement Policy should be read alongside the Terms of
                  Service, Risk Disclosure, Privacy Policy and Escrow Standards.
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}