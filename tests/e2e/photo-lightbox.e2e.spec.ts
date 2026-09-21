import { test, expect } from '@playwright/test'

const STYLE_PAGE = '/wykonczenia/klasyczny/'
const TILE = 'Powiększ zdjęcie'

test.describe('Photo lightbox', () => {
  test('opens on the photo that was clicked', async ({ page }) => {
    await page.goto(STYLE_PAGE)

    await page.getByRole('button', { name: TILE }).nth(3).click()

    await expect(page.getByRole('dialog')).toContainText('04')
  })
})
