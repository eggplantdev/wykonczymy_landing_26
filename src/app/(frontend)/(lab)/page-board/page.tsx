import fs from 'node:fs/promises'
import path from 'node:path'

import type { Metadata } from 'next'
import React from 'react'

import type { BoardManifestT } from './types'

import { Board } from './board'

export const metadata: Metadata = {
  description: 'Every route the tdg reference site serves, captured at three breakpoints.',
  title: 'tdg page board',
}

// The captures are gitignored, so the manifest is read per request rather than
// baked in — a clean checkout renders the empty state instead of failing the build.
export const dynamic = 'force-dynamic'

async function readManifest(): Promise<BoardManifestT | undefined> {
  try {
    const file = path.join(process.cwd(), 'public/page-board/manifest.json')
    return JSON.parse(await fs.readFile(file, 'utf8')) as BoardManifestT
  } catch {
    return undefined
  }
}

async function hasCaptures() {
  try {
    const dir = path.join(process.cwd(), 'tools/page-board/.shots')
    return (await fs.readdir(dir)).some((entry) => entry.endsWith('.png'))
  } catch {
    return false
  }
}

export default async function PageBoardPage() {
  const manifest = await readManifest()
  if (manifest) return <Board manifest={manifest} />

  // Re-encoding from existing captures takes a minute; re-shooting tdg takes half an hour.
  const rebuildOnly = await hasCaptures()

  return (
    <div className="mx-auto max-w-[62ch] px-6 py-24">
      <h1 className="text-40 leading-135 font-semibold tracking-tight">Nothing built yet</h1>
      {rebuildOnly ? (
        <p className="mt-4 text-stone-600 dark:text-zinc-400">
          The captures are still on disk. Run <code>pnpm board:build</code> — it re-encodes them
          into <code>public/page-board/</code> in about a minute. Nothing else needs to be running.
        </p>
      ) : (
        <p className="mt-4 text-stone-600 dark:text-zinc-400">
          The captures are gone too, so they have to be re-shot from tdg — that part takes roughly
          half an hour. <code>tools/page-board/README.md</code> has the runbook.
        </p>
      )}
    </div>
  )
}
