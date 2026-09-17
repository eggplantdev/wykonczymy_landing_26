import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { seedAll } from '@scripts/seed/run'

import { beforeAll, describe, expect, it } from 'vitest'

let payload: Payload

const serviceCardIds = async () => {
  const { docs } = await payload.find({
    collection: 'pages',
    locale: 'pl',
    depth: 0,
    limit: 1,
    where: { pageType: { equals: 'home' } },
  })

  return (docs[0]?.home?.services?.cards ?? []).map((card) => card.id)
}

describe('seed', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    await seedAll(payload)
  })

  // Payload matches array rows by id, so a row rewritten without one is a *new* row: the old
  // one is deleted along with the photos an editor attached to it. Re-seeding must therefore
  // leave the row ids alone, which is what AGENTS.md promises about uploads surviving.
  it('keeps the home page array rows across a re-run', async () => {
    const before = await serviceCardIds()
    expect(before.length).toBeGreaterThan(0)

    await seedAll(payload)

    expect(await serviceCardIds()).toEqual(before)
  })

  it('writes both locales of a shared array row', async () => {
    const [pl, en] = await Promise.all(
      (['pl', 'en'] as const).map(async (locale) => {
        const { docs } = await payload.find({
          collection: 'pages',
          locale,
          depth: 0,
          limit: 1,
          where: { pageType: { equals: 'home' } },
        })
        return (docs[0]?.home?.services?.cards ?? []).map((card) => card.title)
      }),
    )

    expect(pl).toHaveLength(en.length)
    expect(pl[0]).not.toEqual(en[0])
  })
})
