'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Mail, Search, Filter, MoreHorizontal, Play, Pause, Trash2, BarChart2, Copy } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Campaign } from '@/types'
import { formatRelativeTime, formatNumber } from '@/lib/utils'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const statusColors = {
  draft: 'secondary',
  scheduled: 'warning',
  sending: 'info',
  sent: 'success',
  paused: 'outline',
} as const

interface CampaignsListViewProps {
  campaigns: Campaign[]
}

export function CampaignsListView({ campaigns: initialCampaigns }: CampaignsListViewProps) {
  const [campaigns, setCampaigns] = useState(initialCampaigns)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const router = useRouter()

  const filtered = campaigns.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('campaigns').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete campaign')
      return
    }
    setCampaigns(campaigns.filter((c) => c.id !== id))
    toast.success('Campaign deleted')
  }

  const handleDuplicate = async (campaign: Campaign) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('campaigns').insert({
      name: `${campaign.name} (Copy)`,
      status: 'draft',
      industry: campaign.industry,
      subject: campaign.subject,
      body: campaign.body,
    }).select().single()

    if (error) {
      toast.error('Failed to duplicate campaign')
      return
    }

    setCampaigns([data as Campaign, ...campaigns])
    toast.success('Campaign duplicated')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Campaigns</h1>
          <p className="text-muted-foreground mt-1">{campaigns.length} total campaigns</p>
        </div>
        <Button asChild>
          <Link href="/campaigns/new">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'draft', 'scheduled', 'sending', 'sent', 'paused'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === status
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-muted-foreground hover:text-white hover:bg-white/5'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {search ? 'No campaigns found' : 'No campaigns yet'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {search ? 'Try a different search term' : 'Create your first AI-powered campaign to get started'}
          </p>
          {!search && (
            <Button asChild>
              <Link href="/campaigns/new">
                <Plus className="h-4 w-4 mr-2" />
                Create First Campaign
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((campaign, idx) => {
            const stats = Array.isArray(campaign.campaign_stats)
              ? campaign.campaign_stats[0]
              : campaign.campaign_stats

            const sent = stats?.total_sent ?? 0
            const opens = stats?.unique_opens ?? 0
            const replies = stats?.replies ?? 0
            const openRate = sent > 0 ? ((opens / sent) * 100).toFixed(1) : '0'
            const replyRate = sent > 0 ? ((replies / sent) * 100).toFixed(1) : '0'

            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card rounded-xl p-5 hover:border-indigo-500/20 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-indigo-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="font-semibold text-white hover:text-indigo-300 transition-colors truncate"
                      >
                        {campaign.name}
                      </Link>
                      <Badge variant={statusColors[campaign.status]}>
                        {campaign.status}
                      </Badge>
                      {campaign.industry && (
                        <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">
                          {campaign.industry}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {campaign.subject ? `Subject: ${campaign.subject}` : 'No subject set'} •{' '}
                      {formatRelativeTime(campaign.created_at)}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="hidden lg:flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-white">{formatNumber(sent)}</div>
                      <div className="text-xs text-muted-foreground">Sent</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-emerald-400">{openRate}%</div>
                      <div className="text-xs text-muted-foreground">Opens</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-purple-400">{replyRate}%</div>
                      <div className="text-xs text-muted-foreground">Replies</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-white">{replies}</div>
                      <div className="text-xs text-muted-foreground">Replies</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/campaigns/${campaign.id}`}>
                        <BarChart2 className="h-4 w-4" />
                      </Link>
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/campaigns/${campaign.id}`}>
                            <BarChart2 className="h-4 w-4 mr-2" />
                            View Analytics
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(campaign)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        {campaign.status === 'sending' && (
                          <DropdownMenuItem>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </DropdownMenuItem>
                        )}
                        {campaign.status === 'paused' && (
                          <DropdownMenuItem>
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-400 focus:text-red-400"
                          onClick={() => handleDelete(campaign.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
