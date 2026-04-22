import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-razorpay-signature') ?? ''
  const secret = process.env['RAZORPAY_KEY_SECRET'] ?? ''

  const expectedSignature = createHmac('sha256', secret).update(body).digest('hex')

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const payload = JSON.parse(body) as { event: string; payload: unknown }

  switch (payload.event) {
    case 'payment.captured':
      // Handle payment success — update order status
      break
    case 'payment.failed':
      // Handle payment failure
      break
    default:
      break
  }

  return NextResponse.json({ received: true })
}
