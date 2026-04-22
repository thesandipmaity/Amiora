import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@amiora/database'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const supabase = createServerClient()
  const { data, error } = await supabase.from('testimonials').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
