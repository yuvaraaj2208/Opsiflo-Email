import { SignupForm } from '@/components/auth/signup-form'
import Link from 'next/link'
import { Zap, Check } from 'lucide-react'

const trialFeatures = [
  '7-day full Premium access',
  'No credit card required',
  'AI-powered email writer',
  'Response prediction score',
  'Multi-channel sequencing',
]

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#0D1321] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-pattern opacity-20" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-4xl px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left side - value prop */}
        <div className="hidden md:block">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Opsiflo Email</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">
            Start your free{' '}
            <span className="gradient-text">7-day trial</span>
          </h2>
          <p className="text-slate-400 mb-6">
            Join thousands of sales teams sending smarter emails with AI-powered outreach.
          </p>
          <div className="space-y-3">
            {trialFeatures.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-emerald-400" />
                </div>
                <span className="text-slate-300 text-sm">{feature}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-sm text-slate-300 italic">
              "Opsiflo Email helped us 3x our reply rate in the first week. The AI prediction score alone is worth the entire subscription."
            </p>
            <p className="text-xs text-muted-foreground mt-2">— Sarah K., Head of Sales at TechCorp</p>
          </div>
        </div>

        {/* Right side - form */}
        <div>
          <div className="flex items-center justify-center gap-3 mb-6 md:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Opsiflo Email</span>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white">Create your account</h1>
              <p className="text-muted-foreground mt-1">7-day free trial, no credit card needed</p>
            </div>
            <SignupForm />
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
