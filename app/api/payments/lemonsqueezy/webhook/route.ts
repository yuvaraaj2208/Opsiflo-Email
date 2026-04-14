import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.LS_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex')

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)
    const supabase = await createServiceClient()

    const eventName = event.meta?.event_name
    const customData = event.meta?.custom_data
    const userId = customData?.user_id
    const plan = customData?.plan

    if (!userId) {
      return NextResponse.json({ received: true })
    }

    if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
      const sub = event.data?.attributes

      await supabase.from('subscriptions').upsert({
        user_id: userId,
        plan: plan ?? 'starter',
        gateway: 'lemonsqueezy',
        gateway_sub_id: event.data?.id,
        status: sub?.status === 'active' ? 'active' : 'canceled',
        current_period_end: sub?.renews_at ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })

      if (sub?.status === 'active') {
        await supabase.from('profiles').update({
          plan: plan ?? 'starter',
          plan_status: 'active',
          ls_customer_id: String(sub?.customer_id),
        }).eq('id', userId)
      }
    }

    if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
      await supabase.from('subscriptions').update({
        status: 'canceled',
      }).eq('user_id', userId).eq('gateway', 'lemonsqueezy')

      await supabase.from('profiles').update({
        plan: 'free',
        plan_status: 'canceled',
      }).eq('id', userId)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('LemonSqueezy webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}
