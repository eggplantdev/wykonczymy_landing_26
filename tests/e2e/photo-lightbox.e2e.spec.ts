import { test, expect } from '@playwright/test'

const STYLE_PAGE = 'http://localhost:3000/wykonczenia/klasyczny/'
const TILE = 'Powiększ zdjęcie'

test.describe('Photo lightbox', () => {
  // Radix hands focus back to a `Dialog.Trigger` and a tile is not one, so closing used to
  // leave focus on <body> — from the ninth tile of the gallery, the next Tab restarted at
  // the top of the document.
  test('hands focus back to the tile that opened it', async ({ page }) => {
    await page.goto(STYLE_PAGE)

    const tile = page.getByRole('button', { name: TILE }).nth(3)
    await tile.click()
    await expect(page.getByRole('dialog')).toBeVisible()

    await page.keyboard.press('Escape')

    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(tile).toBeFocused()
  })

  test('opens on the photo that was clicked', async ({ page }) => {
    await page.goto(STYLE_PAGE)

    await page.getByRole('button', { name: TILE }).nth(3).click()

    await expect(page.getByRole('dialog')).toContainText('04')
  })
})
