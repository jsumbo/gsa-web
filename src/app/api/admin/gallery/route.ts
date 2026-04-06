import { NextRequest } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { verifySession, COOKIE } from '@/lib/session'

async function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value
  return token ? verifySession(token) : false
}

export async function GET(req: NextRequest) {
  if (!(await auth(req))) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  const photos = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  return Response.json({ photos })
}

export async function POST(req: NextRequest) {
  if (!(await auth(req))) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const ref = await addDoc(collection(db, 'gallery'), {
    imageUrl: body.imageUrl ?? '',
    caption: body.caption ?? '',
    createdAt: serverTimestamp(),
  })
  return Response.json({ id: ref.id }, { status: 201 })
}
