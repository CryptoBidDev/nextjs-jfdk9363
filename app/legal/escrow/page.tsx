'use client';

import Link from 'next/link';

const sections = [
  { id: 'overview', title: '1. Overview' },
  { id: 'meaning', title: '2. What Escrow Means' },
  { id: 'not-custody', title: '3. Non-Custodial Positioning' },
  { id: 'seller-assets', title: '4. Seller Asset Requirements' },
  { id: 'buyer-payment', title: '5. Buyer Payment Verification' },
  { id: 'release', title: '6. Release Conditions' },
  { id: 'third-parties', title: '7. Third-Party Providers' },
  { id: 'limitations', title: '8. Escrow Limitations' },
  { id: 'fraud', title: '9. Fraud & Compliance Holds' },
  { id: 'disputes', title: '10. Disputes' },
  { id: 'changes', title: '11. Changes to Escrow Standards' },
];

export default function EscrowStandardsPage() {
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

          <h1 className="text-5xl font-bold mt-2">Escrow Standards</h1>

          <p className="text-slate-400 mt-4 max-w-4xl text-lg leading-8">
            These Escrow Standards explain how CryptoBidX describes,
            coordinates and applies escrow-assisted settlement workflows within
            the marketplace.
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
                  CryptoBidX uses the term escrow-backed or escrow-assisted to
                  describe settlement workflows designed to reduce direct
                  counterparty risk between buyers and sellers.
                </p>

                <p>
                  Escrow-assisted settlement is intended to help ensure that
                  buyer payment and seller asset release occur through a
                  controlled process.
                </p>

                <p>
                  These standards do not create any guarantee of settlement,
                  asset value, buyer payment, seller performance or dispute-free
                  transaction completion.
                </p>
              </div>
            </section>

            <section
              id="meaning"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                2. What Escrow Means
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  On CryptoBidX, escrow-assisted settlement means that the
                  platform may require evidence that seller assets are secured,
                  locked, verified or otherwise available before buyer payment
                  is treated as complete.
                </p>

                <p>
                  Escrow may involve platform-controlled workflows, integrated
                  wallet infrastructure, smart contract tools, manual review
                  processes or approved third-party escrow partners.
                </p>

                <p>
                  The exact escrow method may vary depending on asset type,
                  jurisdiction, transaction size, compliance requirements and
                  operational availability.
                </p>
              </div>
            </section>

            <section
              id="not-custody"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                3. Non-Custodial Positioning
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Unless expressly stated otherwise in a specific transaction
                  workflow, CryptoBidX is a marketplace technology platform and
                  does not act as a bank, exchange, broker, investment adviser
                  or regulated financial custodian.
                </p>

                <p>
                  CryptoBidX does not provide insured custody, deposit
                  protection, banking protections or investment protections.
                </p>

                <p>
                  Any reference to escrow should be understood as a transaction
                  coordination and risk-reduction mechanism, not as a guarantee
                  that funds or assets are protected from all forms of loss.
                </p>
              </div>
            </section>

            <section
              id="seller-assets"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                4. Seller Asset Requirements
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Sellers may be required to demonstrate that listed assets are
                  available, transferable and under their lawful control.
                </p>

                <p>
                  CryptoBidX may require wallet verification, blockchain
                  evidence, escrow deposit confirmation or other proof before
                  allowing settlement to proceed.
                </p>

                <p>
                  Sellers must not list stolen, restricted, sanctioned, frozen,
                  encumbered or otherwise unavailable assets.
                </p>

                <p>
                  If asset availability cannot be verified, CryptoBidX may
                  suspend, cancel or restrict the auction or settlement process.
                </p>
              </div>
            </section>

            <section
              id="buyer-payment"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                5. Buyer Payment Verification
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Buyer payment may be verified through approved payment
                  channels, regulated payment providers, stablecoin settlement
                  rails or other supported transaction methods.
                </p>

                <p>
                  Payment confirmation may require additional review where funds
                  are delayed, reversed, flagged, incomplete, disputed or subject
                  to compliance checks.
                </p>

                <p>
                  A payment may not be treated as final until CryptoBidX or its
                  approved providers determine that the relevant release
                  conditions have been satisfied.
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
                  Crypto assets should only be released after required settlement
                  conditions have been met.
                </p>

                <p>
                  Release conditions may include winning bid confirmation,
                  payment verification, compliance clearance, fraud review,
                  wallet confirmation and completion of platform-required
                  settlement steps.
                </p>

                <p>
                  CryptoBidX may delay release where information is incomplete,
                  suspicious activity is detected, payment is not final or
                  technical issues affect the transaction.
                </p>
              </div>
            </section>

            <section
              id="third-parties"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                7. Third-Party Providers
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  CryptoBidX may rely on third-party providers for payment
                  verification, escrow coordination, wallet infrastructure,
                  identity verification, blockchain analytics, fraud prevention
                  and compliance checks.
                </p>

                <p>
                  Third-party providers may have their own terms, policies,
                  service limitations, jurisdictional restrictions and
                  operational requirements.
                </p>

                <p>
                  CryptoBidX is not responsible for delays, outages, errors,
                  restrictions or failures caused by third-party providers,
                  except where required by applicable law.
                </p>
              </div>
            </section>

            <section
              id="limitations"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                8. Escrow Limitations
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Escrow-assisted settlement does not eliminate all transaction
                  risk.
                </p>

                <p>
                  Risks may include market volatility, payment reversal,
                  blockchain failure, wallet compromise, fraud, user error,
                  compliance holds, liquidity constraints and third-party
                  service issues.
                </p>

                <p>
                  CryptoBidX does not guarantee that escrow-assisted workflows
                  will prevent all losses, disputes or failed transactions.
                </p>
              </div>
            </section>

            <section
              id="fraud"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                9. Fraud & Compliance Holds
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  CryptoBidX may place holds on settlement activity where fraud,
                  sanctions exposure, suspicious activity, payment irregularity
                  or identity concerns are identified.
                </p>

                <p>
                  Users may be required to provide additional documentation or
                  explanation before a transaction can proceed.
                </p>

                <p>
                  CryptoBidX may cancel, suspend or report activity where
                  required by law, regulation, compliance policy or platform
                  risk controls.
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
                  Disputes may arise where parties disagree about payment,
                  asset delivery, listing accuracy, wallet information,
                  transaction status or settlement conditions.
                </p>

                <p>
                  CryptoBidX may review auction records, payment references,
                  wallet evidence, blockchain activity and user communications
                  when evaluating disputes.
                </p>

                <p>
                  Settlement activity may be paused while a dispute is reviewed.
                </p>

                <p>
                  CryptoBidX does not guarantee a particular dispute outcome and
                  may refer users to external legal, regulatory or payment
                  processes where appropriate.
                </p>
              </div>
            </section>

            <section
              id="changes"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                11. Changes to Escrow Standards
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  CryptoBidX may update these Escrow Standards as the platform,
                  settlement processes, provider relationships or regulatory
                  requirements evolve.
                </p>

                <p>
                  Continued use of the platform after updates become effective
                  indicates acceptance of the updated Escrow Standards.
                </p>

                <p>
                  These Escrow Standards should be read together with the Terms
                  of Service, Privacy Policy, Risk Disclosure and Settlement
                  Policy.
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}