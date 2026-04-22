import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@amiora/database'

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    description: string; contact_preference: string; contact_value: string
  }
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from('customization_requests').insert({
    user_id:             user?.id ?? null,
    description:         body.description,
    contact_preference:  body.contact_preference,
    contact_value:       body.contact_value,
    status:              'pending',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
