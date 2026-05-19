const faqs = [
  {
    question: 'Is CryptoBidX an exchange?',
    answer:
      'No. CryptoBidX is designed as an auction marketplace and settlement coordination platform, not a pooled liquidity exchange.',
  },
  {
    question: 'When does the buyer pay?',
    answer:
      'In the current flow, the winning bidder pays after the auction closes and they are confirmed as the highest valid bidder.',
  },
  {
    question: 'How is the crypto secured?',
    answer:
      'In production, seller assets would be deposited, verified or locked before the auction goes live. In the current prototype, escrow is simulated.',
  },
  {
    question: 'What happens if the buyer does not pay?',
    answer:
      'The auction would move into a failed or disputed settlement state. The asset would not be released until payment conditions are satisfied.',
  },
  {
    question: 'What happens if the seller does not release the asset?',
    answer:
      'The release process is designed to be controlled by settlement status. In production, release would only occur through the escrow flow.',
  },
  {
    question: 'How is the live market price calculated?',
    answer:
      'Auction pages use indicative spot pricing from market data to estimate the current value of the listed asset and compare it against the highest bid.',
  },
  {
    question: 'Can buyers bid in different currencies?',
    answer:
      'Yes. The prototype supports USD, GBP and EUR bidding, while bids are compared internally on a USD basis.',
  },
  {
    question: 'Can I cancel a listing?',
    answer:
      'In a live version, cancellation rules would depend on whether the auction has bids, whether escrow has been confirmed and whether settlement has started.',
  },
  {
    question: 'Are bids binding?',
    answer:
      'In production, bids would be treated as binding offers subject to platform terms, identity checks and settlement rules.',
  },
  {
    question: 'Does CryptoBidX custody funds?',
    answer:
      'The intended model is to coordinate escrow-backed settlement rather than operate as a traditional exchange balance system.',
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white px-10 xl:px-16 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <p className="text-sm text-blue-400 font-semibold mb-3">FAQ</p>

          <h1 className="text-5xl font-bold mb-6">
            Frequently asked questions.
          </h1>

          <p className="text-slate-400 text-lg max-w-3xl">
            Clear answers on how CryptoBidX auctions, escrow, bidding, payment
            and settlement are designed to work.
          </p>
        </div>

        <div className="grid gap-5 mb-16">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl bg-slate-900 border border-slate-800 p-6"
            >
              <h2 className="text-xl font-bold mb-3">{item.question}</h2>
              <p className="text-slate-400 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-blue-600 p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Still deciding whether CryptoBidX is right for you?
          </h2>

          <p className="text-blue-100 mb-6">
            Learn how the auction and settlement flow works before creating your
            first listing or placing a bid.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/how-it-works"
              className="inline-block rounded-xl bg-white text-blue-700 px-6 py-3 font-semibold"
            >
              How It Works
            </a>

            <a
              href="/why"
              className="inline-block rounded-xl bg-blue-700 border border-blue-400/40 px-6 py-3 font-semibold text-white hover:bg-blue-500 transition"
            >
              Why Use CryptoBidX
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
