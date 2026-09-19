import { describe, expect, it } from 'vitest'

import { toScope } from '@/lib/content/specs'

describe('toScope', () => {
  // The mapper is the only place the editor's icon key crosses from the CMS row to the
  // renderer. Drop it here and every scope row silently falls back to a tick, which reads
  // as "the picker does nothing" rather than as a broken mapping.
  it('carries the icon key through, and leaves it unset on rows that have none', () => {
    const [electrics, walls] = toScope([{ name: 'Elektryka', icon: 'bolt' }, { name: 'Ściany' }])

    expect(electrics.icon).toBe('bolt')
    expect(walls.icon).toBe(undefined)
  })
})
