'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, RefreshCw, Zap, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn, getScoreColor, getScoreLabel } from '@/lib/utils'
import { toast } from 'sonner'

interface PredictionBreakdown {
  factor: string
  impact: 'positive' | 'negative' | 'neutral'
  score: number
  suggestion?: string
}

interface Prediction {
  overall_score: number
  label: string
  breakdown: PredictionBreakdown[]
}

interface ResponsePredictionScoreProps {
  subject: string
  body: string
  prospectIndustry: string
  prospectRole: string
  onEmailUpdate?: (update: { subject?: string; body?: string }) => void
}

const scoreLabels = {
  unlikely: { text: 'Unlikely', color: 'text-red-400', bg: 'bg-red-500/20' },
  possible: { text: 'Possible', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  likely: { text: 'Likely', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  high_chance: { text: 'High Chance', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
}

export function ResponsePredictionScore({
  subject: initialSubject,
  body: initialBody,
  prospectIndustry,
  prospectRole,
  onEmailUpdate,
}: ResponsePredictionScoreProps) {
  const [subject, setSubject] = useState(initialSubject)
  const [body, setBody] = useState(initialBody)
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Auto-analyze on mount
    analyzePrediction()
  }, [])

  const analyzePrediction = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/predict-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          body,
          prospectIndustry,
          prospectRole,
          wordCount: body.split(/\s+/).length,
        }),
      })

      if (!response.ok) throw new Error('Analysis failed')

      const data = await response.json()
      setPrediction(data)
    } catch {
      toast.error('Failed to analyze response prediction')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = () => {
    if (onEmailUpdate) {
      onEmailUpdate({ subject, body })
    }
    analyzePrediction()
  }

  const score = prediction?.overall_score ?? 0
  const label = prediction?.label ?? 'unlikely'
  const labelInfo = scoreLabels[label as keyof typeof scoreLabels] ?? scoreLabels.unlikely

  // Calculate stroke dashoffset for gauge
  const circumference = 2 * Math.PI * 45
  const dashOffset = circumference - (score / 100) * circumference

  return (
    <div className="space-y-5">
      {/* Score gauge */}
      <Card glass className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-8">
            {/* Gauge */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle
                  cx="50" cy="50" r="45"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="10"
                />
                <motion.circle
                  cx="50" cy="50" r="45"
                  fill="none"
                  stroke={score >= 75 ? '#10b981' : score >= 50 ? '#6366f1' : score >= 25 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: dashOffset }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="w-12 h-6 bg-white/10 rounded mb-1" />
                    <div className="w-8 h-3 bg-white/5 rounded mx-auto" />
                  </div>
                ) : (
                  <>
                    <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</span>
                    <span className="text-xs text-muted-foreground">/ 100</span>
                  </>
                )}
              </div>
            </div>

            {/* Score details */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${labelInfo.bg} ${labelInfo.color}`}>
                  {loading ? 'Analyzing...' : labelInfo.text}
                </div>
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Response Prediction</span>
              </div>
              <p className="text-sm text-slate-400">
                {loading
                  ? 'AI is analyzing your email across 9+ factors...'
                  : score >= 75
                  ? '🎉 Excellent! This email has a high chance of getting replies.'
                  : score >= 50
                  ? '✅ Good email. A few tweaks could push it higher.'
                  : score >= 25
                  ? '⚠️ Needs improvement. Check the breakdown below for specific fixes.'
                  : '🚨 Low prediction. Significant improvements needed before sending.'}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={analyzePrediction}
                loading={loading}
                className="mt-3"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Re-analyze
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breakdown */}
      {prediction && !loading && (
        <Card glass>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Factor Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {prediction.breakdown.map((factor, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {factor.impact === 'positive' ? (
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    ) : factor.impact === 'negative' ? (
                      <TrendingDown className="h-3.5 w-3.5 text-red-400 flex-shrink-0" />
                    ) : (
                      <Minus className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className="text-sm text-slate-300">{factor.factor}</span>
                  </div>
                  <span className={cn(
                    'text-sm font-medium',
                    factor.impact === 'positive' ? 'text-emerald-400' :
                    factor.impact === 'negative' ? 'text-red-400' : 'text-muted-foreground'
                  )}>
                    {factor.score}/100
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className={cn(
                      'h-full rounded-full',
                      factor.impact === 'positive' ? 'bg-emerald-500' :
                      factor.impact === 'negative' ? 'bg-red-500' : 'bg-slate-500'
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${factor.score}%` }}
                    transition={{ delay: idx * 0.05 + 0.3, duration: 0.5 }}
                  />
                </div>
                {factor.suggestion && (
                  <div className="flex items-start gap-2 text-xs text-muted-foreground mt-1">
                    <Zap className="h-3 w-3 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>{factor.suggestion}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Inline editor */}
      <Card glass>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Edit & Re-analyze</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Subject Line</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Your subject line"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Email Body</Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              placeholder="Your email body"
            />
          </div>
          <Button onClick={handleUpdate} loading={loading} className="w-full">
            <Zap className="h-4 w-4 mr-2" />
            Update & Re-analyze Score
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
