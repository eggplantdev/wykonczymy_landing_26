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

    for (const path of ['/', '/realizacje/']) {
      await page.goto(`http://localhost:3000${path}`)

      // The project detail page carries the most wrappers — description, details and one per
      // gallery row — and its rows are the tallest, so it is reached through the listing.
      // `gridContainer` is `ProjectRow`'s own root class: a bare href match would take the header
      // nav's link back to the listing and this would silently test `/realizacje/` twice.
      if (path === '/realizacje/') {
        const href = await page
          .locator('a.gridContainer[href*="/realizacje/"]')
          .first()
          .getAttribute('href')
        expect(href, 'no project row on the listing').toBeTruthy()
        await page.goto(`http://localhost:3000${href}`)
      }

      await scrollThrough(page)

      const hidden = await page.evaluate(() =>
        [...document.querySelectorAll('[style*="opacity"]')]
          .filter((element) => getComputedStyle(element).opacity === '0')
          .map(
            (element) =>
              `${element.tagName} h=${Math.round(element.getBoundingClientRect().height)}`,
          ),
      )
      expect(hidden, `left hidden on ${path}`).toEqual([])
    }
  })
}
