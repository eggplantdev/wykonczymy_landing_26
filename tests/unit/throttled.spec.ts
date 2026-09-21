import { afterEach, describe, expect, it, vi } from 'vitest'

import { isThrottled } from '@/lib/contact/throttled'

const answer = (status: number) =>
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(null, { status })),
  )

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('isThrottled', () => {
  // 403 is the Firewall denying at the edge; the route itself never answers one.
  it('reads a 403 as throttled', async () => {
    answer(403)

    await expect(isThrottled()).resolves.toBe(true)
  })

  // What the route answers an empty body — the visitor is not throttled, the upload just failed.
  it('reads a refusal from the route itself as not throttled', async () => {
    answer(400)

    await expect(isThrottled()).resolves.toBe(false)
  })

  it('reads an unreachable network as not throttled', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch')
      }),
    )

    await expect(isThrottled()).resolves.toBe(false)
  })
})
