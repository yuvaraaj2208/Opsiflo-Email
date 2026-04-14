import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { campaignId, testEmail } = await req.json()

    // Get campaign details
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('user_id', user.id)
      .single()

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Send test email
    if (testEmail) {
      const { data, error } = await resend.emails.send({
        from: 'Opsiflo Email <noreply@email.opsiflo.com>',
        to: testEmail,
        subject: campaign.subject ?? 'Test Email',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            ${campaign.body?.replace(/\n/g, '<br>') ?? ''}
            <br><br>
            <hr style="border: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              This is a test email sent via <a href="https://email.opsiflo.com">Opsiflo Email</a>.
            </p>
          </div>
        `,
      })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({ success: true, messageId: data?.id })
    }

    return NextResponse.json({ error: 'No test email provided' }, { status: 400 })
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
