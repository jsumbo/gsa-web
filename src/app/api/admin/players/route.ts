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

  const team = req.nextUrl.searchParams.get('team')
  const q = query(collection(db, 'players'), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  let players = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  if (team) players = players.filter((p: Record<string, unknown>) => p.team === team)
  return Response.json({ players })
}

export async function POST(req: NextRequest) {
  if (!(await auth(req))) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const ref = await addDoc(collection(db, 'players'), {
    name: body.name ?? '',
    number: body.number ?? 0,
    position: body.position ?? 'midfielder',
    team: body.team ?? 'first-team',
    image: body.image ?? '',
    order: body.order ?? 99,
    createdAt: serverTimestamp(),
  })

  return Response.json({ id: ref.id }, { status: 201 })
}
