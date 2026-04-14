import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Opsiflo Email — AI-Powered Bulk Email Outreach',
  description:
    'The most intelligent email outreach platform. Predict reply rates, auto-personalize at scale, and close more deals with AI-powered campaigns.',
  keywords: [
    'email outreach',
    'cold email',
    'email automation',
    'AI email',
    'bulk email',
    'sales outreach',
  ],
  authors: [{ name: 'Opsiflo' }],
  openGraph: {
    title: 'Opsiflo Email — AI-Powered Bulk Email Outreach',
    description:
      'Predict reply rates before you send. AI personalization at scale. Close more deals.',
    url: 'https://email.opsiflo.com',
    siteName: 'Opsiflo Email',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Opsiflo Email',
    description: 'AI-Powered Bulk Email Outreach That Predicts Replies Before You Send',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#e2e8f0',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
