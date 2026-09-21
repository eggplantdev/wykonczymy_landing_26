import { extendTailwindMerge, validators, type ClassNameValue } from 'tailwind-merge'

// `--text-*: initial` in the theme replaces Tailwind's font-size scale with numeric names
// (`text-12`) and `text-hero`. tailwind-merge only knows the stock names, so it reads
// `text-12` as a *colour* and lets any `text-subtle-foreground` in the same `cn()` erase it —
// silently, since a dropped class is not an error. Teaching it the real scale is what keeps
// size and colour in separate conflict groups.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [validators.isNumber, 'hero'] }],
    },
  },
})

// The single seam every component composes classes through, so a later conflict-
// resolution tweak lands in one file instead of ~30 call sites.
export function cn(...classes: ClassNameValue[]) {
  return twMerge(classes)
}
