import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  // Every indexed address ends in a slash; Next strips it by default, which
  // would break all twelve at once. See context/foundation/url-map.md.
  trailingSlash: true,
  // `/en/` is indexed and 301s to `/en/home/` on the live site; the catch-all has no
  // page for a non-default locale root. See context/foundation/url-map.md.
  redirects: async () => [{ source: '/en', destination: '/en/home/', permanent: true }],
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
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
