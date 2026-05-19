'use client';

import Link from 'next/link';
import { useState } from 'react';

const enquiryTypes = [
  'General enquiry',
  'Auction support',
  'Seller support',
  'Buyer support',
  'Settlement issue',
  'Compliance / legal',
  'Partnership enquiry',
  'Technical issue',
];

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [enquiryType, setEnquiryType] = useState('General enquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !email || !message) {
      alert('Please complete your name, email and message.');
      return;
    }

    console.log('Contact enquiry submitted:', {
      name,
      email,
      enquiryType,
      message,
      submittedAt: new Date().toISOString(),
    });

    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="max-w-7xl mx-auto">
        <div className="mb-10">
          <Link href="/" className="text-blue-400 hover:underline text-sm">
            ← Back to homepage
          </Link>

          <p className="mt-6 text-sm text-emerald-400 font-semibold">
            Support Centre
          </p>

          <h1 className="text-5xl font-bold mt-2">Contact CryptoBidX</h1>

          <p className="text-slate-400 mt-4 max-w-3xl text-lg leading-8">
            Get in touch with the CryptoBidX team for marketplace support,
            auction enquiries, settlement questions, compliance matters or
            partnership discussions.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl">
                  ✓
                </div>

                <h2 className="text-3xl font-bold mb-3">
                  Message received
                </h2>

                <p className="text-slate-400 max-w-xl mx-auto mb-6">
                  Your enquiry has been captured in the front-end foundation.
                  Once the support backend is connected, this form will route
                  messages to the CryptoBidX support workflow.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setName('');
                    setEmail('');
                    setEnquiryType('General enquiry');
                    setMessage('');
                    setSubmitted(false);
                  }}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 transition"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl bg-[#020617] border border-slate-700 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl bg-[#020617] border border-slate-700 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Enquiry type
                  </label>
                  <select
                    value={enquiryType}
                    onChange={(e) => setEnquiryType(e.target.value)}
                    className="w-full rounded-xl bg-[#020617] border border-slate-700 px-4 py-3 outline-none focus:border-blue-500"
                  >
                    {enquiryTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={7}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how we can help..."
                    className="w-full rounded-xl bg-[#020617] border border-slate-700 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 transition"
                >
                  Submit Enquiry
                </button>

                <p className="text-xs text-slate-500">
                  This form is currently a front-end foundation. Backend routing,
                  email notifications and support ticket storage will be added
                  later.
                </p>
              </form>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">
              <h2 className="text-2xl font-bold mb-4">Support Areas</h2>

              <div className="space-y-4 text-sm text-slate-400">
                <div className="rounded-2xl bg-[#020617] border border-slate-800 p-4">
                  <p className="font-semibold text-emerald-400">
                    Auction support
                  </p>
                  <p className="mt-1">
                    Help with listings, bids, cancellation requests and auction
                    status.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#020617] border border-slate-800 p-4">
                  <p className="font-semibold text-blue-400">
                    Settlement support
                  </p>
                  <p className="mt-1">
                    Questions about payment confirmation, escrow-assisted
                    settlement and release flow.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#020617] border border-slate-800 p-4">
                  <p className="font-semibold text-purple-400">
                    Compliance enquiries
                  </p>
                  <p className="mt-1">
                    Legal, verification, risk, policy and restricted activity
                    matters.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-emerald-500/10 border border-emerald-500/20 p-6">
              <h2 className="text-xl font-bold text-emerald-400 mb-3">
                Trust-first support
              </h2>

              <p className="text-sm text-slate-300 leading-6">
                CryptoBidX is designed around transparent auction records,
                controlled settlement workflows and clear support escalation for
                buyers and sellers.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">
              <h2 className="text-xl font-bold mb-3">Useful links</h2>

              <div className="space-y-2 text-sm text-slate-400">
                <Link href="/legal/terms" className="block hover:text-white">
                  Terms of Service
                </Link>
                <Link href="/legal/privacy" className="block hover:text-white">
                  Privacy Policy
                </Link>
                <Link href="/legal/risk" className="block hover:text-white">
                  Risk Disclosure
                </Link>
                <Link
                  href="/legal/settlement"
                  className="block hover:text-white"
                >
                  Settlement Policy
                </Link>
                <Link href="/legal/escrow" className="block hover:text-white">
                  Escrow Standards
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}