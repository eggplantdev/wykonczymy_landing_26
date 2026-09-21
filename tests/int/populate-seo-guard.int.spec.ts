import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

let payload: Payload
const created: (string | number)[] = []

// `scripts/populate-seo.ts` writes a description onto every published page. `payload.update`
// merges onto the *latest* version rather than the published one, so a page holding unpublished
// editorial work would have that draft published as a side effect — reproduced during the S7
// review gate, see `context/changes/2026-09-20-s7-seo/review-gate.md`.
//
// The script guards against it by asking a `draft: true` query which pages have a pending draft
// and skipping those. That guard is only as good as the Payload behaviour it keys on, and that
// behaviour is not ours — a version bump could change it silently and the next run of the script
// would publish someone's half-written page. This pins both halves.
describe('the populate-seo draft guard', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  afterAll(async () => {
    for (const id of created) await payload.delete({ collection: 'pages', id })
  })

  it('reports a pending draft as unpublished, while the published list still shows the page', async () => {
    const page = await payload.create({
      collection: 'pages',
      locale: 'pl',
      data: {
        title: 'Strona z szkicem',
        slug: 'strona-z-szkicem',
        pageType: 'contact',
        _status: 'published',
      } as never,
    })
    created.push(page.id)

    await payload.update({
      collection: 'pages',
      id: page.id,
      locale: 'pl',
      draft: true,
      data: { title: 'Tytul tylko w szkicu', _status: 'draft' } as never,
    })

    // What the script's write set is built from: the page is still live, still under its
    // published title.
    const { docs: published } = await payload.find({
      collection: 'pages',
      locale: 'pl',
      where: { _status: { equals: 'published' }, id: { equals: page.id } },
    })
    expect(published).toHaveLength(1)
    expect(published[0].title).toBe('Strona z szkicem')

    // What the guard keys on: the latest version is the draft, so the page is skipped.
    const { docs: latest } = await payload.find({
      collection: 'pages',
      locale: 'pl',
      draft: true,
      where: { id: { equals: page.id } },
    })
    expect(latest).toHaveLength(1)
    expect(latest[0]._status).not.toBe('published')
    expect(latest[0].title).toBe('Tytul tylko w szkicu')
  })

  it('reports a page with no pending draft as published, so it is still written', async () => {
    const page = await payload.create({
      collection: 'pages',
      locale: 'pl',
      data: {
        title: 'Strona bez szkicu',
        slug: 'strona-bez-szkicu',
        pageType: 'contact',
        _status: 'published',
      } as never,
    })
    created.push(page.id)

    const { docs: latest } = await payload.find({
      collection: 'pages',
      locale: 'pl',
      draft: true,
      where: { id: { equals: page.id } },
    })

    expect(latest[0]._status).toBe('published')
  })
})
