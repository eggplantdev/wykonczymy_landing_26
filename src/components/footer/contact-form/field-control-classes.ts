import { cn } from '@/lib/cn'

// A browser does not inherit `color` into `::placeholder`, hence the `placeholder:` variant.
// The top padding is also the gap between two stacked fields — there is no visible label to
// hold them apart, and `pt-8` on a phone pushes the send button off the screen. 16px is a
// floor on the control: iOS Safari zooms in on focusing anything smaller and does not zoom back.
export const fieldControlClasses = cn(
  'border-border text-16 text-muted-foreground w-full pt-5 pb-2 md:pt-8',
  'focus:border-muted-foreground aria-invalid:border-error placeholder:text-14 placeholder:text-subtle-foreground border-0 border-b bg-transparent pl-0',
)
