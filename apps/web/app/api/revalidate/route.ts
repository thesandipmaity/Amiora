import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (token !== process.env['REVALIDATION_TOKEN']) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const { path, tag } = (await req.json()) as { path?: string; tag?: string }

  if (tag) revalidateTag(tag)
  if (path) revalidatePath(path)

  return NextResponse.json({ revalidated: true, now: Date.now() })
}
