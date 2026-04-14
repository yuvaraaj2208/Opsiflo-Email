'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, Copy, Check, Share2, ExternalLink, MessageCircle, Users, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Profile, Referral } from '@/types'
import { toast } from 'sonner'

interface ReferralDashboardProps {
  profile: Profile | null
  referrals: Referral[]
}

export function ReferralDashboard({ profile, referrals }: ReferralDashboardProps) {
  const [copied, setCopied] = useState(false)

  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : 'https://email.opsiflo.com'}/ref/${profile?.referral_code}`

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast.success('Referral link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const conversions = referrals.filter((r) => r.status === 'converted').length
  const rewards = referrals.filter((r) => r.status === 'rewarded').length
  const freeMonthsEarned = referrals.reduce((sum, r) => sum + (r.reward_months || 0), 0)

  const shareText = `I've been using Opsiflo Email to 3x my cold email reply rates with AI. Try it free for 7 days: ${referralLink}`

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Referral Program</h1>
        <p className="text-muted-foreground mt-1">Earn 1 free month for every paying referral</p>
      </div>

      {/* Hero card */}
      <Card glass className="border-indigo-500/30 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/5" />
        <CardContent className="p-6 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-500/20 rounded-xl">
              <Gift className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Share & Earn</h3>
              <p className="text-sm text-slate-400">Get 1 free month for each friend who starts a paid plan</p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 truncate">
              {referralLink}
            </div>
            <Button onClick={handleCopy} variant="outline" className="flex-shrink-0">
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>

          {/* Share buttons */}
          <div className="flex items-center gap-3 mt-4">
            <span className="text-xs text-muted-foreground">Share via:</span>
            <button
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs hover:bg-sky-500/20 transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
              Twitter
            </button>
            <button
              onClick={() => window.open(`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`, '_blank')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs hover:bg-blue-500/20 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              LinkedIn
            </button>
            <button
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs hover:bg-emerald-500/20 transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Referrals', value: referrals.length, icon: Share2, color: 'text-indigo-400' },
          { label: 'Conversions', value: conversions, icon: Users, color: 'text-emerald-400' },
          { label: 'Free Months Earned', value: freeMonthsEarned, icon: Gift, color: 'text-purple-400' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} glass>
              <CardContent className="p-4 text-center">
                <Icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* How it works */}
      <Card glass>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">How it works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[
              { step: '1', title: 'Share your link', desc: 'Share your unique referral link with colleagues or on social media' },
              { step: '2', title: 'They sign up', desc: 'Your friend starts a free trial using your link' },
              { step: '3', title: 'You earn', desc: 'When they upgrade to a paid plan, you get 1 free month' },
            ].map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white mx-auto mb-3">
                  {step.step}
                </div>
                <p className="text-sm font-medium text-white mb-1">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Referrals table */}
      {referrals.length > 0 && (
        <Card glass>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Your Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {referrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-3 rounded-lg bg-white/3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                      ?
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Referred User</p>
                      <p className="text-xs text-muted-foreground">{new Date(referral.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {referral.reward_months > 0 && (
                      <span className="text-xs text-amber-400">+{referral.reward_months} month{referral.reward_months > 1 ? 's' : ''}</span>
                    )}
                    <Badge variant={
                      referral.status === 'rewarded' ? 'success' :
                      referral.status === 'converted' ? 'info' : 'secondary'
                    }>
                      {referral.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
