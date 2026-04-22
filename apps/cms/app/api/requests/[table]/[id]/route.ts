import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@amiora/database'

const TABLE_MAP: Record<string, string> = {
  'callback-requests':      'callback_requests',
  'demo-requests':          'demo_requests',
  'customization-requests': 'customization_requests',
}

type Ctx = { params: Promise<{ table: string; id: string }> }

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { table, id } = await params
  const dbTable = TABLE_MAP[table]
  if (!dbTable) return NextResponse.json({ error: 'Invalid table' }, { status: 400 })

  const body = await req.json()
  const supabase = createServerClient()
  const { data, error } = await supabase.from(dbTable).update({ status: body.status }).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
