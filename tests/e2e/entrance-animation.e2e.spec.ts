import { test, expect } from '@playwright/test'

// `FadeUp` waits for 30% of itself to be on screen, and an IntersectionObserver's ratio caps at
// `viewport / element` — so a wrapper taller than ~3.3 viewports can never reach that and stays at
// `opacity: 0` for good, with the rest of the page around it rendering fine. Element heights come
// from CMS copy and photo counts, so nothing in the source can rule it out; only scrolling a real
// page can. Both viewports run because the cliff is a ratio, and the short one is the mobile one.
const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
]

async function scrollThrough(page: import('@playwright/test').Page) {
  const height = await page.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y < height; y += 300) {
    await page.evaluate((offset) => window.scrollTo(0, offset), y)
    await page.waitForTimeout(60)
  }
  await page.waitForTimeout(800)
}

for (const viewport of VIEWPORTS) {
  test(`no section stays hidden after scrolling at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)

    for (const path of ['/', '/realizacje/']) {
      await page.goto(`http://localhost:3000${path}`)

      // The project detail page carries the most wrappers — description, details and one per
      // gallery row — and its rows are the tallest, so it is reached through the listing.
      if (path === '/realizacje/') {
        const href = await page.locator('a[href*="/realizacje/"]').first().getAttribute('href')
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
