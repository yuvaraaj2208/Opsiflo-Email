import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 60

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

    const { industry, senderName, company, product, prospectRole, goal, includeEmoji } = await req.json()

    const goalDescriptions: Record<string, string> = {
      cold_outreach: 'cold outreach to introduce the product',
      follow_up: 'follow-up after no response',
      partnership: 'partnership or collaboration proposal',
      sales: 'sales pitch to convert to a paying customer',
      hiring: 'recruiting/hiring outreach',
    }

    const prompt = `You are an expert B2B cold email copywriter. Generate 3 high-converting email variants.

Context:
- Sender: ${senderName} from ${company}
- Product/Service: ${product}
- Target: ${prospectRole} in ${industry}
- Goal: ${goalDescriptions[goal] || goal}
- Include emojis in subject: ${includeEmoji ? 'yes' : 'no'}

Generate 3 DIFFERENT email variants with distinct approaches.

For each variant provide:
- subject: compelling subject line (max 60 chars)
- body: email body (150-250 words), personalized opener, clear CTA
- ps_line: a P.S. line that adds urgency or social proof
- predicted_open_rate: number 15-50 (realistic)
- tone: "Professional" | "Friendly" | "Bold"

Respond ONLY with valid JSON:
{
  "variants": [
    {
      "subject": "...",
      "body": "...",
      "ps_line": "...",
      "predicted_open_rate": 32,
      "tone": "Professional"
    }
  ]
}`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

    const parsed = JSON.parse(jsonMatch[0])

    return NextResponse.json({ variants: parsed.variants || [] })
  } catch (error) {
    console.error('Generate email error:', error)
    return NextResponse.json({ error: 'Failed to generate email' }, { status: 500 })
  }
}
