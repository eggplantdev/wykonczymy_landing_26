import { twMerge, type ClassNameValue } from 'tailwind-merge'

// The single seam every component composes classes through, so a later conflict-
// resolution tweak — `extendTailwindMerge` for a token tailwind-merge misreads, or a
// clsx pass for object syntax — lands in one file instead of ~30 call sites.
export function cn(...classes: ClassNameValue[]) {
  return twMerge(classes)
}
