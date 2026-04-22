import { NextResponse } from 'next/server'
import { getLatestPrices } from '@/lib/pricing/engine'

export const dynamic   = 'force-dynamic'
export const revalidate = 0

/**
 * GET /api/pricing/current
 * Returns the latest gold + silver price per gram (INR).
 * Used by the PriceTicker component and client-side hooks.
 */
export async function GET() {
  try {
    const { gold, silver } = await getLatestPrices()

    return NextResponse.json(
      {
        success: true,
        data: { gold, silver },
        fetchedAt: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (err) {
    console.error('[pricing/route]', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch pricing' }, { status: 500 })
  }
}
