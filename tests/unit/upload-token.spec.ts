import { beforeEach, describe, expect, it, vi } from 'vitest'

import { MAX_FILES } from '@/lib/contact/attachments'
import { emptyContactValues } from '@/lib/contact/contact-schema'

// Mocked at the module boundary: `handleUpload` talks to the blob service and reads a token from
// the environment, neither of which is what this route owns. What it owns is the callback — so the
// mock captures it and the tests call it directly.
const handleUpload = vi.hoisted(() => vi.fn())
const blob = vi.hoisted(() => ({
  list: vi.fn(async () => ({ blobs: [] as { pathname: string }[] })),
}))
vi.mock('@vercel/blob/client', () => ({ handleUpload }))
vi.mock('@vercel/blob', () => blob)

const { POST } = await import('@/app/api/blob/upload-token/route')

const SUBMISSION_ID = '9f2c1b64-7d3a-4e58-9a10-6c5b2e8f4d71'
const values = { ...emptyContactValues(), email: 'anna@example.com', acceptsTerms: true }

/** A prefix sitting exactly on the ceiling, so the next token request is the one over it. */
const blobsAtCeiling = () => ({
  blobs: Array.from({ length: MAX_FILES }, (_unused, index) => ({
    pathname: `leads/${SUBMISSION_ID}/${index}.jpg`,
  })),
})

type BeforeTokenT = (
  pathname: string,
  clientPayload: string | null,
  multipart: boolean,
) => Promise<unknown>

/** Runs the route, then replays its `onBeforeGenerateToken` against the given upload request. */
const mintToken = async (pathname: string, clientPayload: unknown) => {
  handleUpload.mockResolvedValue({ type: 'blob.generate-client-token' })

  const response = await POST(
    new Request('http://localhost/api/blob/upload-token', { method: 'POST', body: '{}' }),
  )

  const { onBeforeGenerateToken } = handleUpload.mock.calls[0][0] as {
    onBeforeGenerateToken: BeforeTokenT
  }

  return {
    response,
    generate: () => onBeforeGenerateToken(pathname, JSON.stringify(clientPayload), false),
  }
}

// Braced deliberately: an arrow returning the mock hands vitest a *function*, which it then runs
// as a cleanup hook — calling the route's own dependency again, with no arguments.
beforeEach(() => {
  handleUpload.mockClear()
  blob.list.mockResolvedValue({ blobs: [] })
})

describe('POST /api/blob/upload-token', () => {
  it('pins the token to the submission prefix and the shared ceilings', async () => {
    const { generate } = await mintToken(`leads/${SUBMISSION_ID}/room.jpg`, {
      submissionId: SUBMISSION_ID,
      values,
    })

    await expect(generate()).resolves.toEqual({
      allowedContentTypes: ['image/*', 'application/pdf'],
      maximumSizeInBytes: 8 * 1024 * 1024,
      addRandomSuffix: false,
      tokenPayload: SUBMISSION_ID,
    })
  })

  // The store root holds CMS media under exact filenames, written with `allowOverwrite: true`.
  it('refuses a pathname at the store root', async () => {
    const { generate } = await mintToken('hero.jpg', { submissionId: SUBMISSION_ID, values })

    await expect(generate()).rejects.toThrow(/prefix/i)
  })

  it("refuses another submission's prefix", async () => {
    const { generate } = await mintToken('leads/00000000-0000-4000-8000-000000000000/room.jpg', {
      submissionId: SUBMISSION_ID,
      values,
    })

    await expect(generate()).rejects.toThrow(/prefix/i)
  })

  it('refuses a malformed submissionId', async () => {
    const { generate } = await mintToken('leads/../room.jpg', {
      submissionId: '../..',
      values,
    })

    await expect(generate()).rejects.toThrow(/submissionId/i)
  })

  // Form validity is the whole gate — there is no visitor to authenticate.
  it('refuses an enquiry that does not validate', async () => {
    const { generate } = await mintToken(`leads/${SUBMISSION_ID}/room.jpg`, {
      submissionId: SUBMISSION_ID,
      values: { ...values, email: 'not-an-address' },
    })

    await expect(generate()).rejects.toThrow(/enquiry/i)
  })

  it('answers 400 rather than 500 when the token cannot be minted', async () => {
    handleUpload.mockImplementation(() => {
      throw new Error('Invalid enquiry')
    })

    const response = await POST(
      new Request('http://localhost/api/blob/upload-token', { method: 'POST', body: '{}' }),
    )

    expect(response.status).toBe(400)
  })

  // Each file is its own token request, so the browser's and the action's copies of MAX_FILES both
  // run after the bytes are already in the store. Unenforced here, one prefix takes unbounded 8 MB
  // objects from a public route and the 24h sweep is the only thing that ever reclaims them.
  it('refuses a token once the prefix already holds the ceiling', async () => {
    blob.list.mockResolvedValue(blobsAtCeiling())

    const { generate } = await mintToken(`leads/${SUBMISSION_ID}/sixteenth.jpg`, {
      submissionId: SUBMISSION_ID,
      values,
    })

    await expect(generate()).rejects.toThrow('Too many files')
  })

  // A retry of the same file is a replacement, not a sixteenth object.
  it('counts a re-upload of a path it already holds as that same file', async () => {
    blob.list.mockResolvedValue(blobsAtCeiling())

    const { generate } = await mintToken(`leads/${SUBMISSION_ID}/3.jpg`, {
      submissionId: SUBMISSION_ID,
      values,
    })

    await expect(generate()).resolves.toMatchObject({ tokenPayload: SUBMISSION_ID })
  })

  it('counts only within this submission prefix', async () => {
    await mintToken(`leads/${SUBMISSION_ID}/a.jpg`, { submissionId: SUBMISSION_ID, values }).then(
      ({ generate }) => generate(),
    )

    expect(blob.list).toHaveBeenCalledWith({
      prefix: `leads/${SUBMISSION_ID}/`,
      limit: MAX_FILES + 1,
    })
  })

  // Regression: `request.json()` sat outside the try, so a non-JSON body was the one refusal that
  // answered 500 — and the throttle probe reads the status to tell a deny from a malformed body.
  it('answers a non-JSON body with the route own 400', async () => {
    const response = await POST(
      new Request('http://localhost/api/blob/upload-token', { method: 'POST', body: 'not json' }),
    )

    expect(response.status).toBe(400)
  })
})
