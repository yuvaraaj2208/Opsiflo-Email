'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Mail, Zap, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const schema = z.object({
  email: z.string().email('Invalid email address'),
})

type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      setSent(true)
      toast.success('Reset link sent! Check your inbox.')
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D1321] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-pattern opacity-20" />
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">Opsiflo Email</span>
        </div>

        <div className="glass-card rounded-2xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Check your inbox</h1>
              <p className="text-muted-foreground mb-6">
                We've sent a password reset link to your email address.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link href="/login">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to login
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white">Forgot password?</h1>
                <p className="text-muted-foreground mt-1">
                  Enter your email and we'll send you a reset link
                </p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      className="pl-9"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-400">{errors.email.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" loading={loading}>
                  Send Reset Link
                </Button>
              </form>
              <p className="text-center text-sm text-muted-foreground mt-6">
                <Link href="/login" className="text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-1">
                  <ArrowLeft className="h-3 w-3" />
                  Back to login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
