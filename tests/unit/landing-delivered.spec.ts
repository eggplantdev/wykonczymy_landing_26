import { beforeEach, describe, expect, it, vi } from 'vitest'

const SECRET = '2b7e4f0a9d1c635847ea02fb5d9c81763a4e0f28bc5619d3708af41e6b2d95c7'
const SUBMISSION_ID = '9f2c1b64-7d3a-4e58-9a10-6c5b2e8f4d71'

const blob = vi.hoisted(() => ({
  list: vi.fn(async () => ({ blobs: [] as { url: string }[] })),
  del: vi.fn(async () => undefined),
}))

vi.mock('@vercel/blob', () => blob)
vi.mock('@/lib/env.server', () => ({ serverEnv: { LANDING_WEBHOOK_SECRET: SECRET } }))

const { POST } = await import('@/app/api/webhooks/landing-delivered/route')
const { sign } = await import('@/lib/contact/sign')

const post = (rawBody: string, signature?: string) =>
  POST(
    new Request('http://localhost/api/webhooks/landing-delivered', {
      method: 'POST',
      body: rawBody,
      headers: signature === undefined ? {} : { 'x-landing-signature': signature },
    }),
  )

const signed = (rawBody: string) => post(rawBody, sign(rawBody, SECRET, 'landing-cleanup'))

const body = JSON.stringify({ submissionId: SUBMISSION_ID })

beforeEach(() => {
  vi.clearAllMocks()
  blob.list.mockResolvedValue({ blobs: [] })
})

describe('POST /api/webhooks/landing-delivered', () => {
  it('deletes exactly what the prefix holds', async () => {
    blob.list.mockResolvedValue({
      blobs: [{ url: 'https://store/a.jpg' }, { url: 'https://store/b.pdf' }],
    })

    const response = await signed(body)

    expect(response.status).toBe(200)
    expect(blob.list).toHaveBeenCalledWith({ prefix: `leads/${SUBMISSION_ID}/` })
    expect(blob.del).toHaveBeenCalledWith(['https://store/a.jpg', 'https://store/b.pdf'])
  })

  // A replay must delete nothing twice rather than answer as a failure.
  it('answers 200 for a prefix that is already empty', async () => {
    const response = await signed(body)

    expect(response.status).toBe(200)
    expect(blob.del).not.toHaveBeenCalled()
  })

  it('refuses a bad signature without deleting anything', async () => {
    const response = await post(body, 'sha256=deadbeef')

    expect(response.status).toBe(403)
    expect(blob.list).not.toHaveBeenCalled()
  })

  it('refuses a missing signature', async () => {
    expect((await post(body)).status).toBe(403)
  })

  // The whole reason the key is scoped: a forwarded envelope also names a submissionId.
  it('refuses a signature minted for the submission direction', async () => {
    const response = await post(body, sign(body, SECRET, 'landing-submission'))

    expect(response.status).toBe(403)
    expect(blob.list).not.toHaveBeenCalled()
  })

  it('answers 400 when the signed body is not JSON', async () => {
    expect((await signed('not json')).status).toBe(400)
  })

  it('answers 400 for a submissionId that is not a uuid', async () => {
    const response = await signed(JSON.stringify({ submissionId: '../../hero.jpg' }))

    expect(response.status).toBe(400)
    expect(blob.list).not.toHaveBeenCalled()
  })

  it('answers 500 when the delete itself fails, leaving it to the sweep', async () => {
    blob.list.mockRejectedValue(new Error('store unreachable'))

    expect((await signed(body)).status).toBe(500)
  })
})
