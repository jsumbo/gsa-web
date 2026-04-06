import { NextRequest } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, deleteDoc } from 'firebase/firestore'
import { createClient } from '@supabase/supabase-js'
import { verifySession, COOKIE } from '@/lib/session'

async function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value
  return token ? verifySession(token) : false
}

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await auth(req))) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  const snap = await getDoc(doc(db, 'gallery', id))
  if (snap.exists()) {
    const { imageUrl } = snap.data() as { imageUrl: string }
    // Extract bucket + path from the Supabase public URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const prefix = `${supabaseUrl}/storage/v1/object/public/`
    if (imageUrl.startsWith(prefix)) {
      const rest = imageUrl.slice(prefix.length)
      const slashIdx = rest.indexOf('/')
      if (slashIdx !== -1) {
        const bucket = rest.slice(0, slashIdx)
        const path = rest.slice(slashIdx + 1)
        await getAdminClient().storage.from(bucket).remove([path])
      }
    }
  }

  await deleteDoc(doc(db, 'gallery', id))
  return Response.json({ ok: true })
}
