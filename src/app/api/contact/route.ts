import { NextRequest } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

type ContactPayload = {
  firstName: string
  lastName: string
  phone?: string
  email: string
  message: string
}

export async function POST(request: NextRequest) {
  let body: ContactPayload

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { firstName, lastName, email, message } = body

  if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !message?.trim()) {
    return Response.json(
      { error: 'firstName, lastName, email, and message are required' },
      { status: 422 }
    )
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return Response.json({ error: 'Invalid email address' }, { status: 422 })
  }

  await addDoc(collection(db, 'contacts'), {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    phone: body.phone?.trim() ?? '',
    message: message.trim(),
    submittedAt: serverTimestamp(),
    read: false,
  })

  return Response.json(
    { success: true, message: 'Your message has been received. We will be in touch shortly.' },
    { status: 200 }
  )
}
