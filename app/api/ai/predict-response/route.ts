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

    const { subject, body, prospectIndustry, prospectRole, sendTime, sendDay, wordCount, personalizationLevel, ctaClarity } = await req.json()

    const prompt = `You are an email deliverability and response rate expert. Analyze this cold email and predict the response rate.

Email Details:
- Subject line: "${subject}"
- Body: "${body}"
- Prospect Industry: ${prospectIndustry || 'Unknown'}
- Prospect Role: ${prospectRole || 'Unknown'}
- Planned send time: ${sendTime || 'Not specified'}
- Planned send day: ${sendDay || 'Not specified'}
- Word count: ${wordCount || 'Unknown'}
- Personalization level: ${personalizationLevel || 'medium'}
- CTA clarity: ${ctaClarity || 'medium'}

Analyze ALL of these factors:
1. Subject line appeal and curiosity factor
2. Opening line personalization
3. Value proposition clarity
4. Social proof presence
5. CTA clarity and friction
6. Email length appropriateness
7. Send time optimization
8. Spam risk words
9. Prospect role alignment
10. Industry-specific language

Return a JSON response with:
- overall_score: 0-100
- label: "unlikely" | "possible" | "likely" | "high_chance"
- breakdown: array of 5-7 factors with: factor, impact ("positive"|"negative"|"neutral"), score (0-100), suggestion (optional string for improvements)

Respond ONLY with valid JSON.`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response type')

    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')

    const parsed = JSON.parse(jsonMatch[0])

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Predict response error:', error)
    return NextResponse.json({ error: 'Failed to predict response' }, { status: 500 })
  }
}
