import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { replyBody, sentiment } = await req.json()

    const prompt = `You are a professional B2B sales rep. A prospect has replied to your cold email.

Their reply:
"${replyBody}"

Sentiment: ${sentiment || 'neutral'}

Write a concise, professional follow-up response that:
- Acknowledges their reply
- If interested: proposes a specific next step (calendar link, 15-min call, etc.)
- If not interested: gracefully acknowledges and leaves door open
- If a question: answers clearly and proposes next step
- Keeps it under 100 words
- Sounds natural and human

Respond with just the email text, no subject line.`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Unexpected type')

    return NextResponse.json({ reply: content.text })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate reply' }, { status: 500 })
  }
}
