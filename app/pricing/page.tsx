import { PricingSection } from '@/components/landing/pricing-section'
import Link from 'next/link'
import { Zap, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0D1321]">
      <header className="border-b border-white/5 bg-[#0D1321]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold gradient-text">Opsiflo Email</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="py-20 px-4">
        <PricingSection />
      </main>
    </div>
  )
}
