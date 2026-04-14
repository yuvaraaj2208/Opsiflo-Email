import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex')

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)
    const supabase = await createServiceClient()

    if (event.event === 'subscription.charged') {
      const sub = event.payload.subscription.entity
      const userId = sub.notes?.user_id

      if (userId) {
        await supabase.from('subscriptions').update({
          status: 'active',
          current_period_end: new Date(sub.current_end * 1000).toISOString(),
        }).eq('user_id', userId).eq('gateway', 'razorpay')

        await supabase.from('profiles').update({
          plan_status: 'active',
        }).eq('id', userId)
      }
    }

    if (event.event === 'subscription.cancelled') {
      const sub = event.payload.subscription.entity
      const userId = sub.notes?.user_id

      if (userId) {
        await supabase.from('subscriptions').update({
          status: 'canceled',
        }).eq('user_id', userId).eq('gateway', 'razorpay')

        await supabase.from('profiles').update({
          plan: 'free',
          plan_status: 'canceled',
        }).eq('id', userId)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Razorpay webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}
