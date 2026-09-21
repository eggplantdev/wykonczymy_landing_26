import { describe, expect, it } from 'vitest'

import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import vercelConfig from '../../vercel.json'
import nextConfig from '../../next.config'

/**
 * Regression: both cron paths were declared without a trailing slash. With `trailingSlash: true`
 * Next puts a 308 ahead of every filesystem route, Vercel cron does not follow redirects, and a
 * redirected invocation is not even logged — so the retry queue never ran and said nothing.
 */
describe('cron schedule', () => {
  it('declares every cron path the way the app serves it', () => {
    expect(nextConfig.trailingSlash).toBe(true)

    for (const job of vercelConfig.crons) {
      expect(job.path.endsWith('/'), `${job.path} would 308`).toBe(true)
    }
  })

  // The path is a string in a JSON file: nothing else ties it to the handler it is meant to call.
  it('points each schedule at a route that exists', () => {
    for (const job of vercelConfig.crons) {
      const route = resolve(import.meta.dirname, `../../src/app${job.path}route.ts`)
      expect(existsSync(route), `no handler for ${job.path}`).toBe(true)
    }
  })
})
