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

    const { prospects, senderContext } = await req.json()

    // Process up to 20 prospects at once
    const batch = prospects.slice(0, 20)

    const prompt = `You are an expert at writing hyper-personalized email openers. For each prospect, write a unique 1-2 sentence personalized opening line that:
- References something specific about their company or role
- Connects naturally to the sender's value proposition
- Feels genuinely researched, not generic

Sender context: ${senderContext}

Prospects:
${batch.map((p: { firstName: string; lastName: string; company: string; role: string; industry: string }, idx: number) =>
  `${idx + 1}. ${p.firstName} ${p.lastName}, ${p.role} at ${p.company} (${p.industry})`
).join('\n')}

Respond ONLY with valid JSON:
{
  "personalizations": [
    {
      "index": 0,
      "opener": "..."
    }
  ]
}`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response type')

    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')

    return NextResponse.json(JSON.parse(jsonMatch[0]))
  } catch (error) {
    console.error('Personalize error:', error)
    return NextResponse.json({ error: 'Failed to personalize' }, { status: 500 })
  }
}
