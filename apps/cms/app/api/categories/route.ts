import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@amiora/database'

export async function GET() {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, image_url, parent_id, is_active, sort_order, created_at')
    .order('sort_order')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name:       body.name,
      slug:       body.slug,
      description:body.description ?? null,
      image_url:  body.image_url ?? null,
      parent_id:  body.parent_id ?? null,
      is_active:  body.is_active ?? true,
      sort_order: body.sort_order ?? 0,
    })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
