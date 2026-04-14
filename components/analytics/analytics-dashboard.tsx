'use client'

import { motion } from 'framer-motion'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, FunnelChart, Funnel, LabelList
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, TrendingUp, MessageSquare, MousePointer, Users, ArrowDownRight } from 'lucide-react'
import type { Campaign, EmailEvent } from '@/types'
import { formatNumber } from '@/lib/utils'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

interface AnalyticsDashboardProps {
  campaigns: Campaign[]
  events: EmailEvent[]
}

export function AnalyticsDashboard({ campaigns, events }: AnalyticsDashboardProps) {
  // Aggregate stats
  const totalStats = campaigns.reduce(
    (acc, c) => {
      const stats = Array.isArray(c.campaign_stats) ? c.campaign_stats[0] : c.campaign_stats
      if (!stats) return acc
      return {
        sent: acc.sent + (stats.total_sent ?? 0),
        delivered: acc.delivered + (stats.delivered ?? 0),
        bounced: acc.bounced + (stats.bounced ?? 0),
        opens: acc.opens + (stats.unique_opens ?? 0),
        clicks: acc.clicks + (stats.clicks ?? 0),
        replies: acc.replies + (stats.replies ?? 0),
        unsubscribes: acc.unsubscribes + (stats.unsubscribes ?? 0),
        meetings: acc.meetings + (stats.meetings_booked ?? 0),
        revenue: acc.revenue + (stats.revenue_attributed ?? 0),
      }
    },
    { sent: 0, delivered: 0, bounced: 0, opens: 0, clicks: 0, replies: 0, unsubscribes: 0, meetings: 0, revenue: 0 }
  )

  const openRate = totalStats.sent > 0 ? ((totalStats.opens / totalStats.sent) * 100).toFixed(1) : '0'
  const replyRate = totalStats.sent > 0 ? ((totalStats.replies / totalStats.sent) * 100).toFixed(1) : '0'
  const clickRate = totalStats.sent > 0 ? ((totalStats.clicks / totalStats.sent) * 100).toFixed(1) : '0'
  const bounceRate = totalStats.sent > 0 ? ((totalStats.bounced / totalStats.sent) * 100).toFixed(1) : '0'

  // Events over time (last 30 days)
  const now = Date.now()
  const eventsByDay: Record<string, { opens: number; replies: number; clicks: number }> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000)
    const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    eventsByDay[key] = { opens: 0, replies: 0, clicks: 0 }
  }

  events.forEach((event) => {
    const d = new Date(event.occurred_at)
    const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    if (eventsByDay[key]) {
      if (event.event_type === 'opened') eventsByDay[key].opens++
      if (event.event_type === 'replied') eventsByDay[key].replies++
      if (event.event_type === 'clicked') eventsByDay[key].clicks++
    }
  })

  const timeSeriesData = Object.entries(eventsByDay).map(([date, data]) => ({
    date,
    ...data,
  }))

  // Funnel data
  const funnelData = [
    { name: 'Sent', value: totalStats.sent, fill: '#6366f1' },
    { name: 'Opened', value: totalStats.opens, fill: '#8b5cf6' },
    { name: 'Clicked', value: totalStats.clicks, fill: '#06b6d4' },
    { name: 'Replied', value: totalStats.replies, fill: '#10b981' },
    { name: 'Meetings', value: totalStats.meetings, fill: '#f59e0b' },
  ]

  const statCards = [
    { label: 'Total Sent', value: formatNumber(totalStats.sent), icon: Mail, color: 'text-indigo-400', bg: 'from-indigo-500/20' },
    { label: 'Open Rate', value: openRate + '%', icon: TrendingUp, color: 'text-emerald-400', bg: 'from-emerald-500/20', benchmark: '21%' },
    { label: 'Reply Rate', value: replyRate + '%', icon: MessageSquare, color: 'text-purple-400', bg: 'from-purple-500/20', benchmark: '8%' },
    { label: 'Click Rate', value: clickRate + '%', icon: MousePointer, color: 'text-cyan-400', bg: 'from-cyan-500/20' },
    { label: 'Bounce Rate', value: bounceRate + '%', icon: ArrowDownRight, color: 'text-red-400', bg: 'from-red-500/20' },
    { label: 'Meetings Booked', value: formatNumber(totalStats.meetings), icon: Users, color: 'text-amber-400', bg: 'from-amber-500/20' },
  ]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-muted-foreground mt-1">Performance across {campaigns.length} campaigns</p>
      </motion.div>

      {/* Stats grid */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} glass className="relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} to-transparent opacity-50`} />
              <CardContent className="p-4 relative">
                <Icon className={`h-4 w-4 ${stat.color} mb-2`} />
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
                {'benchmark' in stat && stat.benchmark && (
                  <div className="text-xs text-muted-foreground mt-0.5">Avg: {stat.benchmark}</div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card glass>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Activity Over Time (30 days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    interval="preserveStartEnd"
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Line type="monotone" dataKey="opens" stroke="#6366f1" strokeWidth={2} dot={false} name="Opens" />
                  <Line type="monotone" dataKey="replies" stroke="#10b981" strokeWidth={2} dot={false} name="Replies" />
                  <Line type="monotone" dataKey="clicks" stroke="#06b6d4" strokeWidth={2} dot={false} name="Clicks" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card glass>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Engagement Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {funnelData.map((item, idx) => {
                  const percentage = totalStats.sent > 0 ? ((item.value / totalStats.sent) * 100).toFixed(1) : '0'
                  const widthPercent = totalStats.sent > 0 ? Math.max(5, (item.value / totalStats.sent) * 100) : 5
                  return (
                    <div key={item.name}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-300">{item.name}</span>
                        <span className="text-white font-medium">{formatNumber(item.value)} ({percentage}%)</span>
                      </div>
                      <div className="h-6 bg-white/5 rounded-md overflow-hidden">
                        <motion.div
                          className="h-full rounded-md"
                          style={{ backgroundColor: item.fill }}
                          initial={{ width: 0 }}
                          animate={{ width: `${widthPercent}%` }}
                          transition={{ delay: idx * 0.1, duration: 0.6 }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Campaign performance table */}
      <motion.div variants={item}>
        <Card glass>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {campaigns.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No sent campaigns yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['Campaign', 'Sent', 'Open Rate', 'Reply Rate', 'Click Rate', 'Meetings'].map((h) => (
                        <th key={h} className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((c) => {
                      const s = Array.isArray(c.campaign_stats) ? c.campaign_stats[0] : c.campaign_stats
                      const sent = s?.total_sent ?? 0
                      return (
                        <tr key={c.id} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                          <td className="py-2.5 px-3 font-medium text-white">{c.name}</td>
                          <td className="py-2.5 px-3 text-slate-300">{formatNumber(sent)}</td>
                          <td className="py-2.5 px-3 text-emerald-400">
                            {sent > 0 ? (((s?.unique_opens ?? 0) / sent) * 100).toFixed(1) : '0'}%
                          </td>
                          <td className="py-2.5 px-3 text-purple-400">
                            {sent > 0 ? (((s?.replies ?? 0) / sent) * 100).toFixed(1) : '0'}%
                          </td>
                          <td className="py-2.5 px-3 text-cyan-400">
                            {sent > 0 ? (((s?.clicks ?? 0) / sent) * 100).toFixed(1) : '0'}%
                          </td>
                          <td className="py-2.5 px-3 text-amber-400">{s?.meetings_booked ?? 0}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
