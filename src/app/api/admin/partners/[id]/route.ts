import { NextRequest } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { verifySession, COOKIE } from '@/lib/session'

async function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value
  return token ? verifySession(token) : false
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await auth(req))) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const snap = await getDoc(doc(db, 'partners', id))
  if (!snap.exists()) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json({ id: snap.id, ...snap.data() })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await auth(req))) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  await updateDoc(doc(db, 'partners', id), { ...body, updatedAt: serverTimestamp() })
  return Response.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await auth(req))) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await deleteDoc(doc(db, 'partners', id))
  return Response.json({ ok: true })
}
