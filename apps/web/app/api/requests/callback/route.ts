import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@amiora/database'

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { name: string; phone: string; preferred_time?: string }
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from('callback_requests').insert({
    user_id:        user?.id ?? null,
    name:           body.name,
    phone:          body.phone,
    preferred_time: body.preferred_time ?? null,
    status:         'pending',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
