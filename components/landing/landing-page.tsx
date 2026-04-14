'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Zap, Mail, Target, Clock, GitBranch, BarChart2, Users, MessageSquare,
  ArrowRight, Check, Star, TrendingUp, Shield, Globe2, ChevronDown, Menu, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LiveDemoWidget } from '@/components/landing/live-demo-widget'
import { PricingSection } from '@/components/landing/pricing-section'
import { FAQSection } from '@/components/landing/faq-section'

const features = [
  {
    icon: Target,
    title: 'Response Prediction Score',
    description: 'AI analyzes 9+ factors before you send — get a 0–100 score with specific improvement suggestions. Know your reply rate before clicking send.',
    color: 'from-indigo-500/20 to-indigo-500/5',
    badge: 'Moat Feature',
  },
  {
    icon: Clock,
    title: 'Best Send Time Optimizer',
    description: 'Per-prospect timezone detection + AI recommendations by role. CEOs respond best Tuesday 7–9am. Recruiters on Wednesday 10am–12pm.',
    color: 'from-purple-500/20 to-purple-500/5',
    badge: 'Moat Feature',
  },
  {
    icon: GitBranch,
    title: 'Multi-Channel Sequencing',
    description: 'Drag-and-drop sequence builder with Email, LinkedIn, Twitter, and manual tasks. Branch logic adapts based on prospect behavior.',
    color: 'from-cyan-500/20 to-cyan-500/5',
    badge: 'Moat Feature',
  },
  {
    icon: Mail,
    title: 'AI Email Writer',
    description: '3 subject line variants, 3 email body variants, PS line — all scored by predicted open rate. Spam detector + readability score included.',
    color: 'from-emerald-500/20 to-emerald-500/5',
    badge: 'Core',
  },
  {
    icon: BarChart2,
    title: 'ROI Tracker & Attribution',
    description: 'Track every prospect from first email to closed deal. Revenue attribution, cost per reply, cost per meeting — full deal pipeline.',
    color: 'from-amber-500/20 to-amber-500/5',
    badge: 'Premium',
  },
  {
    icon: Users,
    title: 'Industry-Specific Templates',
    description: '50+ templates with proven formulas for SaaS, Real Estate, Recruiting, and more. Includes industry benchmarks and what NOT to say.',
    color: 'from-rose-500/20 to-rose-500/5',
    badge: 'Premium',
  },
]

