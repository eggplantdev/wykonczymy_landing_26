import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/content/pages', () => ({ findPublishedPages: vi.fn() }))
vi.mock('@/lib/content/children', () => ({ findChildren: vi.fn() }))

// `listAddresses` is `cache()`-wrapped and takes no arguments, so a second call inside one module
// instance would hand back the first call's answer. Each case gets a fresh import instead.
const listAddressesWith = async (pages: Record<string, unknown[]>) => {
  vi.resetModules()

  const { findPublishedPages } = await import('@/lib/content/pages')
  const { findChildren } = await import('@/lib/content/children')

  vi.mocked(findPublishedPages).mockImplementation(
    async (locale) => (pages[locale] ?? []) as Awaited<ReturnType<typeof findPublishedPages>>,
  )
  vi.mocked(findChildren).mockResolvedValue([])

  const { listAddresses } = await import('@/lib/content/addresses')
  return listAddresses()
}

describe('listAddresses', () => {
  beforeEach(() => vi.clearAllMocks())

  it('drops a page that has no slug in that locale', async () => {
    const addresses = await listAddressesWith({
      pl: [{ id: 1, pageType: 'contact', slug: 'kontakt' }],
      en: [{ id: 1, pageType: 'contact', slug: '' }],
    })

    expect(addresses.map(({ path }) => path)).toEqual(['/kontakt/'])
  })

  it('drops an untranslated root rather than emitting /en/null/', async () => {
    const addresses = await listAddressesWith({
      pl: [{ id: 1, pageType: 'home', slug: 'start' }],
      en: [{ id: 1, pageType: 'home', slug: '' }],
    })

    expect(addresses.map(({ path }) => path)).toEqual(['/'])
  })

  it('emits both locales when both are translated', async () => {
    const addresses = await listAddressesWith({
      pl: [{ id: 1, pageType: 'home', slug: 'start' }],
      en: [{ id: 1, pageType: 'home', slug: 'home' }],
    })

    expect(addresses.map(({ path }) => path)).toEqual(['/', '/en/home/'])
  })
})
