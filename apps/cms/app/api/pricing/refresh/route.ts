import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const storefrontUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL ?? 'http://localhost:3000'
    const res = await fetch(`${storefrontUrl}/api/pricing/refresh`, {
      method: 'POST',
      headers: { 'x-cms-secret': process.env.CMS_SECRET ?? '' },
    })
    if (!res.ok) throw new Error('Storefront pricing refresh failed')
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}
