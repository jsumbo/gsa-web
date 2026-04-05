import { NextRequest } from 'next/server'
import { db } from '@/lib/firebase'
import {
  collection, getDocs, addDoc, orderBy, query, serverTimestamp,
} from 'firebase/firestore'
import { verifySession, COOKIE } from '@/lib/session'

async function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value
  return token ? verifySession(token) : false
}

export async function GET(req: NextRequest) {
  if (!(await auth(req))) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const q = query(collection(db, 'ambassadors'), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  const ambassadors = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  return Response.json({ ambassadors })
}

export async function POST(req: NextRequest) {
  if (!(await auth(req))) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const ref = await addDoc(collection(db, 'ambassadors'), {
    name: body.name ?? '',
    title: body.title ?? '',
    sport: body.sport ?? '',
    bio: body.bio ?? '',
    image: body.image ?? '',
    order: body.order ?? 99,
    createdAt: serverTimestamp(),
  })

  return Response.json({ id: ref.id }, { status: 201 })
}
