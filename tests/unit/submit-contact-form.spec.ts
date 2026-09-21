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

  it('refuses a malformed submissionId', async () => {
    const result = await submitContactForm({ ...input, submissionId: 'not-a-uuid' })

    expect(result).toEqual({ ok: false, errorKey: 'error' })
    expect(queue.enqueue).not.toHaveBeenCalled()
  })
})
