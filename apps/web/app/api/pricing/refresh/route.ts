import { NextRequest, NextResponse } from 'next/server'
import { fetchAndStorePrices } from '@/lib/pricing/engine'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cms-secret')
  if (secret !== process.env.CMS_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const prices = await fetchAndStorePrices()
    return NextResponse.json({ data: prices })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}
