import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

let payload: Payload
const created: (string | number)[] = []

async function createPage(data: Record<string, unknown>) {
  const doc = await payload.create({
    collection: 'pages',
    locale: 'pl',
    // The collection's own field contract is what these tests exercise; the generated
    // create type demands every localized value up front.
    data: data as never,
  })
  created.push(doc.id)
  return doc
}

describe('Pages', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  afterAll(async () => {
    for (const id of created) {
      await payload.delete({ collection: 'pages', id }).catch(() => undefined)
    }
  })

  it('hides unpublished pages from an anonymous reader', async () => {
    const draft = await createPage({
      title: 'Szkic',
      slug: 'szkic-testowy',
      pageType: 'contact',
      _status: 'draft',
    })

    const anonymous = await payload.find({
      collection: 'pages',
      overrideAccess: false,
      draft: true,
      where: { id: { equals: draft.id } },
    })

    expect(anonymous.docs).toHaveLength(0)
  })

  it('rejects a second home page', async () => {
    // Runs against whatever home page the database already holds — seeding another
    // one is exactly what the guard forbids.
    const { totalDocs } = await payload.find({
      collection: 'pages',
      where: { isHome: { equals: true } },
      limit: 0,
      draft: true,
    })
    expect(totalDocs).toBeGreaterThan(0)

    await expect(
      createPage({
        title: 'Dom drugi',
        slug: 'dom-drugi',
        pageType: 'home',
        isHome: true,
        _status: 'draft',
      }),
    ).rejects.toThrow(/already the home page/)
  })

  it('rejects a slug that would not survive a URL', async () => {
    await expect(
      createPage({
        title: 'Zly slug',
        slug: 'a/b c',
        pageType: 'contact',
        _status: 'draft',
      }),
    ).rejects.toThrow()
  })
})
