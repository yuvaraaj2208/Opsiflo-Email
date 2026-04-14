'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Zap, Users, Target, Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { AIEmailWriter } from '@/components/campaigns/ai-email-writer'
import { ResponsePredictionScore } from '@/components/campaigns/response-prediction'
import { INDUSTRIES } from '@/types'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const steps = [
  { id: 1, label: 'Campaign Setup', icon: Target },
  { id: 2, label: 'AI Email Writer', icon: Zap },
  { id: 3, label: 'Response Score', icon: CheckCircle },
  { id: 4, label: 'Review & Launch', icon: Send },
]

const campaignGoals = [
  { value: 'cold_outreach', label: 'Cold Outreach' },
  { value: 'follow_up', label: 'Follow-Up' },
  { value: 'partnership', label: 'Partnership Pitch' },
  { value: 'sales', label: 'Sales / Demo Request' },
  { value: 'hiring', label: 'Recruiting' },
]

export function CampaignWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [saving, setSaving] = useState(false)

  const [setup, setSetup] = useState({
    name: '',
    industry: '',
    prospectRole: '',
    goal: '',
    senderName: '',
    company: '',
    product: '',
  })

  const [selectedEmail, setSelectedEmail] = useState<{
    subject: string
    body: string
    ps_line?: string
  } | null>(null)

  const canAdvanceStep1 = setup.name && setup.industry && setup.prospectRole && setup.goal && setup.senderName && setup.company && setup.product

  const handleSaveCampaign = async () => {
    if (!selectedEmail) {
      toast.error('Please select an email variant first')
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          name: setup.name,
          status: 'draft',
          industry: setup.industry,
          subject: selectedEmail.subject,
          body: selectedEmail.body,
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Campaign saved! 🎉')
      router.push(`/campaigns/${data.id}`)
    } catch (error) {
      toast.error('Failed to save campaign')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Create New Campaign</h1>
        <p className="text-muted-foreground mt-1">Let AI write your best-ever cold email</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {steps.map((step, idx) => {
          const Icon = step.icon
          const isActive = currentStep === step.id
          const isDone = currentStep > step.id

          return (
            <div key={step.id} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                isActive ? 'bg-indigo-500/20 border border-indigo-500/30' :
                isDone ? 'bg-emerald-500/10 border border-emerald-500/20' :
                'bg-white/5 border border-white/10'
              }`}>
                {isDone ? (
                  <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-muted-foreground'}`} />
                )}
                <span className={`text-xs font-medium hidden sm:block ${
                  isActive ? 'text-white' : isDone ? 'text-emerald-400' : 'text-muted-foreground'
                }`}>
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-px flex-1 ${currentStep > step.id ? 'bg-emerald-500/40' : 'bg-white/10'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Campaign Setup */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card glass>
              <CardContent className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label>Campaign Name</Label>
                    <Input
                      placeholder="e.g. SaaS CEO Outreach Q1"
                      value={setup.name}
                      onChange={(e) => setSetup({ ...setup, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Your Name</Label>
                    <Input
                      placeholder="John Smith"
                      value={setup.senderName}
                      onChange={(e) => setSetup({ ...setup, senderName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Your Company</Label>
                    <Input
                      placeholder="Acme Corp"
                      value={setup.company}
                      onChange={(e) => setSetup({ ...setup, company: e.target.value })}
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <Label>Product / Service</Label>
                    <Input
                      placeholder="e.g. AI-powered sales automation software that increases reply rates by 3x"
                      value={setup.product}
                      onChange={(e) => setSetup({ ...setup, product: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Target Industry</Label>
                    <Select value={setup.industry} onValueChange={(v) => setSetup({ ...setup, industry: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((ind) => (
                          <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Prospect Role / Title</Label>
                    <Input
                      placeholder="e.g. VP of Sales, CEO, Marketing Manager"
                      value={setup.prospectRole}
                      onChange={(e) => setSetup({ ...setup, prospectRole: e.target.value })}
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <Label>Campaign Goal</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {campaignGoals.map((goal) => (
                        <button
                          key={goal.value}
                          onClick={() => setSetup({ ...setup, goal: goal.value })}
                          className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                            setup.goal === goal.value
                              ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                              : 'bg-white/5 border-white/10 text-muted-foreground hover:text-white hover:border-white/20'
                          }`}
                        >
                          {goal.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end mt-4">
              <Button
                onClick={() => setCurrentStep(2)}
                disabled={!canAdvanceStep1}
              >
                Continue to AI Writer
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: AI Email Writer */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <AIEmailWriter
              setup={setup}
              onSelect={(email) => {
                setSelectedEmail(email)
                setCurrentStep(3)
              }}
            />
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Response Prediction */}
        {currentStep === 3 && selectedEmail && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ResponsePredictionScore
              subject={selectedEmail.subject}
              body={selectedEmail.body}
              prospectIndustry={setup.industry}
              prospectRole={setup.prospectRole}
              onEmailUpdate={(update) => setSelectedEmail({ ...selectedEmail, ...update })}
            />
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={() => setCurrentStep(4)}>
                Review Campaign
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Review & Launch */}
        {currentStep === 4 && selectedEmail && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card glass>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-white mb-4">Campaign Summary</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Campaign', value: setup.name },
                      { label: 'Industry', value: setup.industry },
                      { label: 'Target Role', value: setup.prospectRole },
                      { label: 'Goal', value: setup.goal.replace('_', ' ') },
                    ].map((item) => (
                      <div key={item.label} className="rounded-lg bg-white/5 p-3">
                        <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                        <div className="text-sm font-medium text-white capitalize">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white mb-3">Selected Email</h4>
                  <div className="rounded-lg bg-white/5 p-4 space-y-3">
                    <div>
                      <span className="text-xs text-muted-foreground">Subject: </span>
                      <span className="text-sm text-white">{selectedEmail.subject}</span>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Body:</div>
                      <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {selectedEmail.body}
                      </p>
                    </div>
                    {selectedEmail.ps_line && (
                      <div>
                        <span className="text-xs text-muted-foreground">P.S. </span>
                        <span className="text-sm text-slate-300">{selectedEmail.ps_line}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                  <p className="text-sm text-amber-300">
                    <strong>Next step:</strong> After saving, go to the campaign detail page to add prospects and schedule your send.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setCurrentStep(3)}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button loading={saving} onClick={handleSaveCampaign}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Campaign
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
