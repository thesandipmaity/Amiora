import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { amount } = (await req.json()) as { amount: number }

    const keyId     = process.env['RAZORPAY_KEY_ID']
    const keySecret = process.env['RAZORPAY_KEY_SECRET']

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 503 })
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method:  'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        amount:   amount * 100,
        currency: 'INR',
        receipt:  `rcpt_${Date.now()}`,
      }),
    })

    const data = (await response.json()) as object
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Payment order creation failed' }, { status: 500 })
  }
}
