# Opsiflo Email — AI-Powered Bulk Email Outreach

Production-ready SaaS email outreach platform with AI at the core of every feature.

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Database & Auth**: Supabase
- **Styling**: Tailwind CSS + shadcn/ui components
- **AI**: Anthropic Claude API (claude-sonnet-4-20250514)
- **Email Sending**: Resend
- **Payments India**: Razorpay (INR)
- **Payments Global**: Lemon Squeezy (USD)
- **Deployment**: Vercel

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.local` and fill in your values:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI
ANTHROPIC_API_KEY=your_anthropic_api_key

# Email
RESEND_API_KEY=your_resend_api_key

# Payments - India (Razorpay)
RAZORPAY_KEY_ID=rzp_test_SXW4jFnzym4eMN
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_SXW4jFnzym4eMN

# Payments - Global (Lemon Squeezy)
LS_API_KEY=your_lemonsqueezy_api_key
LS_STORE_ID=your_lemonsqueezy_store_id
LS_WEBHOOK_SECRET=your_lemonsqueezy_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set up Supabase database

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor and run `supabase/schema.sql`
3. Run `supabase/seed.sql` for sample data

### 4. Configure Supabase Auth

In your Supabase dashboard:
- Enable Email/Password provider
- Enable Google OAuth provider
- Set the redirect URL to `http://localhost:3000/auth/callback`

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

1. Push to GitHub
2. Connect repo to Vercel
3. Add all environment variables in Vercel settings
4. Deploy

For production, update `NEXT_PUBLIC_APP_URL` to `https://email.opsiflo.com`

## Payment Setup

### Razorpay (India)
1. Create account at razorpay.com
2. Get Key ID and Secret from Settings > API Keys
3. Set up webhook URL: `https://email.opsiflo.com/api/payments/razorpay/webhook`
4. Enable events: `subscription.charged`, `subscription.cancelled`

### Lemon Squeezy (Global)
1. Create account at lemonsqueezy.com
2. Create a Store and add 3 products (Basic, Pro, Premium)
3. Note down Store ID and variant IDs
4. Set up webhook URL: `https://email.opsiflo.com/api/payments/lemonsqueezy/webhook`
5. Add variant IDs as env vars: `LS_VARIANT_BASIC`, `LS_VARIANT_PRO`, `LS_VARIANT_PREMIUM`

## Environment Variable Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) | ✅ |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude | ✅ |
| `RESEND_API_KEY` | Resend API key for email sending | ✅ |
| `RAZORPAY_KEY_ID` | Razorpay Key ID | For India payments |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret | For India payments |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Key ID (client) | For India payments |
| `LS_API_KEY` | Lemon Squeezy API key | For global payments |
| `LS_STORE_ID` | Lemon Squeezy Store ID | For global payments |
| `LS_WEBHOOK_SECRET` | Lemon Squeezy webhook secret | For global payments |
| `NEXT_PUBLIC_APP_URL` | Your app URL | ✅ |

## Project Structure

```
opsiflo-email/
├── app/
│   ├── (auth)/         # Auth pages (login, signup, forgot-password)
│   ├── (dashboard)/    # Protected dashboard pages
│   ├── admin/          # Admin panel
│   ├── api/            # API routes
│   │   ├── ai/         # AI generation endpoints
│   │   ├── email/      # Email sending
│   │   └── payments/   # Payment processing
│   ├── auth/           # Auth callbacks
│   └── pricing/        # Public pricing page
├── components/
│   ├── admin/          # Admin components
│   ├── analytics/      # Analytics charts
│   ├── auth/           # Auth forms
│   ├── campaigns/      # Campaign management
│   ├── dashboard/      # Dashboard layout
│   ├── inbox/          # Reply inbox
│   ├── landing/        # Landing page
│   ├── prospects/      # Prospect management
│   ├── referral/       # Referral program
│   ├── settings/       # Settings & billing
│   ├── templates/      # Email templates
│   └── ui/             # shadcn/ui components
├── lib/
│   ├── supabase/       # Supabase clients
│   └── utils.ts        # Utilities
├── supabase/
│   ├── schema.sql      # Database schema
│   └── seed.sql        # Sample data
└── types/
    └── index.ts        # TypeScript types
```

## Key Features

1. **AI Email Writer** — 3 variants with predicted open rates, spam detection, readability scores
2. **Response Prediction Score** — AI analyzes 9+ factors, returns 0-100 score with breakdown
3. **Best Send Time Optimizer** — Per-role and industry send time recommendations
4. **Multi-Channel Sequencing** — Email + LinkedIn + Twitter + tasks with branch logic
5. **Industry Templates** — 50+ templates with proven formulas
6. **ROI Tracker** — Full deal pipeline with revenue attribution
7. **Reply Inbox** — Unified inbox with AI-suggested replies and sentiment detection
8. **Email Validation** — Validates all emails before import/send
9. **A/B Testing** — Subject line, body, and send time testing
10. **Referral Program** — 1 free month per paying referral

## Support

For issues or questions, contact support@opsiflo.com
