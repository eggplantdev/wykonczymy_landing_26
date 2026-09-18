import type { Payload } from 'payload'
import { describe, expect, it } from 'vitest'

import { seedStylePhotos } from '@scripts/seed/photos'

const emptyPayload = { find: async () => ({ docs: [] }) } as unknown as Payload

describe('seedStylePhotos', () => {
  // Without this the loop over zero styles just ends: nothing is written, nothing warns and
  // the exit code is 0, so `pnpm seed:photos` against a fresh database looks like it worked.
  it('refuses to run before the styles exist', async () => {
    await expect(seedStylePhotos(emptyPayload)).rejects.toThrow(/pnpm seed/)
  })
})
