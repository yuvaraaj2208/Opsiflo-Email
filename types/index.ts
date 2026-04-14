export type Plan = 'free' | 'basic' | 'pro' | 'premium'
export type PlanStatus = 'active' | 'trialing' | 'canceled' | 'past_due'
export type Gateway = 'razorpay' | 'lemonsqueezy'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  plan: Plan
  plan_status: PlanStatus
  trial_ends_at: string | null
  country: string | null
  razorpay_customer_id: string | null
  ls_customer_id: string | null
  referral_code: string | null
  referred_by: string | null
  created_at: string
}

export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused'

export interface Campaign {
  id: string
  user_id: string
  name: string
  status: CampaignStatus
  industry: string | null
  subject: string | null
  body: string | null
  sequence_id: string | null
  scheduled_at: string | null
  sent_at: string | null
  created_at: string
  campaign_stats?: CampaignStats
}

export interface CampaignStats {
  id: string
  campaign_id: string
  total_sent: number
  delivered: number
  bounced: number
  opens: number
  unique_opens: number
  clicks: number
  replies: number
  unsubscribes: number
  meetings_booked: number
  revenue_attributed: number
}

export type ProspectStatus = 'active' | 'unsubscribed' | 'bounced' | 'invalid'
export type EmailStatus = 'valid' | 'risky' | 'invalid' | 'unknown'

export interface Prospect {
  id: string
  user_id: string
  email: string
  first_name: string | null
  last_name: string | null
  company: string | null
  job_title: string | null
  industry: string | null
  country: string | null
  linkedin_url: string | null
  twitter_handle: string | null
  phone: string | null
  status: ProspectStatus
  tags: string[]
  custom_fields: Record<string, string>
  email_status: EmailStatus
  unsubscribed: boolean
  created_at: string
}

export interface ProspectList {
  id: string
  user_id: string
  name: string
  prospect_count: number
  created_at: string
}

export type EventType = 'sent' | 'opened' | 'clicked' | 'replied' | 'bounced' | 'unsubscribed'

export interface EmailEvent {
  id: string
  campaign_id: string
  prospect_id: string
  event_type: EventType
  metadata: Record<string, unknown>
  occurred_at: string
}

export interface SequenceStep {
  id: string
  type: 'email' | 'linkedin' | 'twitter' | 'wait' | 'task'
  subject?: string
  body?: string
  message?: string
  wait_days?: number
  task_description?: string
  condition?: 'always' | 'if_no_reply' | 'if_no_open' | 'if_replied'
}

export interface Sequence {
  id: string
  user_id: string
  name: string
  steps: SequenceStep[]
  created_at: string
}

export interface Template {
  id: string
  user_id: string
  name: string
  industry: string
  subject: string
  body: string
  is_public: boolean
  upvotes: number
  created_at: string
}

export type ReplyTag = 'interested' | 'not_interested' | 'auto_reply' | 'bounce' | 'question'
export type Sentiment = 'positive' | 'neutral' | 'negative'

export interface Reply {
  id: string
  campaign_id: string
  prospect_id: string
  subject: string
  body: string
  received_at: string
  tag: ReplyTag | null
  sentiment: Sentiment | null
  is_read: boolean
  prospect?: Prospect
  campaign?: Campaign
}

export type DealStage = 'lead' | 'meeting_booked' | 'proposal_sent' | 'deal_won' | 'deal_lost'

export interface Deal {
  id: string
  user_id: string
  prospect_id: string
  campaign_id: string
  stage: DealStage
  value: number
  currency: string
  closed_at: string | null
  prospect?: Prospect
  campaign?: Campaign
}

export interface Referral {
  id: string
  referrer_id: string
  referred_id: string
  status: 'pending' | 'converted' | 'rewarded'
  reward_months: number
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan: Plan
  gateway: Gateway
  gateway_sub_id: string
  status: 'active' | 'canceled' | 'past_due'
  current_period_end: string
  created_at: string
}

export interface AIEmailVariant {
  subject: string
  body: string
  ps_line?: string
  predicted_open_rate: number
  tone: 'professional' | 'friendly' | 'bold'
}

export interface AIEmailResult {
  variants: AIEmailVariant[]
}

export interface ResponsePrediction {
  score: number
  label: 'unlikely' | 'possible' | 'likely' | 'high_chance'
  breakdown: {
    factor: string
    impact: 'positive' | 'negative' | 'neutral'
    score: number
    suggestion?: string
  }[]
}

export interface SendTimeRecommendation {
  day: string
  time_start: string
  time_end: string
  timezone: string
  confidence: number
  reason: string
}

export type PlanFeatures = {
  emails_per_month: number | null
  campaigns: number | null
  prospects: number | null
  ai_calls_per_day: number | null
  sequences: boolean
  ab_testing: boolean
  reply_inbox: boolean
  email_validation: boolean
  industry_templates: boolean
  roi_tracker: boolean
  warmup_system: boolean
}

export const PLAN_FEATURES: Record<Plan, PlanFeatures> = {
  free: {
    emails_per_month: 100,
    campaigns: 1,
    prospects: 100,
    ai_calls_per_day: 5,
    sequences: false,
    ab_testing: false,
    reply_inbox: false,
    email_validation: false,
    industry_templates: false,
    roi_tracker: false,
    warmup_system: false,
  },
  basic: {
    emails_per_month: 500,
    campaigns: 1,
    prospects: 500,
    ai_calls_per_day: 20,
    sequences: false,
    ab_testing: false,
    reply_inbox: false,
    email_validation: false,
    industry_templates: false,
    roi_tracker: false,
    warmup_system: false,
  },
  pro: {
    emails_per_month: 5000,
    campaigns: 10,
    prospects: 5000,
    ai_calls_per_day: 100,
    sequences: true,
    ab_testing: true,
    reply_inbox: true,
    email_validation: true,
    industry_templates: false,
    roi_tracker: false,
    warmup_system: false,
  },
  premium: {
    emails_per_month: null,
    campaigns: null,
    prospects: null,
    ai_calls_per_day: null,
    sequences: true,
    ab_testing: true,
    reply_inbox: true,
    email_validation: true,
    industry_templates: true,
    roi_tracker: true,
    warmup_system: true,
  },
}

export const INDUSTRIES = [
  'SaaS / Software',
  'Real Estate',
  'Recruitment / HR',
  'E-commerce',
  'Consulting',
  'Healthcare',
  'Finance / Fintech',
  'EdTech',
  'Marketing Agency',
  'Logistics / Supply Chain',
  'Legal Services',
  'Architecture / Construction',
  'Manufacturing',
  'Retail',
  'Travel & Hospitality',
  'Media & Publishing',
  'Nonprofit',
  'Government / Public Sector',
  'Automotive',
  'Energy / Utilities',
  'Insurance',
  'Telecommunications',
  'Agriculture',
  'Pharmaceuticals',
  'Cybersecurity',
  'AI / Machine Learning',
  'Blockchain / Web3',
  'Gaming',
  'Entertainment',
  'Sports & Fitness',
  'Food & Beverage',
  'Fashion / Apparel',
  'Beauty & Wellness',
  'Interior Design',
  'Photography / Videography',
  'Event Management',
  'PR & Communications',
  'Research & Development',
  'Biotechnology',
  'Environmental Services',
  'Data Analytics',
  'Cloud Services',
  'Managed Services / IT',
  'DevOps / Infrastructure',
  'Product Design / UX',
  'Digital Marketing',
  'Social Media',
  'Influencer Marketing',
  'Affiliate Marketing',
  'Investment / Venture Capital',
]
