'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, RefreshCw, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { INDUSTRIES } from '@/types'
import { toast } from 'sonner'

const prospectRoles = [
  'CEO', 'CTO', 'CMO', 'CFO', 'VP of Sales', 'VP of Marketing',
  'Head of Engineering', 'Product Manager', 'Sales Director', 'Marketing Manager',
  'HR Manager', 'Recruiter', 'Operations Manager', 'Business Development Manager',
  'Founder', 'Co-Founder', 'Investor', 'Procurement Manager',
]

interface DemoEmail {
  subject: string
  body: string
  score: number
  tone: string
}

export function LiveDemoWidget() {
  const [industry, setIndustry] = useState('')
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DemoEmail | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!industry || !role) {
      toast.error('Please select an industry and prospect role')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/ai/demo-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry, role }),
      })

      if (!response.ok) throw new Error('Failed to generate')

      const data = await response.json()
      setResult(data)
    } catch {
      toast.error('Failed to generate demo email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(`Subject: ${result.subject}\n\n${result.body}`)
    setCopied(true)
    toast.success('Email copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-white/5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <Label className="mb-2 block">Target Industry</Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.slice(0, 20).map((ind) => (
                  <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-1">
            <Label className="mb-2 block">Prospect Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {prospectRoles.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              className="w-full"
              loading={loading}
              onClick={handleGenerate}
              disabled={!industry || !role}
            >
              <Zap className="h-4 w-4 mr-2" />
              Generate Email
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <p className="text-muted-foreground text-sm">AI is crafting your personalized email...</p>
          </motion.div>
        )}

        {result && !loading && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  <span className="text-xs font-medium text-emerald-400">{result.tone}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                  <span className="text-xs font-medium text-indigo-400">
                    Prediction Score: {result.score}/100
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleGenerate} loading={loading}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Regenerate
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg bg-white/5 p-4">
                <div className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wide font-medium">Subject Line</div>
                <p className="text-white font-medium">{result.subject}</p>
              </div>
              <div className="rounded-lg bg-white/5 p-4">
                <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">Email Body</div>
                <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {result.body}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                ✨ This is a demo — sign up to unlock 3 variants with full prediction analysis
              </p>
              <Button size="sm" asChild>
                <a href="/signup">Get Full Access →</a>
              </Button>
            </div>
          </motion.div>
        )}

        {!result && !loading && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 text-center"
          >
            <div className="w-14 h-14 bg-indigo-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Zap className="h-7 w-7 text-indigo-400" />
            </div>
            <p className="text-muted-foreground text-sm">
              Select an industry and role above, then click Generate to see AI in action
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
