import { cn } from '@/lib/cn'

// `placeholder:` is not decoration: a browser does not inherit the element's `color` into
// `::placeholder`, so without it the fields show the UA's own grey instead of `subtle-foreground`.
// The top padding is also the gap between two stacked fields — there is no visible label above
// the line, so nothing else holds them apart. A phone gets less of it: at `pt-8` a one-line
// field is a 48px band of empty space, and seven of them push the send button off the screen.
export const fieldControlClasses = cn(
  'border-border text-12 text-muted-foreground w-full pt-5 pb-2 md:pt-8',
  'focus:border-muted-foreground aria-invalid:border-error placeholder:text-subtle-foreground border-0 border-b bg-transparent pl-0',
)
