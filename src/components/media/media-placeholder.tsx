import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type PlaceholderTypeT = 'light' | 'dark' | 'default'

type PropsT = {
  type?: PlaceholderTypeT
  className?: string
  children: ReactNode
}

const GRADIENTS: Record<PlaceholderTypeT, string> = {
  default: 'bg-linear-to-r from-grau_400 via-grau_600 to-grau_600',
  dark: 'bg-linear-to-r from-grau_400/0 via-grau_600/50 to-grau_400',
  light: 'bg-linear-to-r from-grau_600/0 via-grau_900/50 to-grau_400',
}

// Sits behind the image rather than swapping with it: `next/image` fades in over the
// pulse, so a slow photo never leaves a bare box.
export function MediaPlaceholder({ type = 'default', className, children }: PropsT) {
  return (
    <div className="relative h-full w-full">
      <div className={twMerge('h-full w-full animate-pulse', className, GRADIENTS[type])} />
      <div className="absolute inset-0">{children}</div>
    </div>
  )
}
