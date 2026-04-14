import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const LS_API_URL = 'https://api.lemonsqueezy.com/v1'

const PLAN_VARIANTS: Record<string, string> = {
  basic: process.env.LS_VARIANT_BASIC ?? '',
  pro: process.env.LS_VARIANT_PRO ?? '',
  premium: process.env.LS_VARIANT_PREMIUM ?? '',
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan } = await req.json()

    const variantId = PLAN_VARIANTS[plan]
    if (!variantId) {
      // Return mock URL for development
      return NextResponse.json({
        checkoutUrl: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?plan=${plan}&success=true`,
      })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', user.id)
      .single()

    const response = await fetch(`${LS_API_URL}/checkouts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LS_API_KEY}`,
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_options: {
              embed: false,
              media: false,
              logo: true,
              desc: true,
              discount: false,
              dark: true,
            },
            checkout_data: {
              email: profile?.email,
              name: profile?.full_name,
              custom: {
                user_id: user.id,
                plan,
              },
            },
            product_options: {
              redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
            },
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: process.env.LS_STORE_ID,
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: variantId,
              },
            },
          },
        },
      }),
    })

    const data = await response.json()

    return NextResponse.json({
      checkoutUrl: data.data?.attributes?.url,
    })
  } catch (error) {
    console.error('LemonSqueezy create error:', error)
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }
}
