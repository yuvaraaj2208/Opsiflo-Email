import { LoginForm } from '@/components/auth/login-form'
import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0D1321] flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-hero-pattern opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">Opsiflo Email</span>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-muted-foreground mt-1">Sign in to your account</p>
          </div>
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Start free trial
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
