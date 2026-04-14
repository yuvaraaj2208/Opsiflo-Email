import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createClient } from '@/lib/supabase/server'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

const PLAN_AMOUNTS: Record<string, { monthly: number; annual: number }> = {
  starter:      { monthly: 59900,  annual: 47500  }, // ₹599/mo, ₹475/mo billed annually
  professional: { monthly: 119900, annual: 95000  }, // ₹1,199/mo, ₹950/mo billed annually
  business:     { monthly: 199900, annual: 159000 }, // ₹1,999/mo, ₹1,590/mo billed annually
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan, billing = 'monthly' } = await req.json()

    if (!PLAN_AMOUNTS[plan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const amount = billing === 'annual'
      ? PLAN_AMOUNTS[plan].annual * 12
      : PLAN_AMOUNTS[plan].monthly

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `order_${user.id}_${Date.now()}`,
      notes: {
        user_id: user.id,
        plan,
        billing,
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
