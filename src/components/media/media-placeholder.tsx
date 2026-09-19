import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type PlaceholderTypeT = 'light' | 'dark' | 'default'

type PropsT = {
  type?: PlaceholderTypeT
  className?: string
  children: ReactNode
}

const GRADIENTS: Record<PlaceholderTypeT, string> = {
  default: 'bg-linear-to-r from-grau_300 via-grau_700 to-grau_700',
  dark: 'bg-linear-to-r from-grau_300/0 via-grau_700/50 to-grau_300',
  light: 'bg-linear-to-r from-grau_700/0 via-grau_800/50 to-grau_300',
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
