import { test, expect } from '@playwright/test'

// `useReducedMotion` reports false on the server and true on the first client render, so any
// entrance that branches `initial` on it hands React two different DOMs to reconcile. React answers
// a hydration mismatch by discarding the server HTML and client-rendering the whole page — the
// sections stay visible, which is exactly why nothing but the console would ever show this.
test('reduced motion does not cost a hydration mismatch', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('http://localhost:3000/')

  const sections = page.locator('div.overflow-x-clip.flex > div')
  const count = await sections.count()
  expect(count).toBeGreaterThan(0)

  for (let index = 0; index < count; index++) {
    const section = sections.nth(index)
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveCSS('opacity', '1')
  }

  expect(errors.filter((text) => /hydrat/i.test(text))).toEqual([])
})
