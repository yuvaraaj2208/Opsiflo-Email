'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    q: 'What makes Opsiflo Email different from Instantly or Lemlist?',
    a: 'We built AI into every layer — not as an afterthought. Our Response Prediction Score analyzes 9 factors before you send and tells you exactly what to improve. Best Send Time is calculated per-prospect based on their role. No other tool combines these into one platform.',
  },
  {
    q: 'Does the 7-day free trial require a credit card?',
    a: 'No. Sign up with just your email. You get full Premium access for 7 days. We only ask for payment if you want to continue after your trial ends.',
  },
  {
    q: 'How does the AI email writer work?',
    a: 'You select your industry, prospect role, and campaign goal. Claude AI (Anthropic) generates 3 subject line variants and 3 email body variants, each with a predicted open rate score, tone label, spam word detection, and readability score. You can edit inline, regenerate specific sections, or mix and match.',
  },
  {
    q: 'Is this GDPR and CAN-SPAM compliant?',
    a: 'Yes. Every email automatically includes a one-click unsubscribe link. We maintain a global unsubscribe list and never send to opted-out contacts. Users can export or delete their data on request. We are fully GDPR compliant.',
  },
  {
    q: 'Can I import my existing prospect list?',
    a: 'Yes — upload a CSV with any column names and our visual column mapper will match them to our fields. We auto-validate emails, detect duplicates, and flag invalid addresses before you send a single email.',
  },
  {
    q: 'How does the Response Prediction Score work exactly?',
    a: 'Before you send, AI analyzes your subject line, body, email length, personalization level, CTA clarity, prospect job title, industry, send time, and day of week. It returns a 0–100 score with a breakdown of what\'s helping and what\'s hurting — plus one-click suggestions to improve each factor.',
  },
  {
    q: 'Which payment methods are supported?',
    a: 'For India: Razorpay (UPI, cards, net banking, wallets) in INR. For all other countries: Lemon Squeezy (cards, PayPal) in USD. Currency is auto-detected by your IP.',
  },
  {
    q: 'What is the email sending limit on each plan?',
    a: 'Basic: 500 emails/month. Pro: 5,000 emails/month. Premium: Unlimited. We send via Resend for maximum deliverability.',
  },
  {
    q: 'Can I use my own custom sending domain?',
    a: 'Yes on Pro and Premium plans. Connect your domain through Resend, and all emails are sent from your own address for maximum trust and deliverability.',
  },
  {
    q: 'What happens when my free trial ends?',
    a: 'You will get a reminder 3 days before. After 7 days, your account moves to a free tier with limited access. Your data is always preserved. Upgrade at any time to regain full access.',
  },
]

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-3">Frequently asked questions</h2>
        <p className="text-slate-400">Everything you need to know before you start</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className={`rounded-xl border transition-all duration-200 ${
              open === idx
                ? 'border-indigo-500/30 bg-indigo-500/5'
                : 'border-white/10 bg-white/3'
            }`}
          >
            <button
              className="w-full flex items-center justify-between p-5 text-left"
              onClick={() => setOpen(open === idx ? null : idx)}
            >
              <span className={`font-medium text-sm ${open === idx ? 'text-white' : 'text-slate-300'}`}>
                {faq.q}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground flex-shrink-0 ml-4 transition-transform duration-200 ${
                  open === idx ? 'rotate-180 text-indigo-400' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {open === idx && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
