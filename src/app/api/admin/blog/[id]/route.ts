import { NextRequest } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { verifySession, COOKIE } from '@/lib/session'

async function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value
  return token ? verifySession(token) : false
}

type Params = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  if (!(await auth(req))) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const snap = await getDoc(doc(db, 'blog_posts', id))
  if (!snap.exists()) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json({ post: { id: snap.id, ...snap.data() } })
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!(await auth(req))) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()

  const updates: Record<string, unknown> = {
    ...body,
    updatedAt: serverTimestamp(),
  }
  if (body.status === 'published') {
    const snap = await getDoc(doc(db, 'blog_posts', id))
    if (snap.data()?.publishedAt == null) {
      updates.publishedAt = serverTimestamp()
    }
  }

  await updateDoc(doc(db, 'blog_posts', id), updates)
  return Response.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!(await auth(req))) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await deleteDoc(doc(db, 'blog_posts', id))
  return Response.json({ ok: true })
}
