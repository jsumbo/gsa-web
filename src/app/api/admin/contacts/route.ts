import { NextRequest } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, orderBy, query, doc, updateDoc } from 'firebase/firestore'
import { verifySession, COOKIE } from '@/lib/session'

async function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value
  return token ? verifySession(token) : false
}

export async function GET(req: NextRequest) {
  if (!(await auth(req))) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const q = query(collection(db, 'contacts'), orderBy('submittedAt', 'desc'))
  const snap = await getDocs(q)
  const contacts = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  return Response.json({ contacts })
}

export async function PATCH(req: NextRequest) {
  if (!(await auth(req))) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, read } = await req.json()
  await updateDoc(doc(db, 'contacts', id), { read })
  return Response.json({ ok: true })
}
