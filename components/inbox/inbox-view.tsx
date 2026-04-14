'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Inbox, Search, Tag, MessageSquare, ThumbsUp, ThumbsDown, Bot, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import type { Reply } from '@/types'
import { formatRelativeTime, cn } from '@/lib/utils'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

const sentimentColors = {
  positive: 'success',
  neutral: 'secondary',
  negative: 'destructive',
} as const

const tagColors = {
  interested: 'success',
  not_interested: 'destructive',
  auto_reply: 'secondary',
  bounce: 'destructive',
  question: 'info',
} as const

interface InboxViewProps {
  replies: Reply[]
}

export function InboxView({ replies: initialReplies }: InboxViewProps) {
  const [replies, setReplies] = useState(initialReplies)
  const [search, setSearch] = useState('')
  const [selectedReply, setSelectedReply] = useState<Reply | null>(null)
  const [aiReply, setAiReply] = useState('')
  const [generatingReply, setGeneratingReply] = useState(false)
  const [filter, setFilter] = useState<string>('all')

  const unread = replies.filter((r) => !r.is_read).length

  const filtered = replies.filter((r) => {
    const matchesSearch = search
      ? r.subject?.toLowerCase().includes(search.toLowerCase()) ||
        r.body?.toLowerCase().includes(search.toLowerCase())
      : true
    const matchesFilter = filter === 'all' || r.tag === filter || (filter === 'unread' && !r.is_read)
    return matchesSearch && matchesFilter
  })

  const handleSelectReply = async (reply: Reply) => {
    setSelectedReply(reply)
    setAiReply('')

    if (!reply.is_read) {
      const supabase = createClient()
      await supabase.from('replies').update({ is_read: true }).eq('id', reply.id)
      setReplies(replies.map((r) => r.id === reply.id ? { ...r, is_read: true } : r))
    }
  }

  const handleGenerateAIReply = async () => {
    if (!selectedReply) return
    setGeneratingReply(true)

    try {
      const response = await fetch('/api/ai/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          replyBody: selectedReply.body,
          sentiment: selectedReply.sentiment,
        }),
      })
      const data = await response.json()
      setAiReply(data.reply || '')
    } catch {
      toast.error('Failed to generate AI reply')
    } finally {
      setGeneratingReply(false)
    }
  }

  const handleTagReply = async (replyId: string, tag: string) => {
    const supabase = createClient()
    await supabase.from('replies').update({ tag }).eq('id', replyId)
    setReplies(replies.map((r) => r.id === replyId ? { ...r, tag: tag as Reply['tag'] } : r))
    toast.success('Reply tagged')
  }

  return (
    <div className="space-y-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Inbox
            {unread > 0 && (
              <Badge variant="default" className="text-xs">
                {unread} unread
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">{replies.length} total replies</p>
        </div>
      </div>

      <div className="flex h-[calc(100vh-220px)] gap-4">
        {/* Reply list */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search replies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            {['all', 'unread', 'interested', 'not_interested', 'question'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                  filter === f
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-muted-foreground hover:text-white'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <Inbox className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No replies</p>
              </div>
            ) : (
              filtered.map((reply) => (
                <button
                  key={reply.id}
                  onClick={() => handleSelectReply(reply)}
                  className={cn(
                    'w-full text-left p-3 rounded-xl border transition-all duration-200',
                    selectedReply?.id === reply.id
                      ? 'border-indigo-500/30 bg-indigo-500/10'
                      : reply.is_read
                      ? 'border-white/5 bg-white/3 hover:border-white/10'
                      : 'border-indigo-500/20 bg-white/5 hover:border-indigo-500/30'
                  )}
                >
                  <div className="flex items-start gap-2">
                    <Avatar className="h-7 w-7 flex-shrink-0 mt-0.5">
                      <AvatarFallback className="text-xs">
                        {(reply.prospect as { first_name?: string; email?: string } | null)?.first_name?.[0]?.toUpperCase() ||
                          (reply.prospect as { email?: string } | null)?.email?.[0]?.toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={cn('text-xs font-medium truncate', !reply.is_read ? 'text-white' : 'text-slate-300')}>
                          {(reply.prospect as { first_name?: string; last_name?: string; email?: string } | null)
                            ? [(reply.prospect as { first_name?: string }).first_name, (reply.prospect as { last_name?: string }).last_name].filter(Boolean).join(' ') || (reply.prospect as { email?: string }).email
                            : 'Unknown'}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex-shrink-0">
                          {formatRelativeTime(reply.received_at)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{reply.body?.slice(0, 80)}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {reply.sentiment && (
                          <Badge variant={sentimentColors[reply.sentiment]} className="text-[10px] h-3.5 py-0 px-1">
                            {reply.sentiment}
                          </Badge>
                        )}
                        {reply.tag && (
                          <Badge variant={tagColors[reply.tag as keyof typeof tagColors] ?? 'secondary'} className="text-[10px] h-3.5 py-0 px-1">
                            {reply.tag.replace('_', ' ')}
                          </Badge>
                        )}
                        {!reply.is_read && (
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full ml-auto" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Reply detail */}
        <div className="flex-1 min-w-0">
          {selectedReply ? (
            <Card glass className="h-full flex flex-col overflow-hidden">
              <CardHeader className="pb-3 flex-shrink-0 border-b border-white/5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">{selectedReply.subject}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      From: {
                        (selectedReply.prospect as { email?: string } | null)?.email || 'Unknown'
                      } • {formatRelativeTime(selectedReply.received_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {selectedReply.sentiment && (
                      <Badge variant={sentimentColors[selectedReply.sentiment]}>
                        {selectedReply.sentiment}
                      </Badge>
                    )}
                    {['interested', 'not_interested', 'question'].map((tag) => (
                      <Button
                        key={tag}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTagReply(selectedReply.id, tag)}
                        className={cn(
                          'text-xs h-7',
                          selectedReply.tag === tag ? 'bg-white/10 text-white' : ''
                        )}
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag.replace('_', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                <div className="prose prose-sm max-w-none">
                  <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {selectedReply.body}
                  </div>
                </div>
              </CardContent>

              {/* AI Reply section */}
              <div className="p-4 border-t border-white/5 space-y-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">Reply</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateAIReply}
                    loading={generatingReply}
                  >
                    <Bot className="h-3.5 w-3.5 mr-1.5" />
                    AI Suggest Reply
                  </Button>
                </div>
                <Textarea
                  value={aiReply}
                  onChange={(e) => setAiReply(e.target.value)}
                  placeholder="Write your reply..."
                  rows={4}
                />
                <div className="flex justify-end">
                  <Button size="sm" disabled={!aiReply}>
                    <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Select a reply to view it</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
