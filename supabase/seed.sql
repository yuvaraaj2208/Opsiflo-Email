-- ============================================================
-- SEED DATA for Opsiflo Email
-- ============================================================
-- NOTE: Run schema.sql first, then this seed file.
-- UUIDs are hardcoded for consistency.

-- Sample profiles (create auth users manually or via Supabase dashboard first)
-- These represent demo data only.

-- ============================================================
-- SAMPLE TEMPLATES (public)
-- ============================================================
INSERT INTO templates (name, industry, subject, body, is_public, upvotes) VALUES
(
  'SaaS Cold Outreach - CEO',
  'SaaS / Software',
  'Quick question about {{company}}''s sales stack',
  'Hi {{first_name}},

I was looking at {{company}}''s recent growth — congrats on hitting [milestone].

Most SaaS companies at your stage struggle with reply rates below 8% on cold outreach. We built Opsiflo Email to fix exactly that — our AI predicts your reply rate before you send and tells you precisely what to fix.

[Company X] went from 6% to 28% reply rate in their first month.

Would it make sense to show you how it could work for {{company}}? I have a 15-min slot Thursday at 2pm or Friday at 10am.

Best,
{{sender_name}}

P.S. We also send your emails at the optimal time per prospect — no more guessing.',
  TRUE,
  47
),
(
  'Recruiting - Candidate Intro',
  'Recruitment / HR',
  'Top {{job_title}} candidate for {{company}}',
  'Hi {{first_name}},

I''m reaching out because I have a candidate who could be a strong fit for your open {{job_title}} role at {{company}}.

They have 6+ years in {{industry}}, most recently at [Previous Company] where they [specific achievement]. They''re actively exploring new opportunities and {{company}} is on their shortlist.

Happy to share their profile — would that be useful?

{{sender_name}}',
  TRUE,
  31
),
(
  'Partnership Pitch',
  'Consulting',
  '{{company}} + us = better outcomes for {{industry}} clients',
  'Hi {{first_name}},

I''ve been following {{company}}''s work in {{industry}} — really impressive results with [specific example].

We work with consulting firms like yours to add AI-powered email outreach to their service stack. Several partners are reselling it to clients for an extra $2-5k/month in recurring revenue.

Would it make sense to explore if there''s a fit? Happy to share the partner deck — takes 10 mins to review.

{{sender_name}}',
  TRUE,
  22
),
(
  'E-commerce / DTC Brand Outreach',
  'E-commerce',
  'One thing slowing down {{company}}''s email marketing',
  'Hi {{first_name}},

I noticed {{company}} has been scaling hard — impressive numbers on [metric/platform].

Most DTC brands at your growth stage leave 30-40% of potential revenue on the table because their outreach emails never get replies.

We help e-commerce brands get their outreach emails actually opened and replied to — our Response Prediction Score tells you in real-time what''s hurting your deliverability.

Happy to send over a free audit of your current email approach?

{{sender_name}}',
  TRUE,
  18
),
(
  'Finance / Fintech Outreach',
  'Finance / Fintech',
  'Helping {{company}} reduce customer acquisition cost',
  'Hi {{first_name}},

Quick note — I saw {{company}} is expanding into [market/product area].

We specialize in helping fintech companies like yours run compliant, high-converting outreach campaigns. Our AI is trained on fintech-specific language and compliance requirements.

[Similar Company] reduced their CAC by 34% using our platform in Q3.

15 minutes to walk through how? I''m open Thursday or Friday.

{{sender_name}}',
  TRUE,
  15
);
