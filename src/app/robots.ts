import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/lib/seo/absolute-url'
import { SEARCH_INDEXING_ENABLED } from '@/lib/seo/constants'

// It sits outside `(frontend)` on purpose: in the route group the `[[...segments]]` catch-all
// swallows /robots.txt and serves the 404 page as HTML instead. Do not delete this file at
// cutover — it is the only thing that points a crawler at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', ...(SEARCH_INDEXING_ENABLED ? { allow: '/' } : { disallow: '/' }) },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
