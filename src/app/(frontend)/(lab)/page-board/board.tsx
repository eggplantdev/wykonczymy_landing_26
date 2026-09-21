'use client'

import React, { useState } from 'react'

import type { BoardManifestT, BoardPageT, BoardViewT, BoardViewportT } from './types'

type PropsT = { manifest: BoardManifestT }

type OpenedT = { page: BoardPageT; view: BoardViewT; viewport: BoardViewportT }

const CLIP_PX = 460

export function Board({ manifest }: PropsT) {
  const { capturedAt, families, pages, viewports } = manifest
  const [family, setFamily] = useState('all')
  const [opened, setOpened] = useState<OpenedT | null>(null)

  const shown = family === 'all' ? pages : pages.filter((page) => page.family === family)
  const rendered = pages.filter((page) => page.views).length

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-stone-300 bg-stone-100/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-baseline gap-x-6 gap-y-2 px-6 py-4">
          <h1 className="text-40 leading-135 font-semibold tracking-tight">tdg — page board</h1>
          <p className="font-mono text-12 text-stone-500 dark:text-zinc-400">
            {rendered} routes × {viewports.length} breakpoints · captured {capturedAt}
          </p>
          <div className="ml-auto flex flex-wrap gap-1.5">
            {[{ key: 'all', label: 'All' }, ...families].map((option) => (
              <button
                aria-pressed={family === option.key}
                className="cursor-pointer rounded-full border border-stone-300 px-3 py-1.5 font-mono text-[11px] tracking-wide text-stone-500 uppercase transition-colors hover:text-stone-900 aria-pressed:border-blue-700 aria-pressed:bg-blue-100 aria-pressed:text-blue-800 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-100 dark:aria-pressed:border-blue-400 dark:aria-pressed:bg-blue-950 dark:aria-pressed:text-blue-300"
                key={option.key}
                onClick={() => setFamily(option.key)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 pb-24">
        <p className="my-8 max-w-[62ch] text-stone-600 dark:text-zinc-400">
          Every route the tdg reference app serves, each shown at{' '}
          {viewports.map((viewport) => viewport.label).join(' · ')} px. Captured full length from
          tdg&rsquo;s static fixtures — no WordPress involved. Click any capture to read it end to
          end.
        </p>

        <div className="grid grid-cols-1 gap-5 2xl:grid-cols-2">
          {shown.map((page) => (
            <article
              className="overflow-hidden rounded-sm border border-stone-300 bg-stone-50 dark:border-zinc-800 dark:bg-zinc-900"
              key={page.route}
            >
              <header className="flex items-center gap-3 border-b border-stone-300 bg-stone-200/60 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-800/60">
                <code className="truncate text-[13px]">{page.route}</code>
                <code className="ml-auto shrink-0 text-10 text-stone-500 dark:text-zinc-500">
                  {page.source}
                </code>
              </header>

              {page.redirectsTo ? (
                <p className="flex items-center gap-2 px-3 py-6 text-12 text-stone-500 dark:text-zinc-400">
                  <span className="text-blue-700 dark:text-blue-400">redirect →</span>
                  <code className="text-stone-900 dark:text-zinc-100">{page.redirectsTo}</code>
                </p>
              ) : (
                <div className="grid grid-cols-[390fr_768fr_1440fr] items-start gap-2 p-2">
                  {page.views?.map((view) => {
                    const viewport = viewports.find((item) => item.key === view.viewport)!
                    return (
                      <figure className="m-0" key={view.viewport}>
                        <figcaption className="flex items-baseline gap-1.5 px-1 pb-1 font-mono text-10 text-stone-500 tabular-nums dark:text-zinc-500">
                          <span className="text-stone-700 dark:text-zinc-300">
                            {viewport.label}
                          </span>
                          <span>{viewport.screen}</span>
                          <span className="ml-auto">{view.height.toLocaleString('en-US')} px</span>
                        </figcaption>
                        <button
                          aria-label={`Open ${page.route} at ${viewport.label} px`}
                          className="relative block w-full cursor-zoom-in overflow-hidden border border-stone-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
                          onClick={() => setOpened({ page, view, viewport })}
                          style={{ maxHeight: CLIP_PX }}
                          type="button"
                        >
                          {/* Static audit captures, not CMS media — next/image only accepts /api/media/file/** here. */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            alt={`${page.route} at ${viewport.label} px`}
                            className="block w-full"
                            height={view.thumbHeight}
                            loading="lazy"
                            src={view.src}
                            width={view.thumbWidth}
                          />
                          {view.thumbHeight > CLIP_PX && (
                            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-stone-50 to-transparent dark:from-zinc-900" />
                          )}
                        </button>
                      </figure>
                    )
                  })}
                </div>
              )}
            </article>
          ))}
        </div>
      </main>

      {opened && (
        <div
          className="fixed inset-0 z-30 overflow-auto bg-stone-950/85 p-[3vh]"
          onClick={() => setOpened(null)}
          role="presentation"
        >
          <div
            className="mx-auto w-full overflow-hidden rounded-sm border border-stone-700 bg-stone-50 dark:bg-zinc-900"
            onClick={(event) => event.stopPropagation()}
            // Never upscale past the capture's own width — 390 stays 390, 1440 reads 1:1.
            style={{ maxWidth: opened.view.thumbWidth }}
            role="presentation"
          >
            <div className="sticky top-0 flex items-center gap-3 border-b border-stone-300 bg-stone-200 px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-800">
              <code className="text-12">{opened.page.route}</code>
              <span className="ml-auto font-mono text-[11px] text-stone-500 tabular-nums dark:text-zinc-400">
                {opened.viewport.label} × {opened.view.height.toLocaleString('en-US')} px
              </span>
              <button
                className="cursor-pointer rounded-full border border-stone-400 px-3 py-1 font-mono text-[11px] text-stone-600 hover:text-stone-900 dark:border-zinc-600 dark:text-zinc-300 dark:hover:text-white"
                onClick={() => setOpened(null)}
                type="button"
              >
                Close ×
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={`${opened.page.route} at ${opened.viewport.label} px, full length`}
              className="block w-full"
              height={opened.view.thumbHeight}
              src={opened.view.src}
              width={opened.view.thumbWidth}
            />
          </div>
        </div>
      )}
    </div>
  )
}
