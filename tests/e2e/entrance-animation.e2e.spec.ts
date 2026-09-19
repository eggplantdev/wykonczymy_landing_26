import { test, expect, type Page } from '@playwright/test'

// `FadeUp` waits for 30% of itself to be on screen, and an IntersectionObserver's ratio caps at
// `viewport / element` — so a wrapper taller than ~3.3 viewports can never reach that and stays at
// `opacity: 0` for good, with the rest of the page around it rendering fine. Element heights come
// from CMS copy and photo counts, so nothing in the source can rule it out; only scrolling a real
// page can. Both viewports run because the cliff is a ratio, and the short one is the mobile one.
const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
]

// Both halves of a section carry wrappers, so both get swept: a listing has one per card, and the
// detail page behind it has the most of any page — copy, then gallery rows or a photo grid. The
// selector is the card's own root class rather than the href, because the header nav links to the
// listing too and `first()` would pick that up and sweep the listing a second time.
const LISTINGS = [
  { path: '/realizacje/', card: 'a.gridContainer[href*="/realizacje/"]' },
  { path: '/wykonczenia/', card: 'a.border-border[href*="/wykonczenia/"]' },
]

// The page grows while it is scrolled — below-the-fold images only start loading as they approach
// the viewport — so the end has to be re-read every step. Sampling `scrollHeight` once stops the
// sweep short of the sections added since, and they are reported hidden because they were never
// reached, not because the entrance is broken.
async function scrollThrough(page: Page) {
  for (let y = 0; ; y += 300) {
    await page.evaluate((offset) => window.scrollTo(0, offset), y)
    await page.waitForTimeout(120)

    const end = await page.evaluate(() => document.body.scrollHeight - window.innerHeight)
    if (y >= end) break
  }
  await page.waitForTimeout(800)

  // Back to the top before anything is read: `FadeUp` is `once`, so a wrapper that fired stays
  // visible up here, while the hero's scroll-linked fade is only at zero *because* the page is
  // scrolled past it. Sweeping from the bottom would report that as a stuck section.
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(800)
}

async function sweep(page: Page, label: string) {
  await scrollThrough(page)

  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll('[style*="opacity"]')]
      .filter((element) => getComputedStyle(element).opacity === '0')
      .map(
        (element) => `${element.tagName} h=${Math.round(element.getBoundingClientRect().height)}`,
      ),
  )
  expect(hidden, `left hidden on ${label}`).toEqual([])
}

// The page transition fades the whole body in on mount rather than on scroll, so it must be visible
// without touching the scrollbar. Asserted separately because a body-sized `whileInView` wrapper
// would be past the ratio cliff above and would leave the page blank under a header and footer that
// render fine — which is exactly what happened once.
test('the page body becomes visible without being scrolled to', async ({ page }) => {
  await page.goto('http://localhost:3000/')

  await expect(page.locator('div.grow > div').first()).toHaveCSS('opacity', '1')
})

for (const viewport of VIEWPORTS) {
  test(`no section stays hidden after scrolling at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)

    await page.goto('http://localhost:3000/')
    await sweep(page, '/')

    for (const listing of LISTINGS) {
      await page.goto(`http://localhost:3000${listing.path}`)
      await sweep(page, listing.path)

      const href = await page.locator(listing.card).first().getAttribute('href')
      expect(href, `no card on ${listing.path}`).toBeTruthy()

      await page.goto(`http://localhost:3000${href}`)
      await sweep(page, href!)
    }
  })
}
