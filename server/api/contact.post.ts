const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TOPICS = { project: 'A project', job: 'A job', other: 'Something else' } as const

interface ContactBody {
  name?: string
  email?: string
  topic?: keyof typeof TOPICS
  message?: string
  website?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ContactBody>(event)

  // Honeypot filled in: pretend it worked so bots don't retry
  if (body?.website) return { ok: true }

  const name = body?.name?.trim().slice(0, 200)
  const email = body?.email?.trim().slice(0, 320)
  const topic = TOPICS[body?.topic ?? 'other'] ?? TOPICS.other
  const message = body?.message?.trim().slice(0, 5000) ?? ''

  if (!name || !email || !EMAIL.test(email)) {
    throw createError({ statusCode: 422, statusMessage: 'Name and a valid email are required' })
  }

  const { resendApiKey, contactTo, contactFrom } = useRuntimeConfig(event)

  if (!resendApiKey || !contactTo || !contactFrom) {
    if (import.meta.dev) {
      console.info('[contact] Email delivery not configured, message:', { name, email, topic, message })
      return { ok: true }
    }
    throw createError({ statusCode: 503, statusMessage: 'Contact form is not configured' })
  }

  await $fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendApiKey}` },
    body: {
      from: contactFrom,
      to: contactTo,
      reply_to: email,
      subject: `Portfolio: ${topic} from ${name}`,
      text: `${name} <${email}>\nTopic: ${topic}\n\n${message || '(no message)'}`
    }
  })

  return { ok: true }
})
