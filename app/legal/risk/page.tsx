'use client';

import Link from 'next/link';

const sections = [
  { id: 'overview', title: '1. General Risk Notice' },
  { id: 'volatility', title: '2. Market Volatility' },
  { id: 'counterparty', title: '3. Counterparty Risk' },
  { id: 'settlement', title: '4. Settlement Risk' },
  { id: 'wallets', title: '5. Wallet & Private Key Risk' },
  { id: 'technology', title: '6. Technology & Infrastructure Risk' },
  { id: 'regulatory', title: '7. Regulatory Risk' },
  { id: 'liquidity', title: '8. Liquidity Risk' },
  { id: 'compliance', title: '9. Compliance & Account Restrictions' },
  { id: 'fraud', title: '10. Fraud & Scam Risk' },
  { id: 'tax', title: '11. Tax Responsibility' },
  { id: 'no-advice', title: '12. No Investment Advice' },
  { id: 'liability', title: '13. Limitation of Responsibility' },
];

export default function RiskDisclosurePage() {
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

          <h1 className="text-5xl font-bold mt-2">Risk Disclosure</h1>

          <p className="text-slate-400 mt-4 max-w-4xl text-lg leading-8">
            Cryptocurrency transactions involve substantial financial,
            operational, technological and regulatory risk. Users should
            carefully consider these risks before participating in auctions,
            settlements or other marketplace activity on CryptoBidX.
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
              <h2 className="text-3xl font-bold mb-5">
                1. General Risk Notice
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Participation in cryptocurrency markets carries significant
                  risk and may result in substantial financial loss.
                </p>

                <p>
                  Users acknowledge that crypto assets are highly speculative,
                  may experience extreme price volatility and may lose value
                  rapidly.
                </p>

                <p>
                  CryptoBidX provides marketplace infrastructure only and does
                  not guarantee transaction completion, settlement outcomes,
                  asset value, liquidity or counterparty performance.
                </p>

                <p>
                  Users are solely responsible for evaluating the risks
                  associated with any transaction conducted through the platform.
                </p>
              </div>
            </section>

            <section
              id="volatility"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                2. Market Volatility
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Cryptocurrency prices may fluctuate dramatically over short
                  periods of time.
                </p>

                <p>
                  Auction pricing, settlement value and market conditions may
                  change significantly between bid placement and transaction
                  completion.
                </p>

                <p>
                  Users may experience losses due to adverse market movements,
                  liquidity shifts, price gaps or sudden volatility events.
                </p>
              </div>
            </section>

            <section
              id="counterparty"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                3. Counterparty Risk
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Transactions on CryptoBidX involve independent buyers and
                  sellers.
                </p>

                <p>
                  Counterparties may fail to complete settlement obligations,
                  provide required information or cooperate with transaction
                  requirements.
                </p>

                <p>
                  CryptoBidX cannot guarantee the performance, solvency,
                  legitimacy or reliability of marketplace participants.
                </p>
              </div>
            </section>

            <section
              id="settlement"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                4. Settlement Risk
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Settlement processes may involve delays, reversals, compliance
                  reviews, banking restrictions, payment verification issues or
                  technical disruptions.
                </p>

                <p>
                  Escrow-assisted workflows reduce certain transaction risks but
                  do not eliminate all risk.
                </p>

                <p>
                  CryptoBidX does not guarantee uninterrupted settlement flow,
                  payment processing or transaction finality.
                </p>

                <p>
                  Transactions may be delayed, suspended or cancelled where
                  fraud, sanctions concerns, suspicious activity or operational
                  issues are identified.
                </p>
              </div>
            </section>

            <section
              id="wallets"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                5. Wallet & Private Key Risk
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Cryptocurrency wallets, addresses and private keys may be
                  vulnerable to theft, compromise, malware, phishing attacks or
                  user error.
                </p>

                <p>
                  Loss of private keys or wallet access may result in permanent
                  loss of assets.
                </p>

                <p>
                  Users are solely responsible for securing their wallets,
                  credentials, recovery phrases and authentication methods.
                </p>
              </div>
            </section>

            <section
              id="technology"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                6. Technology & Infrastructure Risk
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Blockchain networks, smart contracts, APIs, wallets, payment
                  systems and infrastructure providers may experience outages,
                  failures, congestion, bugs or security incidents.
                </p>

                <p>
                  Platform functionality may be affected by maintenance,
                  software defects, internet disruption, denial-of-service
                  attacks or third-party provider issues.
                </p>

                <p>
                  CryptoBidX does not guarantee uninterrupted platform
                  availability or error-free operation.
                </p>
              </div>
            </section>

            <section
              id="regulatory"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                7. Regulatory Risk
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Cryptocurrency regulation varies significantly between
                  jurisdictions and may change rapidly.
                </p>

                <p>
                  Regulatory developments may affect marketplace availability,
                  settlement mechanisms, user access, transaction legality or
                  asset treatment.
                </p>

                <p>
                  Users are responsible for understanding and complying with
                  local laws applicable to their activities.
                </p>
              </div>
            </section>

            <section
              id="liquidity"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                8. Liquidity Risk
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Some crypto assets may experience limited liquidity or reduced
                  market participation.
                </p>

                <p>
                  Users may be unable to sell, transfer or settle assets at
                  expected prices or within expected timeframes.
                </p>

                <p>
                  Auction outcomes may differ materially from broader market
                  pricing conditions.
                </p>
              </div>
            </section>

            <section
              id="compliance"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                9. Compliance & Account Restrictions
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  CryptoBidX may require identity verification, sanctions
                  screening, source of funds verification or compliance review
                  before allowing certain activity.
                </p>

                <p>
                  Accounts, transactions or settlements may be restricted,
                  delayed, suspended or terminated where compliance concerns are
                  identified.
                </p>

                <p>
                  Users acknowledge that legal or regulatory requirements may
                  require disclosure of information to authorities or compliance
                  partners.
                </p>
              </div>
            </section>

            <section
              id="fraud"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                10. Fraud & Scam Risk
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Cryptocurrency markets are frequently targeted by scammers,
                  impersonators, phishing actors and fraud schemes.
                </p>

                <p>
                  Users should independently verify wallet addresses,
                  communications, payment instructions and settlement details.
                </p>

                <p>
                  CryptoBidX cannot guarantee protection against all fraudulent
                  conduct, impersonation attempts or social engineering attacks.
                </p>
              </div>
            </section>

            <section
              id="tax"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                11. Tax Responsibility
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Users are solely responsible for determining and complying with
                  their tax obligations.
                </p>

                <p>
                  CryptoBidX does not provide tax advice and does not guarantee
                  the tax treatment of any transaction.
                </p>

                <p>
                  Users should seek independent professional advice regarding
                  taxation applicable to their activities.
                </p>
              </div>
            </section>

            <section
              id="no-advice"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                12. No Investment Advice
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  CryptoBidX does not provide investment advice, financial
                  advice, portfolio management services or trading
                  recommendations.
                </p>

                <p>
                  Information presented on the platform is provided for
                  marketplace functionality and informational purposes only.
                </p>

                <p>
                  Users are solely responsible for making independent financial
                  and investment decisions.
                </p>
              </div>
            </section>

            <section
              id="liability"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                13. Limitation of Responsibility
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  To the maximum extent permitted by law, CryptoBidX shall not
                  be liable for losses arising from market volatility,
                  counterparty conduct, settlement delays, wallet compromise,
                  blockchain failures, compliance actions or technical issues.
                </p>

                <p>
                  Users acknowledge that participation in crypto asset activity
                  involves substantial uncertainty and risk.
                </p>

                <p>
                  Use of the platform is undertaken entirely at the user’s own
                  risk.
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}