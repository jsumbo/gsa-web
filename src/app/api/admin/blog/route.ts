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

  const q = query(collection(db, 'blog_posts'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  const posts = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  return Response.json({ posts })
}

export async function POST(req: NextRequest) {
  if (!(await auth(req))) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const slug = body.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  const ref = await addDoc(collection(db, 'blog_posts'), {
    ...body,
    slug,
    status: body.status ?? 'draft',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: body.status === 'published' ? serverTimestamp() : null,
  })

  return Response.json({ id: ref.id, slug }, { status: 201 })
}
