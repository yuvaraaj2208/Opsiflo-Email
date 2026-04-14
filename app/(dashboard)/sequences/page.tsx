'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GitBranch, Plus, Mail, ExternalLink, Share2, Clock, CheckSquare, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const SEQUENCE_TEMPLATES = [
  {
    name: 'SaaS Demo Request',
    steps: [
      { type: 'email', label: 'Cold Email', delay: 0 },
      { type: 'wait', label: 'Wait 3 days', delay: 3 },
      { type: 'email', label: 'Follow-up (opened, no reply)', delay: 0 },
      { type: 'wait', label: 'Wait 4 days', delay: 4 },
      { type: 'linkedin', label: 'LinkedIn Connection', delay: 0 },
      { type: 'wait', label: 'Wait 3 days', delay: 3 },
      { type: 'email', label: 'Final follow-up', delay: 0 },
    ],
  },
  {
    name: 'Partnership Pitch',
    steps: [
      { type: 'email', label: 'Partnership intro email', delay: 0 },
      { type: 'wait', label: 'Wait 5 days', delay: 5 },
      { type: 'linkedin', label: 'LinkedIn message', delay: 0 },
      { type: 'wait', label: 'Wait 3 days', delay: 3 },
      { type: 'email', label: 'Follow-up with case study', delay: 0 },
    ],
  },
]

const stepIcons = {
  email: { icon: Mail, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  linkedin: { icon: ExternalLink, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  twitter: { icon: Share2, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
  wait: { icon: Clock, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  task: { icon: CheckSquare, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
}

export default function SequencesPage() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Sequences</h1>
          <p className="text-muted-foreground mt-1">Multi-step automated outreach flows</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Build Sequence
        </Button>
      </div>

      <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4 flex items-center gap-3">
        <GitBranch className="h-5 w-5 text-indigo-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-indigo-300">Multi-Channel Sequences — Pro & Premium Feature</p>
          <p className="text-xs text-slate-400 mt-0.5">Combine email, LinkedIn, Twitter, and manual tasks in a single automated flow with branch logic</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Sequence Templates</h3>
        {SEQUENCE_TEMPLATES.map((seq) => (
          <Card key={seq.name} glass>
            <CardContent className="p-5">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpanded(expanded === seq.name ? null : seq.name)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <GitBranch className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{seq.name}</h3>
                    <p className="text-xs text-muted-foreground">{seq.steps.length} steps</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm">Use Template</Button>
                  {expanded === seq.name ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </div>

              {expanded === seq.name && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-white/5"
                >
                  <div className="space-y-2">
                    {seq.steps.map((step, idx) => {
                      const stepInfo = stepIcons[step.type as keyof typeof stepIcons]
                      const Icon = stepInfo.icon
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg border ${stepInfo.color} flex-shrink-0`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-1 h-px bg-white/5" />
                          <div className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${stepInfo.color}`}>
                            {step.label}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
