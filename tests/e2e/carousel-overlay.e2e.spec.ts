import { test, expect, type Page } from '@playwright/test'

const STYLE_PAGE = '/wykonczenia/klasyczny/'
const TILE = 'Powiększ zdjęcie'
// The `ObjectCarousel` that closes the page. Its heading is `sr-only` — the slides carry
// the visible label — so the section is addressed through that, not by accessible name.
const CAROUSEL = 'section:has(> h2.sr-only) .swiper'

// Whether the carousel is still listening for arrow keys, read off the instance rather than
// by pressing a key and watching the track.
//
// Pressing the key is what this test would rather do, but it cannot yet: Swiper ignores the
// keyboard for a carousel that is off screen, and opening the lightbox throws the page's
// scroll position away (2000 → ~143, and closing does not put it back), which lands the
// carousel off screen every time, whatever the viewport or the starting scroll. That scroll
// bug is separate from this one and is filed on its own; until it is fixed no arrow press
// can reach this carousel, so a behaviour-level assertion here would pass whether or not the
// fix is present. This reads the one thing the fix actually changes.
function isListeningForKeys(page: Page) {
  return page.evaluate((selector) => {
    const track = [...document.querySelectorAll(selector)].at(-1) as
      (HTMLElement & { swiper?: { keyboard?: { enabled?: boolean } } }) | undefined

    return track?.swiper?.keyboard?.enabled ?? null
  }, CAROUSEL)
}

function isAutoplayRunning(page: Page) {
  return page.evaluate((selector) => {
    const track = [...document.querySelectorAll(selector)].at(-1) as
      (HTMLElement & { swiper?: { autoplay?: { running?: boolean } } }) | undefined

    return track?.swiper?.autoplay?.running ?? null
  }, CAROUSEL)
}

test.describe('Carousels behind an overlay', () => {
  // Swiper's Keyboard module binds on `document`, and its viewport guard asks only whether
  // the track is on screen — never whether a dialog is painted over it. So an arrow press
  // meant for the lightbox also paged the carousel underneath, and the visitor found it
  // moved on closing with no input they could connect to it. Autoplay is stopped alongside
  // for the same reason: whatever moves the track while it is covered is unaccountable.
  test('stand down while the lightbox is open, and come back after', async ({ page }) => {
    await page.goto(STYLE_PAGE)
    await expect(page.locator(CAROUSEL).last()).toBeVisible()

    expect(await isListeningForKeys(page)).toBe(true)
    expect(await isAutoplayRunning(page)).toBe(true)

    await page.getByRole('button', { name: TILE }).first().click()
    await expect(page.getByRole('dialog')).toBeVisible()

    expect(await isListeningForKeys(page)).toBe(false)
    expect(await isAutoplayRunning(page)).toBe(false)

    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toBeHidden()

    expect(await isListeningForKeys(page)).toBe(true)
    expect(await isAutoplayRunning(page)).toBe(true)
  })
})
