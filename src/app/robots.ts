import type { MetadataRoute } from 'next'

// The replatform is deployed but not the published site — wykonczymy.com.pl is still
// WordPress, and this host must not compete with it in the index. Delete this file at
// cutover, together with the `robots` entry in the root layout's metadata.
//
// It sits outside `(frontend)` on purpose: in the route group the `[[...segments]]`
// catch-all swallows /robots.txt and serves the 404 page as HTML instead.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', disallow: '/' },
  }
}
