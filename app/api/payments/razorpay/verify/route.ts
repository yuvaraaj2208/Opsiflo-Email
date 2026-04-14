import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId, paymentId, signature, plan } = await req.json()

    // Verify signature
    const body = orderId + '|' + paymentId
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex')

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Update subscription in database
    const now = new Date()
    const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days

    await supabase.from('subscriptions').upsert({
      user_id: user.id,
      plan,
      gateway: 'razorpay',
      gateway_sub_id: paymentId,
      status: 'active',
      current_period_end: periodEnd.toISOString(),
    })

    // Update profile plan
    await supabase.from('profiles').update({
      plan,
      plan_status: 'active',
    }).eq('id', user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Razorpay verify error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
