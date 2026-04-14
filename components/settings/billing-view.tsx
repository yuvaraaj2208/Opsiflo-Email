'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Check, Zap, Crown, Star, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Profile, Subscription } from '@/types'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const plans = {
  basic: {
    name: 'Basic',
    icon: Star,
    color: 'text-blue-400',
    bg: 'from-blue-500/10',
    features: ['500 emails/month', '1 campaign', '500 prospects', 'AI writer', 'Response Score'],
    priceINR: 199,
    priceUSD: 9.99,
  },
  pro: {
    name: 'Pro',
    icon: Zap,
    color: 'text-purple-400',
    bg: 'from-purple-500/10',
    features: ['5,000 emails/month', '10 campaigns', '5,000 prospects', 'Sequences', 'A/B Testing', 'Reply Inbox'],
    priceINR: 399,
    priceUSD: 19.99,
    popular: true,
  },
  premium: {
    name: 'Premium',
    icon: Crown,
    color: 'text-amber-400',
    bg: 'from-amber-500/10',
    features: ['Unlimited everything', 'All features', '50+ Templates', 'ROI Tracker', 'Warmup System', 'Priority Support'],
    priceINR: 599,
    priceUSD: 24.99,
  },
}

interface BillingViewProps {
  profile: Profile | null
  subscription: Subscription | null
  country: string
}

export function BillingView({ profile, subscription, country }: BillingViewProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const isIndia = country === 'IN'

  const handleUpgrade = async (plan: string) => {
    setLoading(plan)
    try {
      if (isIndia) {
        // Razorpay flow
        const res = await fetch('/api/payments/razorpay/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan }),
        })
        const { orderId, amount, currency } = await res.json()

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount,
          currency,
          name: 'Opsiflo Email',
          description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
          order_id: orderId,
          handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
            const verifyRes = await fetch('/api/payments/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                plan,
              }),
            })

            if (verifyRes.ok) {
              toast.success('🎉 Payment successful! Your plan is now active.')
              window.location.reload()
            } else {
              toast.error('Payment verification failed. Contact support.')
            }
          },
          theme: { color: '#6366f1' },
        }

        // @ts-ignore - Razorpay is loaded via script
        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        // Lemon Squeezy flow
        const res = await fetch('/api/payments/lemonsqueezy/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan }),
        })
        const { checkoutUrl } = await res.json()
        window.location.href = checkoutUrl
      }
    } catch (error) {
      toast.error('Failed to initiate payment. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const currentPlan = profile?.plan ?? 'free'

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing & Plans</h1>
        <p className="text-muted-foreground mt-1">Manage your subscription</p>
      </div>

      {/* Current plan */}
      <Card glass>
        <CardContent className="p-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-500/10">
                <CreditCard className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <p className="font-semibold text-white">
                  Current Plan: <span className="text-indigo-400 capitalize">{currentPlan}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {profile?.plan_status === 'trialing'
                    ? `Free trial ends ${profile.trial_ends_at ? formatDate(profile.trial_ends_at) : 'soon'}`
                    : subscription
                    ? `Renews on ${formatDate(subscription.current_period_end)}`
                    : 'No active subscription'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={profile?.plan_status === 'active' ? 'success' : profile?.plan_status === 'trialing' ? 'warning' : 'secondary'}>
                {profile?.plan_status ?? 'Free Trial'}
              </Badge>
              {isIndia ? (
                <Badge variant="info">🇮🇳 Razorpay (INR)</Badge>
              ) : (
                <Badge variant="info">🌍 LemonSqueezy (USD)</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {(Object.entries(plans) as [string, typeof plans.basic & { popular?: boolean }][]).map(([planKey, plan]) => {
          const Icon = plan.icon
          const isCurrentPlan = currentPlan === planKey
          const price = isIndia ? `₹${plan.priceINR}` : `$${plan.priceUSD}`

          return (
            <motion.div
              key={planKey}
              whileHover={{ scale: 1.02 }}
              className={`rounded-xl border p-5 transition-all ${
                isCurrentPlan
                  ? 'border-indigo-500/50 bg-indigo-500/10'
                  : 'border-white/10 glass-card'
              } ${'popular' in plan && plan.popular ? 'relative' : ''}`}
            >
              {'popular' in plan && plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="premium">Most Popular</Badge>
                </div>
              )}
              <div className={`p-2 rounded-lg bg-white/5 w-fit mb-3 ${plan.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-lg">{plan.name}</h3>
              <div className="flex items-baseline gap-1 my-2">
                <span className="text-2xl font-bold text-white">{price}</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <div className="space-y-2 mb-4">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              {isCurrentPlan ? (
                <div className="w-full text-center py-2 rounded-lg bg-indigo-500/20 text-indigo-300 text-sm font-medium border border-indigo-500/30">
                  Current Plan
                </div>
              ) : (
                <Button
                  className="w-full"
                  variant={currentPlan === 'free' || planKey === 'premium' ? 'default' : 'outline'}
                  loading={loading === planKey}
                  onClick={() => handleUpgrade(planKey)}
                >
                  {currentPlan === 'free' ? 'Start Free Trial' : 'Upgrade'} to {plan.name}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Razorpay script for India */}
      {isIndia && (
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      )}
    </div>
  )
}