const socialProofLogos = ['Microsoft', 'Stripe', 'HubSpot', 'Salesforce', 'Notion', 'Figma']

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0D1321] text-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0D1321]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold gradient-text">Opsiflo Email</span>
            </div>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild className="hidden md:flex">
                <Link href="/login">Log In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <button
                className="md:hidden p-2 text-slate-400"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#0D1321] px-4 py-4 space-y-2">
            <a href="#features" className="block text-slate-400 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#pricing" className="block text-slate-400 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <a href="#faq" className="block text-slate-400 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            <Link href="/login" className="block text-slate-400 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Background */}
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl -translate-y-1/3" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="premium" className="mb-6 text-sm py-1 px-4">
              <Star className="h-3 w-3 mr-1.5 text-yellow-400" />
              AI-Powered Email Outreach
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-balance">
              AI-Powered Email Outreach That{' '}
              <span className="gradient-text">Predicts Replies</span>{' '}
              Before You Send
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 mb-8 max-w-3xl mx-auto text-balance">
              The only email outreach platform with a built-in Response Prediction Score, Best Send Time Optimizer, and AI personalization at scale. Apollo.io meets GPT-4 — but smarter.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="xl" asChild className="w-full sm:w-auto">
                <Link href="/signup">
                  Start Free 7-Day Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild className="w-full sm:w-auto">
                <a href="#demo">
                  See Live Demo
                </a>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • 7 days full Premium • Cancel anytime
            </p>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <p className="text-sm text-muted-foreground mb-6">
              Join <strong className="text-white">2,400+</strong> sales teams sending smarter outreach
            </p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {[
                { label: '42%', desc: 'avg reply rate' },
                { label: '3.2x', desc: 'more meetings booked' },
                { label: '68%', desc: 'reduction in spam rate' },
                { label: '2,400+', desc: 'active users' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold gradient-text">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Demo Widget */}
      <section id="demo" className="py-16 px-4 sm:px-6 lg:px-8 bg-white/2">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">
              Try It Right Now — No Login Required
            </h2>
            <p className="text-slate-400">
              Enter a prospect role and industry. Watch AI generate a personalized email in real-time.
            </p>
          </div>
          <LiveDemoWidget />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Every feature is{' '}
              <span className="gradient-text">AI-first</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Not just another email tool with an AI tag. Every feature is built around intelligence that actually improves your results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card rounded-xl p-6 hover:border-indigo-500/30 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 rounded-lg bg-white/5">
                        <Icon className="h-5 w-5 text-indigo-400" />
                      </div>
                      <Badge variant="premium" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* More features list */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              'Email Validation', 'A/B Testing', 'Reply Inbox', 'Warmup System',
              'GDPR Compliant', 'Spam Detector', 'Personalization Engine', 'ROI Attribution',
              'CSV Import', 'Referral Program', 'Viral Score Card', 'Admin Dashboard',
              'Resend Integration', 'Razorpay / LemonSqueezy', 'Real-time Analytics', 'Mobile Responsive'
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2 text-sm text-slate-400">
                <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                {feat}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/2">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How it works</h2>
            <p className="text-slate-400">From zero to sending your first AI campaign in under 10 minutes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Import Prospects', desc: 'Upload CSV or add manually. AI validates emails and enriches missing data.', icon: Users },
              { step: '02', title: 'AI Writes Emails', desc: 'Pick industry + goal. Get 3 variants with predicted open rates and spam scores.', icon: Mail },
              { step: '03', title: 'Check Your Score', desc: 'Response Prediction Score tells you exactly what to improve before sending.', icon: Target },
              { step: '04', title: 'Send & Track', desc: 'Auto-send at optimal times. Track opens, replies, and revenue in real-time.', icon: TrendingUp },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.step} className="text-center relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-xs font-bold text-indigo-400 mb-2">{item.step}</div>
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Loved by sales teams</h2>
            <div className="flex items-center justify-center gap-1">
              {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />)}
              <span className="text-sm text-muted-foreground ml-2">4.9/5 from 320+ reviews</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah K.',
                role: 'Head of Sales, TechCorp',
                text: 'The Response Prediction Score alone saved us from sending 200 weak emails. We improved our score from 34 to 78 before sending — reply rate went from 6% to 23%.',
                avatar: 'SK',
              },
              {
                name: 'James P.',
                role: 'Founder, GrowthLabs',
                text: 'I used to spend 2 hours writing 20 cold emails. With Opsiflo Email, I get 3 variants in 30 seconds that are better than anything I write manually.',
                avatar: 'JP',
              },
              {
                name: 'Ananya R.',
                role: 'SDR, Fintech Startup',
                text: 'The industry templates for fintech are so accurate — the AI knows the compliance language, the right tone for CFOs, and what NOT to say. Booked 8 demos in my first week.',
                avatar: 'AR',
              },
            ].map((t) => (
              <div key={t.name} className="glass-card rounded-xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/2">
        <PricingSection />
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <FAQSection />
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to 3x your reply rate?
          </h2>
          <p className="text-slate-400 mb-8">
            Join 2,400+ sales teams. Start your 7-day free trial today.
          </p>
          <Button size="xl" asChild>
            <Link href="/signup">
              Start Free Trial — No Card Needed
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Zap className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="font-bold text-sm gradient-text">Opsiflo</span>
              </div>
              <p className="text-xs text-muted-foreground">
                The AI-powered productivity suite for modern professionals.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white mb-3">Products</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="https://email.opsiflo.com" className="block hover:text-white transition-colors">Opsiflo Email</a>
                <a href="https://linkedin.opsiflo.com" className="block hover:text-white transition-colors">Opsiflo LinkedIn</a>
                <a href="https://resume.opsiflo.com" className="block hover:text-white transition-colors">Opsiflo Resume</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white mb-3">Company</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#" className="block hover:text-white transition-colors">About</a>
                <a href="#" className="block hover:text-white transition-colors">Blog</a>
                <a href="#" className="block hover:text-white transition-colors">Careers</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white mb-3">Legal</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#" className="block hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="block hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="block hover:text-white transition-colors">GDPR</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">© 2024 Opsiflo. All rights reserved.</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              SOC2 Compliant • GDPR Ready • CAN-SPAM Compliant
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
