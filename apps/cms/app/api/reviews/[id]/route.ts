import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@amiora/database'

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params
  const body = await req.json()
  const supabase = createServerClient()
  const { data, error } = await supabase.from('reviews').update({ status: body.status }).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
