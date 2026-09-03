import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const HERE = path.dirname(fileURLToPath(import.meta.url))
export const REPO = path.resolve(HERE, '../..')
export const SHOTS = path.join(HERE, '.shots')
export const PUBLIC_DIR = path.join(REPO, 'public/page-board')
export const MANIFEST = path.join(PUBLIC_DIR, 'manifest.json')

/** tdg's dev server. It renders from static fixtures, so no WordPress is involved. */
export const BASE = process.env.BASE || 'http://localhost:3000'

/**
 * Mirrors the `screens` scale in tdg's tailwind.config.js. Captures are stored at their
 * native capture width so the lightbox reads 1:1 — the grid scales them down in CSS.
 */
export const VIEWPORTS = [
  { key: 'mobile', width: 390, label: '390', screen: 'sm', thumb: 390 },
  { key: 'tablet', width: 768, label: '768', screen: 'md', thumb: 768 },
  { key: 'desktop', width: 1440, label: '1440', screen: 'xl', thumb: 1440 },
]

/** Routes that only redirect — recorded on the board, never captured. */
export const REDIRECTS = {
  '/object': '/object/lizbonska-5/description',
  '/finance': '/finance/renovations',
  '/living': '/living/painting',
  '/optimum': '/optimum/electrical',
}

export const FAMILIES = [
  { key: 'core', label: 'Core pages', source: 'app/<name>/page.tsx' },
  { key: 'estate', label: 'Estate sections', source: 'app/(elastic)/<section>/[subpage]/page.tsx' },
  { key: 'object', label: 'Objects', source: 'app/object/[id]/[subpage]/page.tsx' },
  { key: 'news', label: 'News articles', source: 'app/news/[slug]/page.tsx' },
  { key: 'legal', label: 'Legal', source: 'app/legal/[legalPage]/page.tsx' },
]

export const familyOf = (route) => {
  if (route.startsWith('/news/')) return 'news'
  if (route.startsWith('/legal/')) return 'legal'
  if (route.startsWith('/object')) return 'object'
  if (/^\/(finance|living|optimum)\b/.test(route)) return 'estate'
  return 'core'
}

export const sourceOf = (route) => {
  if (route === '/') return 'app/page.tsx'
  if (route.startsWith('/news/')) return 'app/news/[slug]/page.tsx'
  if (route.startsWith('/legal/')) return 'app/legal/[legalPage]/page.tsx'
  if (route.startsWith('/object/')) return 'app/object/[id]/[subpage]/page.tsx'
  const elastic = route.match(/^\/(finance|living|optimum)\/.+$/)
  if (elastic) return `app/(elastic)/${elastic[1]}/[subpage]/page.tsx`
  if (/^\/(finance|living|optimum)$/.test(route)) return `app/(elastic)${route}/page.tsx`
  return `app${route}/page.tsx`
}

export const slugOf = (route) => (route === '/' ? 'home' : route.slice(1).replace(/\//g, '__'))
