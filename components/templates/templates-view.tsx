'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Plus, Search, Star, ThumbsUp, Eye, Copy, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { Template } from '@/types'
import { toast } from 'sonner'

const INDUSTRY_TEMPLATES = [
  { industry: 'SaaS / Software', subject: 'Quick question about [Company]\'s sales process', body: 'Hi {{first_name}},\n\nI noticed [Company] is growing quickly — congrats on the recent [achievement].\n\nWe help SaaS companies like yours increase demo booking rates by 40% using AI-powered email sequences.\n\n[Company name] went from 8% to 31% reply rate in 2 weeks.\n\nWould it be worth a 15-min chat to see if we could do the same for [Company]?\n\n{{first_name}}, does Thursday or Friday work?\n\nBest,\n{{sender_name}}', industry_tips: 'CEOs respond best to ROI and time-to-value. Avoid technical jargon. Reference a real pain point.', best_time: 'Tuesday 7-9am or Thursday 2-4pm' },
  { industry: 'Recruitment / HR', subject: 'Top candidate for your [Role] opening', body: 'Hi {{first_name}},\n\nI came across [Company]\'s open [role] position and immediately thought of a candidate who might be perfect.\n\n[Candidate name] has [X years] experience in [field] and most recently [achievement at previous company].\n\nThey\'re actively looking and [Company] just came up on their radar.\n\nWould you like me to send over their profile?\n\n{{sender_name}}', industry_tips: 'Recruiters respond to speed and quality. Lead with the candidate, not your pitch.', best_time: 'Monday morning or Wednesday afternoon' },
  { industry: 'Real Estate', subject: '3 properties that match your criteria', body: 'Hi {{first_name}},\n\nI\'ve been following [Company]\'s expansion plans and noticed you might be in the market for [commercial/residential] space in [area].\n\nI have 3 properties that match exactly what companies like yours typically look for:\n- [Property 1]\n- [Property 2]\n- [Property 3]\n\nI can arrange viewings this week. Would Tuesday or Wednesday work?\n\n{{sender_name}}', industry_tips: 'Be specific with properties. Real estate buyers want proof, not promises.', best_time: 'Tuesday-Thursday, 10am-2pm' },
]

interface TemplatesViewProps {
  userTemplates: Template[]
  publicTemplates: Template[]
}

export function TemplatesView({ userTemplates, publicTemplates }: TemplatesViewProps) {
  const [search, setSearch] = useState('')
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [selectedIndustry, setSelectedIndustry] = useState<(typeof INDUSTRY_TEMPLATES)[0] | null>(null)

  const filteredPublic = publicTemplates.filter((t) =>
    !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.industry.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Email Templates</h1>
          <p className="text-muted-foreground mt-1">Industry-optimized templates and your saved library</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <Tabs defaultValue="industry">
        <TabsList>
          <TabsTrigger value="industry">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Industry Templates
          </TabsTrigger>
          <TabsTrigger value="community">
            <Star className="h-3.5 w-3.5 mr-1.5" />
            Community
          </TabsTrigger>
          <TabsTrigger value="mine">
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            My Templates ({userTemplates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="industry" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INDUSTRY_TEMPLATES.map((template) => (
              <Card key={template.industry} glass className="hover:border-indigo-500/30 transition-all cursor-pointer group" onClick={() => setSelectedIndustry(template)}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary">{template.industry}</Badge>
                    <Eye className="h-4 w-4 text-muted-foreground group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <h3 className="font-medium text-white mb-2 line-clamp-2">
                    {template.subject}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {template.body}
                  </p>
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
                    <div className="text-xs text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                      Best time: {template.best_time}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Locked templates for non-premium */}
            {['Finance / Fintech', 'Healthcare', 'E-commerce', 'Consulting', 'EdTech', 'Marketing Agency'].map((ind) => (
              <Card key={ind} glass className="opacity-60 cursor-not-allowed">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary">{ind}</Badge>
                    <Badge variant="premium">Premium</Badge>
                  </div>
                  <div className="h-4 bg-white/10 rounded mb-2 w-3/4" />
                  <div className="space-y-1.5">
                    <div className="h-3 bg-white/5 rounded w-full" />
                    <div className="h-3 bg-white/5 rounded w-5/6" />
                    <div className="h-3 bg-white/5 rounded w-4/6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="community" className="mt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search community templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {filteredPublic.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No community templates yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPublic.map((template) => (
                <Card key={template.id} glass className="hover:border-indigo-500/30 transition-all cursor-pointer" onClick={() => setPreviewTemplate(template)}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{template.industry}</Badge>
                      <div className="flex items-center gap-1 text-xs text-amber-400">
                        <ThumbsUp className="h-3 w-3" />
                        {template.upvotes}
                      </div>
                    </div>
                    <h3 className="font-medium text-white mb-1">{template.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{template.subject}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="mine" className="mt-4">
          {userTemplates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground mb-4">No saved templates yet</p>
              <Button><Plus className="h-4 w-4 mr-2" /> Create Template</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userTemplates.map((template) => (
                <Card key={template.id} glass className="hover:border-indigo-500/30 transition-all cursor-pointer" onClick={() => setPreviewTemplate(template)}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{template.industry}</Badge>
                    </div>
                    <h3 className="font-medium text-white">{template.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{template.subject}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Industry template preview modal */}
      <Dialog open={!!selectedIndustry} onOpenChange={() => setSelectedIndustry(null)}>
        <DialogContent className="max-w-2xl">
          {selectedIndustry && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedIndustry.industry} Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="rounded-lg bg-white/5 p-4">
                  <div className="text-xs text-muted-foreground mb-1">Subject</div>
                  <p className="text-sm font-medium text-white">{selectedIndustry.subject}</p>
                </div>
                <div className="rounded-lg bg-white/5 p-4">
                  <div className="text-xs text-muted-foreground mb-2">Body</div>
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                    {selectedIndustry.body}
                  </pre>
                </div>
                <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-4">
                  <div className="text-xs font-medium text-emerald-400 mb-1">Industry Tips</div>
                  <p className="text-sm text-slate-300">{selectedIndustry.industry_tips}</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      toast.success('Template copied to clipboard!')
                      setSelectedIndustry(null)
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Use This Template
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
