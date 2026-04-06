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
  const q = query(collection(db, 'products'), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  const products = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  return Response.json({ products })
}

export async function POST(req: NextRequest) {
  if (!(await auth(req))) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const ref = await addDoc(collection(db, 'products'), {
    name: body.name ?? '',
    price: body.price ?? 0,
    image: body.image ?? '',
    description: body.description ?? '',
    category: body.category ?? 'General',
    available: body.available ?? true,
    order: body.order ?? 99,
    sizes: body.sizes ?? [],
    createdAt: serverTimestamp(),
  })
  return Response.json({ id: ref.id }, { status: 201 })
}
