'use client';

import Link from 'next/link';

const sections = [
  { id: 'overview', title: '1. Overview' },
  { id: 'data-collected', title: '2. Information We Collect' },
  { id: 'usage', title: '3. How We Use Information' },
  { id: 'legal-basis', title: '4. Legal Basis' },
  { id: 'sharing', title: '5. Sharing Information' },
  { id: 'kyc', title: '6. KYC, AML & Compliance' },
  { id: 'cookies', title: '7. Cookies & Analytics' },
  { id: 'security', title: '8. Security' },
  { id: 'retention', title: '9. Data Retention' },
  { id: 'rights', title: '10. User Rights' },
  { id: 'international', title: '11. International Transfers' },
  { id: 'children', title: '12. Children' },
  { id: 'changes', title: '13. Changes' },
  { id: 'contact', title: '14. Contact' },
];

export default function PrivacyPage() {
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

          <h1 className="text-5xl font-bold mt-2">Privacy Policy</h1>

          <p className="text-slate-400 mt-4 max-w-4xl text-lg leading-8">
            This Privacy Policy explains how CryptoBidX collects, uses, stores,
            protects and shares personal information when users access the
            platform, create accounts, list assets, place bids or participate in
            settlement workflows.
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
                  CryptoBidX respects user privacy and is committed to handling
                  personal information responsibly, transparently and securely.
                </p>

                <p>
                  This Privacy Policy applies to all users of the CryptoBidX
                  platform, including visitors, registered users, sellers,
                  bidders and settlement participants.
                </p>

                <p>
                  By using CryptoBidX, users acknowledge that their information
                  may be processed in accordance with this Privacy Policy.
                </p>
              </div>
            </section>

            <section
              id="data-collected"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                2. Information We Collect
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  We may collect account information such as name, email address,
                  username, password authentication data and user profile
                  settings.
                </p>

                <p>
                  We may collect marketplace activity data including auction
                  listings, bids, cancellation requests, transaction status,
                  settlement actions and user communications.
                </p>

                <p>
                  We may collect technical information including IP address,
                  device information, browser type, operating system, session
                  data, log data and usage analytics.
                </p>

                <p>
                  Where required for compliance, escrow, payment or settlement,
                  we may collect identity verification information, wallet
                  information, payment references, source of funds information
                  and related documentation.
                </p>
              </div>
            </section>

            <section
              id="usage"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                3. How We Use Information
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  We use personal information to create and manage accounts,
                  operate marketplace features, process auction activity and
                  coordinate settlement workflows.
                </p>

                <p>
                  We use information to prevent fraud, enforce platform rules,
                  investigate suspicious activity, protect users and maintain
                  platform integrity.
                </p>

                <p>
                  We may use information to communicate with users about account
                  activity, bids, listings, settlement status, security notices,
                  policy updates and support requests.
                </p>

                <p>
                  We may use aggregated or anonymised data to improve platform
                  performance, user experience, analytics and marketplace
                  insights.
                </p>
              </div>
            </section>

            <section
              id="legal-basis"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">4. Legal Basis</h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Where applicable, CryptoBidX processes personal information
                  based on user consent, contractual necessity, legitimate
                  interests, legal obligations or compliance requirements.
                </p>

                <p>
                  Legitimate interests may include fraud prevention, marketplace
                  safety, dispute resolution, platform security, service
                  improvement and enforcement of platform terms.
                </p>

                <p>
                  Compliance processing may include anti-money laundering
                  reviews, sanctions screening, identity verification and
                  cooperation with regulators or law enforcement where required.
                </p>
              </div>
            </section>

            <section
              id="sharing"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                5. Sharing Information
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  CryptoBidX does not sell personal information to third parties.
                </p>

                <p>
                  We may share information with service providers who support
                  authentication, hosting, payments, escrow coordination,
                  analytics, communications, compliance, customer support and
                  security operations.
                </p>

                <p>
                  We may share information with regulated payment providers,
                  escrow partners, blockchain analytics providers, KYC/AML
                  providers or compliance vendors where required to support
                  settlement or legal obligations.
                </p>

                <p>
                  We may disclose information where required by law, regulation,
                  court order, subpoena, law enforcement request or government
                  authority.
                </p>
              </div>
            </section>

            <section
              id="kyc"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                6. KYC, AML & Compliance
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Certain platform activities may require identity verification,
                  sanctions screening, wallet screening, source of funds review
                  or anti-money laundering checks.
                </p>

                <p>
                  Users may be asked to provide identity documents, proof of
                  address, corporate information, wallet ownership confirmation,
                  transaction information or supporting documentation.
                </p>

                <p>
                  CryptoBidX may restrict, suspend or refuse transactions where
                  information is incomplete, inaccurate, suspicious or raises
                  compliance concerns.
                </p>
              </div>
            </section>

            <section
              id="cookies"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                7. Cookies & Analytics
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  CryptoBidX may use cookies, local storage and similar
                  technologies to maintain sessions, remember preferences,
                  improve platform performance and analyse usage.
                </p>

                <p>
                  Users may be able to disable cookies in their browser, but
                  doing so may affect platform functionality.
                </p>

                <p>
                  Analytics information may be used to understand user behaviour,
                  detect technical problems, improve marketplace design and
                  monitor platform performance.
                </p>
              </div>
            </section>

            <section
              id="security"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">8. Security</h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  CryptoBidX uses reasonable technical and organisational
                  measures designed to protect user information against
                  unauthorised access, misuse, loss, disclosure or alteration.
                </p>

                <p>
                  No online system, blockchain network, wallet, database or
                  transmission method can be guaranteed completely secure.
                </p>

                <p>
                  Users are responsible for maintaining the confidentiality of
                  their login credentials, wallet credentials and account access
                  methods.
                </p>
              </div>
            </section>

            <section
              id="retention"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">9. Data Retention</h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  CryptoBidX retains personal information for as long as
                  necessary to provide services, comply with legal obligations,
                  resolve disputes, prevent fraud and enforce platform terms.
                </p>

                <p>
                  Compliance, transaction, identity verification and settlement
                  records may be retained for longer periods where required by
                  law, regulation, audit standards or risk management practices.
                </p>

                <p>
                  When information is no longer required, CryptoBidX may delete,
                  anonymise or securely archive it.
                </p>
              </div>
            </section>

            <section
              id="rights"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">10. User Rights</h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Depending on jurisdiction, users may have rights to access,
                  correct, delete, restrict, object to or receive a copy of their
                  personal information.
                </p>

                <p>
                  Users may also have the right to withdraw consent where
                  processing is based on consent.
                </p>

                <p>
                  Some requests may be limited where CryptoBidX must retain
                  information for legal, compliance, fraud prevention, dispute
                  resolution or security purposes.
                </p>
              </div>
            </section>

            <section
              id="international"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">
                11. International Transfers
              </h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  CryptoBidX may process and store information in jurisdictions
                  outside the user’s country of residence.
                </p>

                <p>
                  Where required, CryptoBidX will seek to use appropriate
                  safeguards for cross-border data transfers, including
                  contractual protections and compliance controls.
                </p>
              </div>
            </section>

            <section
              id="children"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">12. Children</h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  CryptoBidX is not intended for users under 18 years of age.
                </p>

                <p>
                  We do not knowingly collect personal information from children.
                  If we become aware that a child has provided information, we
                  may delete it and restrict account access.
                </p>
              </div>
            </section>

            <section
              id="changes"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">13. Changes</h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  CryptoBidX may update this Privacy Policy from time to time to
                  reflect operational, legal, regulatory or technical changes.
                </p>

                <p>
                  Continued use of the platform after changes become effective
                  indicates acceptance of the updated Privacy Policy.
                </p>
              </div>
            </section>

            <section
              id="contact"
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-3xl font-bold mb-5">14. Contact</h2>

              <div className="space-y-5 text-slate-300 leading-8">
                <p>
                  Privacy enquiries, data requests and compliance questions may
                  be submitted through the official CryptoBidX support or legal
                  contact channels once published.
                </p>

                <p>
                  Users may be asked to verify their identity before privacy or
                  data access requests are processed.
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}