'use client'

import { motion } from 'framer-motion'
import { Mail, Users, TrendingUp, MessageSquare, Plus, ArrowRight, Zap, Target, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import type { Profile, Campaign } from '@/types'
import { formatNumber, formatDate, formatRelativeTime } from '@/lib/utils'
import { OnboardingWizard } from '@/components/dashboard/onboarding-wizard'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

interface DashboardOverviewProps {
  profile: Profile | null
  recentCampaigns: Campaign[]
  totalProspects: number
  unreadReplies: number
  stats: {
    totalSent: number
    totalOpens: number
    totalReplies: number
    openRate: number
    replyRate: number
  }
}

const statusColors = {
  draft: 'secondary',
  scheduled: 'warning',
  sending: 'info',
  sent: 'success',
  paused: 'outline',
} as const

export function DashboardOverview({
  profile,
  recentCampaigns,
  totalProspects,
  unreadReplies,
  stats,
}: DashboardOverviewProps) {
  const isNewUser = recentCampaigns.length === 0

  const statCards = [
    {
      title: 'Emails Sent',
      value: formatNumber(stats.totalSent),
      icon: Mail,
      color: 'from-indigo-500/20 to-indigo-500/5',
      iconColor: 'text-indigo-400',
      change: '+12% this month',
      positive: true,
    },
    {
      title: 'Open Rate',
      value: stats.openRate.toFixed(1) + '%',
      icon: TrendingUp,
      color: 'from-emerald-500/20 to-emerald-500/5',
      iconColor: 'text-emerald-400',
      change: 'Industry avg: 21%',
      positive: stats.openRate > 21,
    },
    {
      title: 'Reply Rate',
      value: stats.replyRate.toFixed(1) + '%',
      icon: MessageSquare,
      color: 'from-purple-500/20 to-purple-500/5',
      iconColor: 'text-purple-400',
      change: 'Industry avg: 8%',
      positive: stats.replyRate > 8,
    },
    {
      title: 'Total Prospects',
      value: formatNumber(totalProspects),
      icon: Users,
      color: 'from-cyan-500/20 to-cyan-500/5',
      iconColor: 'text-cyan-400',
      change: 'Across all lists',
      positive: true,
    },
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Welcome Banner */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Good morning, {profile?.full_name?.split(' ')[0] || 'there'} 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your campaigns today.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/campaigns/new">
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Onboarding for new users */}
      {isNewUser && (
        <motion.div variants={item}>
          <OnboardingWizard />
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} glass className="relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-50`} />
              <CardContent className="p-5 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
                  <div className={`p-2 rounded-lg bg-white/5 ${stat.iconColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className={`text-xs mt-1 ${stat.positive ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </motion.div>

      {/* Quick Actions + Recent Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Campaigns */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card glass>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Recent Campaigns</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/campaigns">
                    View all <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentCampaigns.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Mail className="h-6 w-6 text-indigo-400" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">No campaigns yet</p>
                  <Button asChild size="sm">
                    <Link href="/campaigns/new">Create your first campaign</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentCampaigns.map((campaign) => {
                    const statsData = Array.isArray(campaign.campaign_stats)
                      ? campaign.campaign_stats[0]
                      : campaign.campaign_stats
                    const sent = statsData?.total_sent ?? 0
                    const opens = statsData?.unique_opens ?? 0
                    const replies = statsData?.replies ?? 0
                    const openRate = sent > 0 ? ((opens / sent) * 100).toFixed(1) : '0'
                    const replyRate = sent > 0 ? ((replies / sent) * 100).toFixed(1) : '0'

                    return (
                      <Link
                        key={campaign.id}
                        href={`/campaigns/${campaign.id}`}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="h-4 w-4 text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-white truncate group-hover:text-indigo-300 transition-colors">
                              {campaign.name}
                            </p>
                            <Badge variant={statusColors[campaign.status]} className="text-[10px] py-0 h-4 flex-shrink-0">
                              {campaign.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatRelativeTime(campaign.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
                          <div className="text-center">
                            <div className="font-medium text-white">{formatNumber(sent)}</div>
                            <div>sent</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-emerald-400">{openRate}%</div>
                            <div>opens</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-purple-400">{replyRate}%</div>
                            <div>replies</div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions & Plan Info */}
        <motion.div variants={item} className="space-y-4">
          {/* Quick Actions */}
          <Card glass>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: 'Write AI Email', href: '/campaigns/new', icon: Zap, color: 'text-indigo-400' },
                { label: 'Import Prospects', href: '/prospects/import', icon: Users, color: 'text-emerald-400' },
                { label: 'View Analytics', href: '/analytics', icon: TrendingUp, color: 'text-purple-400' },
                { label: 'Check Inbox', href: '/inbox', icon: MessageSquare, color: 'text-cyan-400', badge: unreadReplies > 0 ? unreadReplies : undefined },
                { label: 'Schedule Campaign', href: '/campaigns/new', icon: Clock, color: 'text-amber-400' },
              ].map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <div className={`p-1.5 rounded-md bg-white/5 ${action.color}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors flex-1">
                      {action.label}
                    </span>
                    {'badge' in action && action.badge && (
                      <Badge variant="default" className="text-[10px] h-4 py-0">
                        {action.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </CardContent>
          </Card>

          {/* Plan usage */}
          {profile && (
            <Card glass>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Plan Usage</CardTitle>
                  <Badge variant="premium">
                    {profile.plan === 'free' ? 'Trial' : profile.plan}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Emails sent</span>
                    <span>{formatNumber(stats.totalSent)} / {profile.plan === 'business' ? '∞' : '500'}</span>
                  </div>
                  <Progress
                    value={profile.plan === 'business' ? 0 : Math.min(100, (stats.totalSent / 500) * 100)}
                    gradient
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Prospects</span>
                    <span>{formatNumber(totalProspects)} / {profile.plan === 'business' ? '∞' : '500'}</span>
                  </div>
                  <Progress
                    value={profile.plan === 'business' ? 0 : Math.min(100, (totalProspects / 500) * 100)}
                    gradient
                  />
                </div>
                {profile.plan !== 'business' && (
                  <Button variant="gradient" size="sm" className="w-full mt-2" asChild>
                    <Link href="/settings/billing">Upgrade Plan</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Cross-sell Banner */}
      <motion.div variants={item}>
        <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Target className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Boost your reply rates with LinkedIn</p>
              <p className="text-xs text-muted-foreground">Pair email outreach with LinkedIn messages — try Opsiflo LinkedIn</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="flex-shrink-0">
            Learn More
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
