'use client'

import { useState } from 'react'

const TOGGLES = [
  { key: 'grid', label: 'grid' },
  { key: 'outlines', label: 'outlines' },
  { key: 'layers', label: 'layers' },
] as const

type ToggleKeyT = (typeof TOGGLES)[number]['key']

// Literal per column so Tailwind can scan them. Six columns at base, eight at md and
// twelve at lg — mirrors the `gridContainer` utility the overlay is measuring.
const GRID_COLUMNS = [
  'outline-1',
  'outline-1',
  'outline-1',
  'outline-1',
  'outline-1',
  'outline-1',
  'hidden outline-1 md:block',
  'hidden outline-1 md:block',
  'hidden outline-1 lg:block',
  'hidden outline-1 lg:block',
  'hidden outline-1 lg:block',
  'hidden outline-1 lg:block',
] as const

function GridOverlay() {
  return (
    <div className="gridContainer paddings pointer-events-none fixed inset-0 z-10000 gap-4 md:gap-5">
      {GRID_COLUMNS.map((className, index) => (
        <div key={index} className={className}>
          <div className="h-full bg-error/10" />
        </div>
      ))}
    </div>
  )
}

export function DebugTools() {
  const [enabled, setEnabled] = useState<Record<ToggleKeyT, boolean>>({
    grid: false,
    outlines: false,
    layers: false,
  })

  // tdg shared this through a zustand store because its triggers sit in the header while
  // the outline/layer effect wraps `children`. One attribute on the root reaches the whole
  // tree from here, so the state stays local to the only component that reads it.
  const handleToggle = (key: ToggleKeyT) => {
    const next = !enabled[key]
    setEnabled((previous) => ({ ...previous, [key]: next }))
    if (key !== 'grid') document.documentElement.toggleAttribute(`data-debug-${key}`, next)
  }

  return (
    <>
      {enabled.grid && <GridOverlay />}
      <div className="text-10 shadow-header fixed right-4 bottom-4 z-10001 flex flex-col gap-2 rounded bg-card/90 p-2 md:flex-row md:gap-4">
        {TOGGLES.map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2">
            <span>{label}</span>
            <input type="checkbox" checked={enabled[key]} onChange={() => handleToggle(key)} />
          </label>
        ))}
      </div>
    </>
  )
}
