import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifySession, COOKIE } from '@/lib/session'

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in .env.local')
  return createClient(url, key)
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value
  if (!token || !(await verifySession(token))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const form = await req.formData()
  const file = form.get('file') as File | null
  const bucket = (form.get('bucket') as string) || 'blog-images'
  const folder = (form.get('folder') as string) || 'uploads'

  if (!file) return Response.json({ error: 'No file provided' }, { status: 400 })

  const ext = file.name.split('.').pop()
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const bytes = await file.arrayBuffer()

  const supabase = getAdminClient()
  const { error } = await supabase.storage.from(bucket).upload(path, bytes, {
    contentType: file.type,
    upsert: false,
  })

  if (error) return Response.json({ error: error.message }, { status: 500 })

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return Response.json({ url: data.publicUrl })
}
