import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function formatCurrency(amount: number, currency: 'INR' | 'USD' = 'USD'): string {
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(date)
}

export function calculateOpenRate(opens: number, sent: number): string {
  if (sent === 0) return '0%'
  return ((opens / sent) * 100).toFixed(1) + '%'
}

export function getScoreLabel(score: number): 'unlikely' | 'possible' | 'likely' | 'high_chance' {
  if (score >= 75) return 'high_chance'
  if (score >= 50) return 'likely'
  if (score >= 25) return 'possible'
  return 'unlikely'
}

export function getScoreColor(score: number): string {
  if (score >= 75) return 'text-emerald-400'
  if (score >= 50) return 'text-blue-400'
  if (score >= 25) return 'text-yellow-400'
  return 'text-red-400'
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function estimateReadTime(text: string): string {
  const words = countWords(text)
  const minutes = Math.ceil(words / 200)
  return minutes === 1 ? '~1 min read' : `~${minutes} min read`
}

export const SPAM_WORDS = [
  'free',
  'winner',
  'guaranteed',
  'earn money',
  'click here',
  'limited time',
  'act now',
  'urgent',
  'no obligation',
  'cash',
  'prize',
  'congratulations',
  'dear friend',
  'you have been selected',
  'earn extra',
  'extra income',
  'incredible deal',
  'make money fast',
  'no cost',
  '100% free',
  'risk-free',
  'best price',
  'billion',
  'discount',
  'double your',
  'eliminate debt',
  'extra cash',
  'fast cash',
  'financial freedom',
  'free consultation',
  'free gift',
  'free info',
  'free investment',
  'free membership',
  'free money',
  'free preview',
  'free quote',
  'free trial',
  'free website',
  'freedom from',
  'get it now',
  'get paid',
  'get rich',
]

export function detectSpamWords(text: string): string[] {
  const lowerText = text.toLowerCase()
  return SPAM_WORDS.filter((word) => lowerText.includes(word.toLowerCase()))
}

export function calculateFleschScore(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(Boolean).length
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const syllables = text
    .toLowerCase()
    .replace(/[^a-z]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .reduce((total, word) => {
      const vowelGroups = word.match(/[aeiouy]+/g) || []
      return total + Math.max(1, vowelGroups.length)
    }, 0)

  if (sentences === 0 || words === 0) return 50

  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
  return Math.min(100, Math.max(0, Math.round(score)))
}

export function getReadabilityLabel(score: number): string {
  if (score >= 90) return 'Very Easy'
  if (score >= 80) return 'Easy'
  if (score >= 70) return 'Fairly Easy'
  if (score >= 60) return 'Standard'
  if (score >= 50) return 'Fairly Difficult'
  if (score >= 30) return 'Difficult'
  return 'Very Difficult'
}

export function getReadabilityScore(text: string): { score: number; label: string; grade: number } {
  const raw = calculateFleschScore(text)
  const normalized = Math.round((raw / 100) * 10)
  return {
    score: normalized,
    label: getReadabilityLabel(raw),
    grade: normalized,
  }
}
