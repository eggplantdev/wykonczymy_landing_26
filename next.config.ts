import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  // Next holds a lock inside the dist directory and refuses a second `next dev` on the same
  // one — whatever port it is given. The e2e run needs its own server, on its own database,
  // so it passes NEXT_DIST_DIR and gets its own lock; without this you would have to stop
  // your dev server to run the suite.
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  // Every indexed address ends in a slash; Next strips it by default, which
  // would break all twelve at once. See context/foundation/url-map.md.
  trailingSlash: true,
  // `/en/` is indexed and 301s to `/en/home/` on the live site; the catch-all has no
  // page for a non-default locale root. See context/foundation/url-map.md.
  // Oferta was retired 2026-09-04 and Cennik with it, leaving four indexed addresses with
  // no target. They 301 to the home page rather than 404 — Oferta's content literally
  // became the home page's tiles. The English pair points at `/en/home/` rather than `/en/`
  // so it lands in one hop instead of chaining through the locale-root redirect below.
  redirects: async () => [
    { source: '/en', destination: '/en/home/', permanent: true },
    { source: '/oferta', destination: '/', permanent: true },
    { source: '/cennik', destination: '/', permanent: true },
    { source: '/en/offer', destination: '/en/home/', permanent: true },
    { source: '/en/price-list', destination: '/en/home/', permanent: true },
  ],
  images: {
    // Next refuses any quality not listed here.
    qualities: [75, 90],
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      // The brand logos are files in public/, not media-library rows.
      {
        pathname: '/images/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
