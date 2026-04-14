import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { industry, role } = await req.json()

    if (!industry || !role) {
      return NextResponse.json({ error: 'Industry and role required' }, { status: 400 })
    }

    const prompt = `You are an expert cold email writer. Generate a high-converting cold email for the following scenario:

Industry: ${industry}
Prospect Role: ${role}
Sender: A B2B SaaS company offering productivity tools

Generate ONE email with:
1. A compelling subject line (max 60 chars)
2. A personalized email body (150-200 words)
3. A predicted open rate (number between 15-45)
4. A tone label (one of: "Professional", "Friendly", "Bold")

IMPORTANT: The email should be personalized to the ${role} in ${industry}. Use their specific pain points, goals, and language.

Respond ONLY with valid JSON in this exact format:
{
  "subject": "...",
  "body": "...",
  "score": 72,
  "tone": "Professional"
}`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    // Parse the JSON response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found in response')

    const parsed = JSON.parse(jsonMatch[0])

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Demo email error:', error)
    return NextResponse.json(
      { error: 'Failed to generate email' },
      { status: 500 }
    )
  }
}
