import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { role, industry, country } = await req.json()

    const prompt = `You are an email outreach timing expert with deep knowledge of professional behavior patterns.

Based on research and industry data, recommend the best times to send cold emails to:
- Role: ${role}
- Industry: ${industry}
- Country/Region: ${country || 'United States'}

Provide:
1. Top 3 recommended time windows (day + time range)
2. Times to AVOID
3. Brief reasoning for each recommendation

Consider:
- When this role type typically starts their workday
- When they check email most frequently
- Meeting-heavy vs deep-work periods
- Industry-specific rhythms (e.g., finance: pre-market, retail: non-holiday)

Respond ONLY with valid JSON:
{
  "recommendations": [
    {
      "day": "Tuesday",
      "time_start": "07:00",
      "time_end": "09:00",
      "timezone": "Recipient's local time",
      "confidence": 87,
      "reason": "..."
    }
  ],
  "avoid": [
    {
      "day": "Monday",
      "time": "Morning",
      "reason": "..."
    }
  ],
  "general_tip": "..."
}`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response type')

    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')

    return NextResponse.json(JSON.parse(jsonMatch[0]))
  } catch (error) {
    console.error('Best send time error:', error)
    return NextResponse.json({ error: 'Failed to get recommendations' }, { status: 500 })
  }
}
