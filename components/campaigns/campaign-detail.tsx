'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, Play, Pause, ArrowLeft, BarChart2, MessageSquare, Users, Clock, TestTube } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Campaign, EmailEvent, Reply } from '@/types'
import { formatNumber, formatRelativeTime, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

const statusColors = {
  draft: 'secondary', scheduled: 'warning', sending: 'info', sent: 'success', paused: 'outline',
} as const

interface CampaignDetailProps {
  campaign: Campaign
  events: EmailEvent[]
  replies: Reply[]
}

export function CampaignDetail({ campaign, events, replies }: CampaignDetailProps) {
  const [testEmail, setTestEmail] = useState('')
  const [sendingTest, setSendingTest] = useState(false)

  const stats = Array.isArray(campaign.campaign_stats) ? campaign.campaign_stats[0] : campaign.campaign_stats

  const sent = stats?.total_sent ?? 0
  const openRate = sent > 0 ? ((stats?.unique_opens ?? 0) / sent * 100).toFixed(1) : '0'
  const replyRate = sent > 0 ? ((stats?.replies ?? 0) / sent * 100).toFixed(1) : '0'
  const clickRate = sent > 0 ? ((stats?.clicks ?? 0) / sent * 100).toFixed(1) : '0'

  const handleSendTest = async () => {
    if (!testEmail) { toast.error('Enter an email address'); return }
    setSendingTest(true)
    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: campaign.id, testEmail }),
      })
      if (res.ok) {
        toast.success(`Test email sent to ${testEmail}!`)
      } else {
        toast.error('Failed to send test email')
      }
    } catch {
      toast.error('Failed to send test email')
    } finally {
      setSendingTest(false)
    }
  }

  const statCards = [
    { label: 'Sent', value: formatNumber(sent), color: 'text-indigo-400' },
    { label: 'Open Rate', value: openRate + '%', color: 'text-emerald-400' },
    { label: 'Reply Rate', value: replyRate + '%', color: 'text-purple-400' },
    { label: 'Click Rate', value: clickRate + '%', color: 'text-cyan-400' },
    { label: 'Bounced', value: formatNumber(stats?.bounced ?? 0), color: 'text-red-400' },
    { label: 'Unsubscribed', value: formatNumber(stats?.unsubscribes ?? 0), color: 'text-yellow-400' },
  ]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item}>
        <Link href="/campaigns" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white mb-4 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Campaigns
        </Link>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{campaign.name}</h1>
            <Badge variant={statusColors[campaign.status]}>{campaign.status}</Badge>
            {campaign.industry && (
              <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">{campaign.industry}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {campaign.status === 'draft' && (
              <Button variant="outline">
                <Play className="h-4 w-4 mr-2" />
                Start Campaign
              </Button>
            )}
            {campaign.status === 'sending' && (
              <Button variant="outline">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} glass>
            <CardContent className="p-4 text-center">
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={item}>
        <Tabs defaultValue="email">
          <TabsList>
            <TabsTrigger value="email"><Mail className="h-3.5 w-3.5 mr-1.5" />Email Content</TabsTrigger>
            <TabsTrigger value="analytics"><BarChart2 className="h-3.5 w-3.5 mr-1.5" />Activity</TabsTrigger>
            <TabsTrigger value="replies"><MessageSquare className="h-3.5 w-3.5 mr-1.5" />Replies ({replies.length})</TabsTrigger>
            <TabsTrigger value="test"><TestTube className="h-3.5 w-3.5 mr-1.5" />Test</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="mt-4">
            <Card glass>
              <CardContent className="p-5 space-y-4">
                <div className="rounded-lg bg-white/5 p-4">
                  <div className="text-xs text-muted-foreground mb-1">Subject</div>
                  <p className="font-medium text-white">{campaign.subject || '(No subject set)'}</p>
                </div>
                <div className="rounded-lg bg-white/5 p-4">
                  <div className="text-xs text-muted-foreground mb-2">Body</div>
                  <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {campaign.body || '(No body set)'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <Card glass>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {events.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No activity yet</p>
                ) : (
                  <div className="space-y-2">
                    {events.map((event) => (
                      <div key={event.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/3">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          event.event_type === 'opened' ? 'bg-emerald-400' :
                          event.event_type === 'replied' ? 'bg-purple-400' :
                          event.event_type === 'clicked' ? 'bg-cyan-400' :
                          event.event_type === 'bounced' ? 'bg-red-400' : 'bg-muted-foreground'
                        }`} />
                        <span className="text-sm text-slate-300 capitalize">{event.event_type}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{formatRelativeTime(event.occurred_at)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="replies" className="mt-4">
            <Card glass>
              <CardContent className="p-5">
                {replies.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No replies yet</p>
                ) : (
                  <div className="space-y-3">
                    {replies.map((reply) => (
                      <div key={reply.id} className="p-4 rounded-lg bg-white/3 border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white">
                            {(reply.prospect as { email?: string } | null)?.email || 'Unknown'}
                          </span>
                          <span className="text-xs text-muted-foreground">{formatRelativeTime(reply.received_at)}</span>
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-3">{reply.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test" className="mt-4">
            <Card glass>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Send Test Email</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Send a test email to yourself to see exactly what your prospects will receive.
                </p>
                <div className="space-y-1.5">
                  <Label>Test Email Address</Label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                  />
                </div>
                <Button loading={sendingTest} onClick={handleSendTest}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Test Email
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
