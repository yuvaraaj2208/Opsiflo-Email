'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Users, FileText, Send, CheckCircle, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'

const steps = [
  {
    id: 1,
    title: 'Connect your email',
    description: 'Link your Gmail or Outlook account for two-way sync',
    icon: Mail,
    href: '/settings',
    cta: 'Connect Email',
  },
  {
    id: 2,
    title: 'Import prospects',
    description: 'Upload a CSV or add contacts manually',
    icon: Users,
    href: '/prospects/import',
    cta: 'Import CSV',
  },
  {
    id: 3,
    title: 'Pick an industry template',
    description: 'Choose from 50+ AI-optimized templates',
    icon: FileText,
    href: '/templates',
    cta: 'Browse Templates',
  },
  {
    id: 4,
    title: 'Create your first campaign',
    description: 'AI writes personalized emails that predict reply rates',
    icon: FileText,
    href: '/campaigns/new',
    cta: 'Create Campaign',
  },
  {
    id: 5,
    title: 'Send a test email',
    description: 'Preview exactly what your prospect will see',
    icon: Send,
    href: '/campaigns/new',
    cta: 'Send Test',
  },
]

export function OnboardingWizard() {
  const [completed, setCompleted] = useState<number[]>([])
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const completedCount = completed.length
  const progress = (completedCount / steps.length) * 100

  return (
    <Card glass className="border-indigo-500/20">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-white">Get started with Opsiflo Email</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Complete {steps.length - completedCount} more steps to unlock 5 bonus AI credits
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-white">{completedCount}/{steps.length}</div>
              <div className="text-xs text-muted-foreground">steps done</div>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="text-xs text-muted-foreground hover:text-white transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>

        <Progress value={progress} gradient className="mb-4" />

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {steps.map((step) => {
            const Icon = step.icon
            const isDone = completed.includes(step.id)
            return (
              <motion.div
                key={step.id}
                whileHover={{ scale: 1.02 }}
                className={`rounded-lg p-3 border cursor-pointer transition-all ${
                  isDone
                    ? 'bg-emerald-500/10 border-emerald-500/20'
                    : 'bg-white/3 border-white/10 hover:border-indigo-500/30'
                }`}
                onClick={() => {
                  if (!isDone) {
                    setCompleted([...completed, step.id])
                  }
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {isDone ? (
                    <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0" />
                  )}
                  <span className="text-xs font-medium text-white truncate">{step.title}</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed hidden sm:block">
                  {step.description}
                </p>
                {!isDone && (
                  <Link
                    href={step.href}
                    className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 mt-2 group"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {step.cta}
                    <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                )}
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
