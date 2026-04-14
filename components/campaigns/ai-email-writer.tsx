'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, RefreshCw, Lock, Unlock, Eye, EyeOff, AlertTriangle, Check,
  ChevronDown, ToggleLeft, ToggleRight, Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { detectSpamWords, getReadabilityScore, countWords, estimateReadTime } from '@/lib/utils'

interface EmailVariant {
  subject: string
  body: string
  ps_line?: string
  predicted_open_rate: number
  tone: string
}

interface AIEmailWriterProps {
  setup: {
    industry: string
    senderName: string
    company: string
    product: string
    prospectRole: string
    goal: string
  }
  onSelect: (email: { subject: string; body: string; ps_line?: string }) => void
}

export function AIEmailWriter({ setup, onSelect }: AIEmailWriterProps) {
  const [variants, setVariants] = useState<EmailVariant[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [lockedSections, setLockedSections] = useState<Record<string, boolean>>({})
  const [includeEmoji, setIncludeEmoji] = useState(false)
  const [editingVariant, setEditingVariant] = useState<EmailVariant | null>(null)
  const [streamText, setStreamText] = useState('')

  const handleGenerate = async () => {
    setLoading(true)
    setVariants([])
    setStreamText('')
    setSelectedIdx(null)

    try {
      const response = await fetch('/api/ai/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: setup.industry,
          senderName: setup.senderName,
          company: setup.company,
          product: setup.product,
          prospectRole: setup.prospectRole,
          goal: setup.goal,
          includeEmoji,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to generate')
      }

      const data = await response.json()
      setVariants(data.variants || [])
    } catch (error) {
      toast.error('Failed to generate emails. Check your AI settings.')
    } finally {
      setLoading(false)
    }
  }

  const toneColors: Record<string, string> = {
    Professional: 'text-blue-400 bg-blue-500/10',
    Friendly: 'text-emerald-400 bg-emerald-500/10',
    Bold: 'text-orange-400 bg-orange-500/10',
  }

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex items-center justify-between glass-card rounded-xl p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={includeEmoji}
              onCheckedChange={setIncludeEmoji}
              id="emoji-toggle"
            />
            <Label htmlFor="emoji-toggle" className="text-sm">Emoji in subject</Label>
          </div>
        </div>
        <Button onClick={handleGenerate} loading={loading} disabled={loading}>
          <Zap className="h-4 w-4 mr-2" />
          {variants.length > 0 ? 'Regenerate All' : 'Generate 3 Variants'}
        </Button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm text-muted-foreground">AI is writing your emails...</span>
          </div>
          {streamText && (
            <div className="text-xs text-muted-foreground font-mono bg-white/3 rounded-lg p-3 max-h-32 overflow-y-auto">
              {streamText}
              <span className="cursor-blink">|</span>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && variants.length === 0 && (
        <div className="glass-card rounded-xl p-10 text-center">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-indigo-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">Ready to generate</h3>
          <p className="text-sm text-muted-foreground mb-5">
            Click Generate to get 3 AI-crafted email variants with predicted open rates
          </p>
          <Button onClick={handleGenerate}>
            <Zap className="h-4 w-4 mr-2" />
            Generate 3 Variants
          </Button>
        </div>
      )}

      {/* Variants */}
      {!loading && variants.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select the variant you like most. You can edit inline before finalizing.
          </p>
          {variants.map((variant, idx) => {
            const isSelected = selectedIdx === idx
            const spamWords = detectSpamWords(variant.body + ' ' + variant.subject)
            const readability = getReadabilityScore(variant.body)
            const wordCount = countWords(variant.body)

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-xl border p-5 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-indigo-500/50 bg-indigo-500/5'
                    : 'border-white/10 bg-white/3 hover:border-white/20'
                }`}
                onClick={() => setSelectedIdx(isSelected ? null : idx)}
              >
                {/* Variant header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-white/20'
                    }`}>
                      {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                    </div>
                    <span className="font-medium text-white">Variant {idx + 1}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${toneColors[variant.tone] || 'text-muted-foreground bg-white/5'}`}>
                      {variant.tone}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-400">{variant.predicted_open_rate}%</div>
                      <div className="text-xs text-muted-foreground">predicted opens</div>
                    </div>
                  </div>
                </div>

                {/* Email preview */}
                <div className="space-y-3">
                  <div className="rounded-lg bg-white/5 p-3">
                    <div className="text-xs text-muted-foreground mb-1">Subject Line</div>
                    <p className="text-sm font-medium text-white">{variant.subject}</p>
                  </div>
                  <div className="rounded-lg bg-white/5 p-3">
                    <div className="text-xs text-muted-foreground mb-2">Email Body</div>
                    <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed line-clamp-4">
                      {variant.body}
                    </p>
                  </div>
                  {variant.ps_line && (
                    <div className="rounded-lg bg-white/5 p-3">
                      <span className="text-xs text-muted-foreground">P.S. </span>
                      <span className="text-sm text-slate-300">{variant.ps_line}</span>
                    </div>
                  )}
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-muted-foreground">Words:</span>
                    <span className="text-white">{wordCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-muted-foreground">Read time:</span>
                    <span className="text-white">{estimateReadTime(variant.body)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-muted-foreground">Readability:</span>
                    <span className={`font-medium ${readability.grade >= 6 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                      {readability.label}
                    </span>
                  </div>
                  {spamWords.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-red-400">
                      <AlertTriangle className="h-3 w-3" />
                      <span>{spamWords.length} spam word{spamWords.length > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>

                {/* Select button */}
                {isSelected && (
                  <div className="mt-4">
                    <Button
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelect(variant)
                      }}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Use This Variant — Check Response Score
                    </Button>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
