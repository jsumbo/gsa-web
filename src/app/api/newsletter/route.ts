import { NextRequest } from 'next/server'

type NewsletterPayload = {
  email: string
}

export async function POST(request: NextRequest) {
  let body: NewsletterPayload

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { email } = body

  if (!email?.trim()) {
    return Response.json({ error: 'email is required' }, { status: 422 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return Response.json({ error: 'Invalid email address' }, { status: 422 })
  }

  console.log('[Newsletter subscription]', {
    email,
    subscribedAt: new Date().toISOString(),
  })

  return Response.json(
    { success: true, message: 'You have been subscribed to the GSA newsletter.' },
    { status: 200 }
  )
}
