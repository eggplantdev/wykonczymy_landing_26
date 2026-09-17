import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { findProjects } from '@/lib/content/projects'

import { beforeAll, describe, expect, it } from 'vitest'

let payload: Payload

describe('findProjects', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  // `fallback: false`: a project translated in Polish only has no English slug, so linking to
  // it from the English site would build `/en/completed-works/null/`.
  it('omits a project that has no translation in the requested locale', async () => {
    // Published, because that is what `findProjects` filters on — so cleanup runs in `finally`
    // and is allowed to throw: a leaked row here is a live project on `/realizacje/` that also
    // burns its unique slug.
    const doc = await payload.create({
      collection: 'projects',
      locale: 'pl',
      data: {
        title: 'Tylko po polsku',
        slug: 'tylko-po-polsku',
        summary: 'Realizacja bez wersji angielskiej.',
        _status: 'published',
      },
    })

    try {
      const [pl, en] = await Promise.all([findProjects('pl'), findProjects('en')])

      expect(pl.map((project) => project.slug)).toContain('tylko-po-polsku')
      expect(en.map((project) => project.slug)).not.toContain('tylko-po-polsku')
    } finally {
      await payload.delete({ collection: 'projects', id: doc.id })
    }
  })
})
