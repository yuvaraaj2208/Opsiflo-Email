'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const plans = {
  INR: [
    {
      name: 'Basic',
      price: '₹199',
      period: '/month',
      description: 'Perfect for individuals getting started',
      features: [
        '500 emails/month',
        '1 campaign at a time',
        '500 prospects',
        'AI Email Writer',
        'Response Prediction Score',
        'Best Send Time Optimizer',
        'Email Validation',
        '7-day free trial',
      ],
      cta: 'Start Free Trial',
      href: '/signup',
      highlight: false,
    },
    {
      name: 'Pro',
      price: '₹399',
      period: '/month',
      description: 'For growing sales teams',
      features: [
        '5,000 emails/month',
        '10 campaigns',
        '5,000 prospects',
        'Everything in Basic',
        'Multi-Channel Sequencing',
        'A/B Testing',
        'Reply Inbox',
        'Email Validation',
        '100 AI calls/day',
      ],
      cta: 'Start Free Trial',
      href: '/signup',
      highlight: true,
    },
    {
      name: 'Premium',
      price: '₹599',
      period: '/month',
      description: 'Unlimited power for serious teams',
      features: [
        'Unlimited emails',
        'Unlimited campaigns',
        'Unlimited prospects',
        'Everything in Pro',
        '50+ Industry Templates',
        'ROI Tracker & Attribution',
        'Email Warmup System',
        'Unlimited AI calls',
        'Priority support',
      ],
      cta: 'Start Free Trial',
      href: '/signup',
      highlight: false,
    },
  ],
  USD: [
    {
      name: 'Basic',
      price: '$9.99',
      period: '/month',
      description: 'Perfect for individuals getting started',
      features: [
        '500 emails/month',
        '1 campaign at a time',
        '500 prospects',
        'AI Email Writer',
        'Response Prediction Score',
        'Best Send Time Optimizer',
        'Email Validation',
        '7-day free trial',
      ],
      cta: 'Start Free Trial',
      href: '/signup',
      highlight: false,
    },
    {
      name: 'Pro',
      price: '$19.99',
      period: '/month',
      description: 'For growing sales teams',
      features: [
        '5,000 emails/month',
        '10 campaigns',
        '5,000 prospects',
        'Everything in Basic',
        'Multi-Channel Sequencing',
        'A/B Testing',
        'Reply Inbox',
        'Email Validation',
        '100 AI calls/day',
      ],
      cta: 'Start Free Trial',
      href: '/signup',
      highlight: true,
    },
    {
      name: 'Premium',
      price: '$24.99',
      period: '/month',
      description: 'Unlimited power for serious teams',
      features: [
        'Unlimited emails',
        'Unlimited campaigns',
        'Unlimited prospects',
        'Everything in Pro',
        '50+ Industry Templates',
        'ROI Tracker & Attribution',
        'Email Warmup System',
        'Unlimited AI calls',
        'Priority support',
      ],
      cta: 'Start Free Trial',
      href: '/signup',
      highlight: false,
    },
  ],
}

export function PricingSection() {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('USD')

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-3">
          Simple, transparent pricing
        </h2>
        <p className="text-slate-400 mb-6">
          Start with a 7-day free trial. No credit card required.
        </p>

        {/* Currency toggle */}
        <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
          <button
            onClick={() => setCurrency('INR')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              currency === 'INR'
                ? 'bg-indigo-500 text-white'
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            🇮🇳 India (₹)
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              currency === 'USD'
                ? 'bg-indigo-500 text-white'
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            🌍 Global ($)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans[currency].map((plan, idx) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className={`relative rounded-xl p-6 border ${
              plan.highlight
                ? 'border-indigo-500/50 bg-gradient-to-b from-indigo-500/10 to-transparent'
                : 'border-white/10 glass-card'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="premium" className="px-3 py-1">
                  <Zap className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-bold text-white">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
            </div>

            <Button
              className="w-full mb-6"
              variant={plan.highlight ? 'default' : 'outline'}
              asChild
            >
              <Link href={plan.href}>{plan.cta}</Link>
            </Button>

            <div className="space-y-2.5">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2.5 text-sm">
                  <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground mt-8">
        All plans include a 7-day full Premium trial. Upgrade, downgrade, or cancel anytime.
        <br />
        India payments via Razorpay • Global payments via Lemon Squeezy
      </p>
    </div>
  )
}
