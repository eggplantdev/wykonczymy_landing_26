import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { LANDING_SUBMISSION } from '../fixtures/landing-submission'
import type { SubmissionEnvelopeT } from '@/lib/contact/envelope'

const WEBHOOK_URL = 'https://leads.example.com/api/webhooks/landing'
const SECRET = '2b7e4f0a9d1c635847ea02fb5d9c81763a4e0f28bc5619d3708af41e6b2d95c7'

vi.mock('@/lib/env.server', () => ({
  serverEnv: { WYKONCZYMY_WEBHOOK_URL: WEBHOOK_URL, LANDING_WEBHOOK_SECRET: SECRET },
}))

const { forward } = await import('@/lib/contact/forward')
const { verify } = await import('@/lib/contact/sign')

const envelope = {
  ...LANDING_SUBMISSION,
  rawData: [],
  formQuestions: [],
} satisfies SubmissionEnvelopeT

const answering = (status: number) => {
  const fetchMock = vi.fn(async () => new Response(null, { status }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

beforeEach(() => {
  vi.unstubAllGlobals()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('forward', () => {
  it('signs the exact bytes it sends, under the submission scope', async () => {
    const fetchMock = answering(200)

    await forward(envelope)

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    const signature = (init.headers as Record<string, string>)['x-landing-signature']

    expect(url).toBe(WEBHOOK_URL)
    expect(verify(init.body as string, signature, SECRET, 'landing-submission')).toBe(true)
    // The bytes on the wire ARE the bytes that were signed — not an equal object.
    expect(init.body).toBe(JSON.stringify(envelope))
  })

  it('treats 200 as delivered', async () => {
    answering(200)

    await expect(forward(envelope)).resolves.toEqual({ delivered: true })
  })

  // Regression: a 4xx used to answer `delivered: true`, and the caller answers that by deleting
  // the row — so a rotated secret (403) or a typo'd url (404) destroyed every lead in silence.
  it.each([400, 401, 403, 404])('keeps the row on %i and records the status', async (status) => {
    answering(status)

    await expect(forward(envelope)).resolves.toEqual({
      delivered: false,
      error: `Leads app answered ${status}`,
    })
  })

  it('leaves a 500 for the cron to retry', async () => {
    answering(500)

    await expect(forward(envelope)).resolves.toMatchObject({ delivered: false })
  })

  it('gives up on a hung connection rather than holding the batch', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, init: RequestInit) => {
        expect(init.signal).toBeInstanceOf(AbortSignal)
        throw Object.assign(new Error('The operation was aborted due to timeout'), {
          name: 'TimeoutError',
        })
      }),
    )

    await expect(forward(envelope)).resolves.toMatchObject({ delivered: false })
  })

  it('leaves a transport failure for the cron to retry', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('ECONNREFUSED')
      }),
    )

    await expect(forward(envelope)).resolves.toEqual({
      delivered: false,
      error: 'Transport failure: ECONNREFUSED',
    })
  })
})
