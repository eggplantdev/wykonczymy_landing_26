import { test, expect } from '@playwright/test'

// The catch-all serves every address from a Pages document, so these assert the URL
// contract from context/foundation/url-map.md rather than any particular copy.
test.describe('Frontend routing', () => {
  test('serves the Polish home page at /', async ({ page }) => {
    await page.goto('http://localhost:3000/')

    await expect(page.locator('h1')).toBeVisible()
  })

  test('adds the trailing slash rather than 404ing', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/oferta')

    expect(response?.status()).toBe(200)
    expect(page.url()).toBe('http://localhost:3000/oferta/')
  })

  test('redirects /en to the English home page', async ({ page }) => {
    await page.goto('http://localhost:3000/en')

    expect(page.url()).toBe('http://localhost:3000/en/home/')
  })

  test('404s on a path deeper than <locale>/<slug>', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/oferta/anything/at/all/')

    expect(response?.status()).toBe(404)
  })

  test('404s on an unknown slug', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/nie-ma-takiej-strony/')

    expect(response?.status()).toBe(404)
  })
})
