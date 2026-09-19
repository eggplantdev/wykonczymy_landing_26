import { Forbidden, getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('API', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  // `overrideAccess` defaults to true on the local API, which is what makes the naive
  // version of this test pass no matter what the access rules say. Turning it off runs
  // `Users.access.read`, and Payload raises rather than returning an empty page — so
  // inverting that rule is what turns this red.
  it('refuses an anonymous caller', async () => {
    await expect(payload.find({ collection: 'users', overrideAccess: false })).rejects.toThrow(
      Forbidden,
    )
  })
})
