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

// Sits behind the image rather than swapping with it, so a slow photo never leaves a
// bare box — and stays visible for media that never arrives, which is why it is a
// static gradient and not a loading pulse.
export function MediaPlaceholder({ type = 'default', className, children }: PropsT) {
  return (
    <div className="relative h-full w-full">
      <div className={twMerge('h-full w-full', className, GRADIENTS[type])} />
      <div className="absolute inset-0">{children}</div>
    </div>
  )
}
