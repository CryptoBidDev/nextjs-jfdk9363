'use client';

import Link from 'next/link';

const sections = [
  {
    id: 'overview',
    title: '1. Overview',
  },
  {
    id: 'eligibility',
    title: '2. Eligibility',
  },
  {
    id: 'marketplace-role',
    title: '3. Marketplace Role',
  },
  {
    id: 'auction-rules',
    title: '4. Auction Rules',
  },
  {
    id: 'seller-obligations',
    title: '5. Seller Obligations',
  },
  {
    id: 'buyer-obligations',
    title: '6. Buyer Obligations',
  },
  {
    id: 'settlement',
    title: '7. Settlement & Escrow',
  },
  {
    id: 'risk',
    title: '8. Risk Disclosure',
  },
  {
    id: 'compliance',
    title: '9. Compliance & AML',
  },
  {
    id: 'liability',
    title: '10. Limitation of Liability',
  },
  {
    id: 'termination',
    title: '11. Suspension & Termination',
  },
  {
    id: 'jurisdiction',
    title: '12. Governing Law',
  },
];

export default function TermsPage() {
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

          <h1 className="text-5xl font-bold mt-2">Terms of Service</h1>

          <p className="text-slate-400 mt-4 max-w-4xl text-lg leading-8">
            These Terms of Service govern access to and use of the CryptoBidX
            marketplace platform, including auction participation, listing
            management, settlement coordination and related platform services.
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
                  CryptoBidX operates a technology platform designed to
                  facilitate crypto asset auctions between independent buyers and
                  sellers.
                </p>

                <p>
                  The platform is intended to provide transparent price
                  discovery, structured settlement coordination and escrow-based
                  transaction workflows.
                </p>

                <p>
                  CryptoBidX is not a cryptocurrency exchange, broker-dealer,
                  investment adviser, financial institution or financial
                  custodian.
                </p>

                <p>
                  Users acknowledge that CryptoBidX does not guarantee
                  transaction completion, asset value, liquidity, market
                  performance or counterparty conduct.
                </p>
              </div>
            </section>

            <section
              id="eligibility"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">2. Eligibility</h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Users must be at least 18 years of age and legally capable of
                  entering binding agreements within their jurisdiction.
                </p>

                <p>
                  Users are solely responsible for ensuring their use of the
                  platform complies with applicable local laws, regulations and
                  sanctions requirements.
                </p>

                <p>
                  CryptoBidX reserves the right to restrict or prohibit access
                  from certain jurisdictions or regions at its sole discretion.
                </p>
              </div>
            </section>

            <section
              id="marketplace-role"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                3. Marketplace Role
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  CryptoBidX provides marketplace infrastructure and settlement
                  coordination tools only.
                </p>

                <p>
                  The platform does not take ownership of listed assets and does
                  not guarantee settlement between users.
                </p>

                <p>
                  Certain settlement workflows may involve regulated third-party
                  payment providers, escrow partners or compliance providers.
                </p>

                <p>
                  Users acknowledge that CryptoBidX does not provide financial,
                  investment, legal or tax advice.
                </p>
              </div>
            </section>

            <section
              id="auction-rules"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                4. Auction Rules
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Sellers may create listings specifying asset details, reserve
                  pricing and auction duration.
                </p>

                <p>
                  Buyers may place bids during the active auction period.
                </p>

                <p>
                  By placing a bid, users acknowledge that bids may become
                  binding obligations upon auction completion.
                </p>

                <p>
                  CryptoBidX reserves the right to suspend, cancel or remove
                  auctions where fraud, abuse, compliance concerns or technical
                  issues are identified.
                </p>
              </div>
            </section>

            <section
              id="seller-obligations"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                5. Seller Obligations
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Sellers represent that they lawfully own or control the assets
                  listed on the platform.
                </p>

                <p>
                  Sellers must not list stolen, restricted, sanctioned or
                  illegally obtained assets.
                </p>

                <p>
                  Sellers may be required to complete identity verification,
                  wallet verification or compliance checks before settlement.
                </p>

                <p>
                  Sellers are responsible for the accuracy of listing details and
                  asset representations.
                </p>
              </div>
            </section>

            <section
              id="buyer-obligations"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                6. Buyer Obligations
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Buyers are responsible for ensuring sufficient funds are
                  available to complete settlement obligations.
                </p>

                <p>
                  Buyers acknowledge that cryptocurrency prices may be highly
                  volatile.
                </p>

                <p>
                  Failure to complete settlement after winning an auction may
                  result in account restrictions, cancellation penalties or
                  permanent suspension.
                </p>
              </div>
            </section>

            <section
              id="settlement"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                7. Settlement & Escrow
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  CryptoBidX may coordinate escrow-assisted settlement workflows
                  between parties.
                </p>

                <p>
                  The platform may rely on third-party infrastructure providers
                  for payment verification, escrow coordination or compliance
                  validation.
                </p>

                <p>
                  Settlement completion may be delayed, suspended or cancelled
                  where fraud, sanctions, compliance or technical concerns are
                  identified.
                </p>

                <p>
                  CryptoBidX does not guarantee uninterrupted service,
                  transaction finality or dispute-free settlement outcomes.
                </p>
              </div>
            </section>

            <section
              id="risk"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                8. Risk Disclosure
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Cryptocurrency transactions involve substantial financial,
                  regulatory and technological risk.
                </p>

                <p>
                  Asset prices may fluctuate significantly and users may lose
                  part or all of their funds.
                </p>

                <p>
                  Users acknowledge risks including wallet compromise, network
                  failure, regulatory action, counterparty failure and market
                  volatility.
                </p>

                <p>
                  Users are solely responsible for evaluating transaction risks
                  before participating in auctions.
                </p>
              </div>
            </section>

            <section
              id="compliance"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                9. Compliance & AML
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  CryptoBidX reserves the right to conduct identity verification,
                  sanctions screening and anti-money laundering reviews.
                </p>

                <p>
                  Users may be required to provide documentation, source of funds
                  evidence or transaction information.
                </p>

                <p>
                  The platform may cooperate with law enforcement, regulators or
                  compliance authorities where legally required.
                </p>
              </div>
            </section>

            <section
              id="liability"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                10. Limitation of Liability
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  To the maximum extent permitted by law, CryptoBidX shall not
                  be liable for indirect, incidental, consequential or punitive
                  damages arising from platform use.
                </p>

                <p>
                  Users acknowledge that use of the platform is at their own
                  risk.
                </p>

                <p>
                  CryptoBidX does not guarantee uninterrupted access, transaction
                  execution or settlement completion.
                </p>
              </div>
            </section>

            <section
              id="termination"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                11. Suspension & Termination
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  CryptoBidX may suspend, restrict or terminate user access at
                  any time where fraud, abuse, sanctions concerns or violations
                  of these Terms are identified.
                </p>

                <p>
                  The platform reserves discretion to remove listings, restrict
                  auctions or suspend settlement activity.
                </p>
              </div>
            </section>

            <section
              id="jurisdiction"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                12. Governing Law
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  These Terms shall be governed in accordance with applicable
                  laws determined by the platform operating entity and governing
                  jurisdiction.
                </p>

                <p>
                  CryptoBidX reserves the right to designate governing law,
                  arbitration forums or dispute procedures in accordance with its
                  operational structure.
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}