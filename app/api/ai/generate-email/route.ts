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

    const { industry, senderName, company, product, prospectRole, goal, tone, includeEmoji } = await req.json()

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
- Preferred tone: ${tone || 'Professional'}
- Include emojis in subject: ${includeEmoji ? 'yes' : 'no'}

Generate 3 DIFFERENT email variants. Each should have a distinct approach.

For each variant provide:
- subject: compelling subject line (max 60 chars)
- body: email body (150-250 words), starting with personalized opener, ending with clear CTA
- ps_line: a P.S. line that adds urgency or social proof
- predicted_open_rate: number 15-50 (realistic)
- tone: "Professional" | "Friendly" | "Bold"

IMPORTANT: Make each variant genuinely different in approach, structure, and CTA.

Respond ONLY with valid JSON:
{
  "variants": [
    {
      "subject": "...",
      "body": "...",
      "ps_line": "...",
      "predicted_open_rate": 32,
      "tone": "Professional"
    },
    ...
  ]
}`

    const stream = client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    })

    const encoder = new TextEncoder()

    const readable = new ReadableStream({
      async start(controller) {
        try {
          let fullText = ''

          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              fullText += chunk.delta.text
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`))
            }
          }

          // Send the final parsed result
          const jsonMatch = fullText.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, result: parsed })}\n\n`))
          }

          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Generate email error:', error)
    return NextResponse.json({ error: 'Failed to generate email' }, { status: 500 })
  }
}
