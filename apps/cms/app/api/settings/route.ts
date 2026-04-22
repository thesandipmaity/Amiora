import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@amiora/database'

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const supabase = createServerClient()

  if (body.making_charge_pct !== undefined) {
    await supabase
      .from('site_settings')
      .upsert({ key: 'making_charge_pct', value: String(body.making_charge_pct) }, { onConflict: 'key' })
  }

  if (body.announcement !== undefined) {
    await supabase
      .from('site_settings')
      .upsert({ key: 'announcement_bar', value: body.announcement }, { onConflict: 'key' })
  }

  return NextResponse.json({ success: true })
}
