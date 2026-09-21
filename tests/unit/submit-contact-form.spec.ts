import { beforeEach, describe, expect, it, vi } from 'vitest'

import { emptyContactValues } from '@/lib/contact/contact-schema'
import { LANDING_SUBMISSION } from '../fixtures/landing-submission'

// Everything downstream of the action is mocked: the queue needs Payload and a database, the
// forward needs the leads app. What the action owns is the *order* — store, answer, then forward —
// and which of the two endings each forward result leads to.
const queue = vi.hoisted(() => ({
  enqueue: vi.fn(async () => ({ id: 7 })),
  deleteRow: vi.fn(async () => undefined),
  recordFailure: vi.fn(async () => undefined),
}))
const forward = vi.hoisted(() =>
  vi.fn<() => Promise<{ delivered: true } | { delivered: false; error: string }>>(async () => ({
    delivered: true,
  })),
)
// `after` defers to when the response is already sent; running it inline is what lets the test
// observe the delivery at all.
const after = vi.hoisted(() => vi.fn((callback: () => Promise<void>) => callback()))

vi.mock('@/lib/content/submissions', () => queue)
vi.mock('@/lib/contact/forward', () => ({ forward }))
vi.mock('next/server', () => ({ after }))

const { submitContactForm } = await import('@/lib/contact/submit-contact-form')

const input = {
  submissionId: LANDING_SUBMISSION.submissionId,
  values: { ...emptyContactValues(), email: LANDING_SUBMISSION.email, acceptsTerms: true },
  assets: LANDING_SUBMISSION.assets,
}

beforeEach(() => {
  vi.clearAllMocks()
  forward.mockResolvedValue({ delivered: true })
})

describe('submitContactForm', () => {
  it('queues the envelope before answering the visitor', async () => {
    await expect(submitContactForm(input)).resolves.toEqual({ ok: true })

    expect(queue.enqueue).toHaveBeenCalledWith(
      expect.objectContaining({
        submissionId: input.submissionId,
        email: input.values.email,
        assets: input.assets,
      }),
    )
    expect(after).toHaveBeenCalled()
  })

  it('deletes the row once the forward is delivered', async () => {
    await submitContactForm(input)

    expect(forward).toHaveBeenCalledOnce()
    expect(queue.deleteRow).toHaveBeenCalledWith(input.submissionId)
    expect(queue.recordFailure).not.toHaveBeenCalled()
  })

  // The visitor was already answered, so a failed forward is the cron's problem — and the row is
  // what carries it there.
  it('records the failure and keeps the row when the forward is retryable', async () => {
    forward.mockResolvedValue({ delivered: false, error: 'Leads app answered 500' })

    await expect(submitContactForm(input)).resolves.toEqual({ ok: true })

    expect(queue.recordFailure).toHaveBeenCalledWith(7, 'Leads app answered 500')
    expect(queue.deleteRow).not.toHaveBeenCalled()
  })

  // The only failure the visitor is told about: nothing was stored, so nothing will be retried.
  it('reports an error and forwards nothing when the queue write fails', async () => {
    queue.enqueue.mockRejectedValueOnce(new Error('no database'))

    await expect(submitContactForm(input)).resolves.toEqual({ ok: false, errorKey: 'error' })

    expect(after).not.toHaveBeenCalled()
    expect(forward).not.toHaveBeenCalled()
  })

  it('refuses an enquiry that does not validate', async () => {
    const result = await submitContactForm({ ...input, values: { ...input.values, email: 'nope' } })

    expect(result).toEqual({ ok: false, errorKey: 'invalidEmail' })
    expect(queue.enqueue).not.toHaveBeenCalled()
  })

  // The descriptors are the browser's word, and the leads app fetches whatever url is in them.
  it('refuses an asset the store would never have accepted', async () => {
    const result = await submitContactForm({
      ...input,
      assets: [{ ...input.assets[0], contentType: 'text/html' }],
    })

    expect(result).toEqual({ ok: false, errorKey: 'error' })
    expect(queue.enqueue).not.toHaveBeenCalled()
  })

  // Silence is the whole mechanism: a refusal tells the filler which field to leave alone next time.
  it('answers a honeypot submission as sent and stores nothing', async () => {
    await expect(submitContactForm({ ...input, trap: 'ACME Ltd' })).resolves.toEqual({ ok: true })

    expect(queue.enqueue).not.toHaveBeenCalled()
    expect(forward).not.toHaveBeenCalled()
  })

  it('queues an enquiry whose honeypot is empty or absent', async () => {
    await submitContactForm({ ...input, trap: '' })
    await submitContactForm(input)

    expect(queue.enqueue).toHaveBeenCalledTimes(2)
  })

  it('refuses a malformed submissionId', async () => {
    const result = await submitContactForm({ ...input, submissionId: 'not-a-uuid' })

    expect(result).toEqual({ ok: false, errorKey: 'error' })
    expect(queue.enqueue).not.toHaveBeenCalled()
  })

  // Regression: `.catch('')` rewrote an overlong trap to empty, which reads as falsy — so a bot
  // walked straight past the honeypot by overfilling the field it was meant to be caught by.
  it.each([
    ['an overlong value', 'x'.repeat(500)],
    ['a non-string value', 12_345],
    ['a short value', 'buy-backlinks'],
  ])('answers a honeypot filled with %s as sent, storing nothing', async (_label, trap) => {
    await expect(submitContactForm({ ...input, trap })).resolves.toEqual({ ok: true })

    expect(queue.enqueue).not.toHaveBeenCalled()
    expect(forward).not.toHaveBeenCalled()
  })

  // The leads app fetches every url we sign and pins only the host — the same host that serves this
  // site's CMS media. Without the path check, a forged call makes it fetch anything in the store.
  it.each([
    ['the store root', 'https://landing-assets.public.blob.vercel-storage.com/hero-photo.jpg'],
    [
      "another submission's prefix",
      'https://landing-assets.public.blob.vercel-storage.com/leads/11111111-2222-3333-4444-555555555555/x.jpg',
    ],
  ])('refuses an asset url pointing at %s', async (_label, url) => {
    const assets = [{ ...input.assets[0], url }]

    await expect(submitContactForm({ ...input, assets })).resolves.toEqual({
      ok: false,
      errorKey: 'error',
    })
    expect(queue.enqueue).not.toHaveBeenCalled()
  })

  // The far side releases the prefix once it holds as many files as the envelope listed, so a
  // repeated url satisfies that count while leaving the staged files orphaned forever.
  it('refuses an envelope that lists the same asset twice', async () => {
    const assets = [input.assets[0], input.assets[0]]

    await expect(submitContactForm({ ...input, assets })).resolves.toEqual({
      ok: false,
      errorKey: 'error',
    })
    expect(queue.enqueue).not.toHaveBeenCalled()
  })
})
