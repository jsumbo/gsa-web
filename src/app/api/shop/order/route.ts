import { NextRequest } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (!body.customerName || !body.email || !body.items?.length) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const hasMissingSize = body.items.some((item: { size?: string }) => item.size === '')
  if (hasMissingSize) {
    return Response.json({ error: 'Please select a size for all apparel items before checkout.' }, { status: 400 })
  }

  const ref = await addDoc(collection(db, 'orders'), {
    customerName: body.customerName,
    email: body.email,
    phone: body.phone ?? '',
    whatsapp: body.whatsapp ?? '',
    address: body.address ?? '',
    notes: body.notes ?? '',
    contactMethods: body.contactMethods ?? [],
    items: body.items,
    total: body.total ?? 0,
    status: 'pending',
    createdAt: serverTimestamp(),
  })

  return Response.json({ orderId: ref.id }, { status: 201 })
}
