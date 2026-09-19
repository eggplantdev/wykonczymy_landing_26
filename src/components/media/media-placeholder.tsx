import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type PlaceholderTypeT = 'light' | 'dark' | 'default'

type PropsT = {
  type?: PlaceholderTypeT
  className?: string
  children: ReactNode
}

const GRADIENTS: Record<PlaceholderTypeT, string> = {
  default: 'bg-linear-to-r from-subtle-foreground via-subtle to-subtle',
  dark: 'bg-linear-to-r from-subtle-foreground/0 via-subtle/50 to-subtle-foreground',
  light: 'bg-linear-to-r from-subtle/0 via-muted/50 to-subtle-foreground',
}

// Sits behind the image rather than swapping with it, so a slow photo never leaves a
// bare box — and stays visible for media that never arrives, which is why it is a
// static gradient and not a loading pulse.
export function MediaPlaceholder({ type = 'default', className, children }: PropsT) {
  return (
    <div className="relative h-full w-full">
      <div className={cn('h-full w-full', className, GRADIENTS[type])} />
      <div className="absolute inset-0">{children}</div>
    </div>
  )
}
