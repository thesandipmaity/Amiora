import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@amiora/database'

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    type: string; store_id?: string; address?: string
    preferred_date: string; preferred_time?: string; notes?: string
  }
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from('demo_requests').insert({
    user_id:        user?.id ?? null,
    type:           body.type,
    store_id:       body.store_id ?? null,
    address:        body.address ?? null,
    preferred_date: body.preferred_date,
    preferred_time: body.preferred_time ?? null,
    notes:          body.notes ?? null,
    status:         'pending',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
