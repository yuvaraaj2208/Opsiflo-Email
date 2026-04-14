-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro', 'premium')),
  plan_status TEXT NOT NULL DEFAULT 'trialing' CHECK (plan_status IN ('active', 'trialing', 'canceled', 'past_due')),
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  country TEXT,
  razorpay_customer_id TEXT,
  ls_customer_id TEXT,
  referral_code TEXT UNIQUE DEFAULT UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 8)),
  referred_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CAMPAIGNS TABLE
-- ============================================================
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused')),
  industry TEXT,
  subject TEXT,
  body TEXT,
  sequence_id UUID,
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CAMPAIGN STATS TABLE
-- ============================================================
CREATE TABLE campaign_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE UNIQUE,
  total_sent INTEGER DEFAULT 0,
  delivered INTEGER DEFAULT 0,
  bounced INTEGER DEFAULT 0,
  opens INTEGER DEFAULT 0,
  unique_opens INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  replies INTEGER DEFAULT 0,
  unsubscribes INTEGER DEFAULT 0,
  meetings_booked INTEGER DEFAULT 0,
  revenue_attributed NUMERIC(10,2) DEFAULT 0
);

-- ============================================================
-- PROSPECTS TABLE
-- ============================================================
CREATE TABLE prospects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  job_title TEXT,
  industry TEXT,
  country TEXT,
  linkedin_url TEXT,
  twitter_handle TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced', 'invalid')),
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  email_status TEXT NOT NULL DEFAULT 'unknown' CHECK (email_status IN ('valid', 'risky', 'invalid', 'unknown')),
  unsubscribed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, email)
);

-- ============================================================
-- PROSPECT LISTS TABLE
-- ============================================================
CREATE TABLE prospect_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  prospect_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROSPECT LIST MEMBERS TABLE
-- ============================================================
CREATE TABLE prospect_list_members (
  list_id UUID NOT NULL REFERENCES prospect_lists(id) ON DELETE CASCADE,
  prospect_id UUID NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  PRIMARY KEY (list_id, prospect_id)
);

-- ============================================================
-- EMAIL EVENTS TABLE
-- ============================================================
CREATE TABLE email_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  prospect_id UUID NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('sent', 'opened', 'clicked', 'replied', 'bounced', 'unsubscribed')),
  metadata JSONB DEFAULT '{}',
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SEQUENCES TABLE
-- ============================================================
CREATE TABLE sequences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  steps JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TEMPLATES TABLE
-- ============================================================
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- REPLIES TABLE
-- ============================================================
CREATE TABLE replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  prospect_id UUID NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  subject TEXT,
  body TEXT,
  received_at TIMESTAMPTZ DEFAULT NOW(),
  tag TEXT CHECK (tag IN ('interested', 'not_interested', 'auto_reply', 'bounce', 'question')),
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  is_read BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- AB TESTS TABLE
-- ============================================================
CREATE TABLE ab_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  variant_a JSONB NOT NULL DEFAULT '{}',
  variant_b JSONB NOT NULL DEFAULT '{}',
  winner TEXT CHECK (winner IN ('a', 'b')),
  results JSONB DEFAULT '{}'
);

-- ============================================================
-- DEALS TABLE
-- ============================================================
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  prospect_id UUID NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  stage TEXT NOT NULL DEFAULT 'lead' CHECK (stage IN ('lead', 'meeting_booked', 'proposal_sent', 'deal_won', 'deal_lost')),
  value NUMERIC(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  closed_at TIMESTAMPTZ
);

-- ============================================================
-- REFERRALS TABLE
-- ============================================================
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'converted', 'rewarded')),
  reward_months INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('basic', 'pro', 'premium')),
  gateway TEXT NOT NULL CHECK (gateway IN ('razorpay', 'lemonsqueezy')),
  gateway_sub_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospect_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospect_list_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Campaigns RLS
CREATE POLICY "Users can CRUD own campaigns" ON campaigns FOR ALL USING (auth.uid() = user_id);

-- Campaign stats RLS (via campaign ownership)
CREATE POLICY "Users can view own campaign stats" ON campaign_stats FOR ALL USING (
  campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid())
);

-- Prospects RLS
CREATE POLICY "Users can CRUD own prospects" ON prospects FOR ALL USING (auth.uid() = user_id);

-- Prospect lists RLS
CREATE POLICY "Users can CRUD own prospect lists" ON prospect_lists FOR ALL USING (auth.uid() = user_id);

-- Email events RLS
CREATE POLICY "Users can view own email events" ON email_events FOR ALL USING (
  campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid())
);

-- Sequences RLS
CREATE POLICY "Users can CRUD own sequences" ON sequences FOR ALL USING (auth.uid() = user_id);

-- Templates RLS
CREATE POLICY "Users can CRUD own templates" ON templates FOR ALL USING (auth.uid() = user_id OR is_public = true);

-- Replies RLS
CREATE POLICY "Users can view own replies" ON replies FOR ALL USING (
  campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid())
);

-- AB Tests RLS
CREATE POLICY "Users can CRUD own ab tests" ON ab_tests FOR ALL USING (
  campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid())
);

-- Deals RLS
CREATE POLICY "Users can CRUD own deals" ON deals FOR ALL USING (auth.uid() = user_id);

-- Referrals RLS
CREATE POLICY "Users can view own referrals" ON referrals FOR ALL USING (
  auth.uid() = referrer_id OR auth.uid() = referred_id
);

-- Subscriptions RLS
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGERS: Auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_prospects_user_id ON prospects(user_id);
CREATE INDEX idx_prospects_email ON prospects(email);
CREATE INDEX idx_email_events_campaign_id ON email_events(campaign_id);
CREATE INDEX idx_email_events_occurred_at ON email_events(occurred_at);
CREATE INDEX idx_replies_campaign_id ON replies(campaign_id);
CREATE INDEX idx_replies_is_read ON replies(is_read);
