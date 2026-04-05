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

  const q = query(collection(db, 'partners'), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  const partners = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  return Response.json({ partners })
}

export async function POST(req: NextRequest) {
  if (!(await auth(req))) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const ref = await addDoc(collection(db, 'partners'), {
    name: body.name ?? '',
    logo: body.logo ?? '',
    url: body.url ?? '',
    order: body.order ?? 99,
    createdAt: serverTimestamp(),
  })

  return Response.json({ id: ref.id }, { status: 201 })
}
