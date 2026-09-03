import fs from 'node:fs'
import path from 'node:path'

import sharp from 'sharp'

import {
  FAMILIES,
  MANIFEST,
  PUBLIC_DIR,
  REDIRECTS,
  SHOTS,
  VIEWPORTS,
  familyOf,
  slugOf,
  sourceOf,
} from './config.mjs'

const routes = JSON.parse(fs.readFileSync(path.join(SHOTS, 'routes.json'), 'utf8'))

fs.rmSync(PUBLIC_DIR, { recursive: true, force: true })
fs.mkdirSync(PUBLIC_DIR, { recursive: true })

const pages = []
let bytes = 0

for (const route of routes) {
  const slug = slugOf(route)
  const views = []

  for (const viewport of VIEWPORTS) {
    const source = path.join(SHOTS, `${slug}.${viewport.key}.png`)
    if (!fs.existsSync(source)) continue

    const file = `${slug}.${viewport.key}.jpg`
    const image = sharp(source)
    const { height, width } = await image.metadata()
    const info = await image
      .resize({ width: viewport.thumb })
      .jpeg({ chromaSubsampling: '4:4:4', mozjpeg: true, quality: 72 })
      .toFile(path.join(PUBLIC_DIR, file))

    bytes += info.size
    views.push({
      height,
      src: `/page-board/${file}`,
      thumbHeight: info.height,
      thumbWidth: info.width,
      viewport: viewport.key,
      width,
    })
  }

  if (views.length) pages.push({ family: familyOf(route), route, source: sourceOf(route), views })
}

for (const [from, to] of Object.entries(REDIRECTS)) {
  pages.push({ family: familyOf(from), redirectsTo: to, route: from, source: sourceOf(from) })
}

pages.sort((a, b) => a.route.localeCompare(b.route))

const manifest = {
  capturedAt: new Date().toISOString().slice(0, 10),
  families: FAMILIES,
  pages,
  viewports: VIEWPORTS.map(({ key, label, screen, width }) => ({ key, label, screen, width })),
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2))

const rendered = pages.filter((page) => page.views).length
console.log(
  `${rendered} routes × ${VIEWPORTS.length} viewports + ${pages.length - rendered} redirects — ` +
    `${(bytes / 1024 / 1024).toFixed(1)} MB in public/page-board/`,
)
