import fs from 'node:fs'
import path from 'node:path'

import { chromium } from '@playwright/test'

import { BASE, REDIRECTS, SHOTS, VIEWPORTS, slugOf } from './config.mjs'

/** tdg's own `/all-pages` index is the source of truth for what routes exist. */
async function readRoutes() {
  const response = await fetch(`${BASE}/all-pages`)
  if (!response.ok) throw new Error(`${BASE}/all-pages returned ${response.status}`)
  const html = await response.text()
  const hrefs = [...html.matchAll(/href="(\/[^"]*)"/g)].map((match) => match[1])
  return [...new Set(hrefs)]
    .filter((route) => !route.startsWith('/_next') && !/\.\w+$/.test(route))
    .filter((route) => !(route in REDIRECTS))
    .sort()
}

const routes = await readRoutes()
if (!routes.length) throw new Error(`No routes found — is tdg's dev server up at ${BASE}?`)

fs.rmSync(SHOTS, { recursive: true, force: true })
fs.mkdirSync(SHOTS, { recursive: true })
fs.writeFileSync(path.join(SHOTS, 'routes.json'), JSON.stringify(routes, null, 2))

const browser = await chromium.launch()

for (const viewport of VIEWPORTS) {
  const page = await browser.newPage({
    deviceScaleFactor: 1,
    hasTouch: viewport.width < 768,
    isMobile: viewport.width < 768,
    viewport: { height: 900, width: viewport.width },
  })

  for (const route of routes) {
    try {
      await page.goto(`${BASE}${route}`, { timeout: 45_000, waitUntil: 'networkidle' })
      // tdg reveals sections with scroll-triggered gsap — walk the page so every section paints
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y)
          await new Promise((resolve) => setTimeout(resolve, 220))
        }
        window.scrollTo(0, 0)
        await new Promise((resolve) => setTimeout(resolve, 600))
      })
      await page.screenshot({
        fullPage: true,
        path: path.join(SHOTS, `${slugOf(route)}.${viewport.key}.png`),
      })
    } catch (error) {
      console.error(`FAIL ${viewport.label} ${route} — ${error.message.split('\n')[0]}`)
    }
  }

  await page.close()
  console.log(`captured ${routes.length} routes at ${viewport.label}px`)
}

await browser.close()
