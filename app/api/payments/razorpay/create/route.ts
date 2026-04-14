import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createClient } from '@/lib/supabase/server'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

const PLAN_AMOUNTS: Record<string, number> = {
  basic: 19900,   // ₹199 in paise
  pro: 39900,     // ₹399 in paise
  premium: 59900, // ₹599 in paise
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan } = await req.json()

    if (!PLAN_AMOUNTS[plan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const order = await razorpay.orders.create({
      amount: PLAN_AMOUNTS[plan],
      currency: 'INR',
      receipt: `order_${user.id}_${Date.now()}`,
      notes: {
        user_id: user.id,
        plan,
      },
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (error) {
    console.error('Razorpay create error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
