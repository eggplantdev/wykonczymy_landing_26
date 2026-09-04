import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export type ButtonVariantT = 'light' | 'dark' | 'outline'

type PropsT = {
  variant?: ButtonVariantT
  size?: 'sm' | 'xl' | 'responsive'
  label?: string
  onClick?: () => void
  children?: ReactNode
  disabled?: boolean
  hasIcon?: boolean
  className?: string
}

export function Button({
  variant = 'light',
  size = 'responsive',
  label,
  onClick,
  children,
  disabled,
  hasIcon,
  className,
}: PropsT) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={twMerge(
        'group flex items-center justify-center gap-2.5 rounded-full text-nowrap duration-200',
        variant === 'light' && 'bg-grau_800 hover:bg-grau_100 focus-visible:outline-grau_300',
        variant === 'dark' &&
          'bg-white hover:bg-grau_100 focus-visible:bg-grau_800 focus-visible:outline-grau_300 disabled:bg-grau_800 disabled:text-grau_600',
        variant === 'outline' &&
          'border-grau_200 hover:border-shwarz focus-visible:bg-grau_900 focus-visible:outline-grau_200 disabled:border-grau_800 border bg-transparent',
        size === 'responsive' && 'h-8 px-4.5 text-12 md:h-9 md:text-14',
        size === 'sm' && 'h-8 px-4.5 text-12',
        size === 'xl' && 'text-14 h-9',
        hasIcon && 'pr-3 pl-4',
        disabled && 'pointer-events-none',
        className,
      )}
    >
      {label && (
        <span
          className={twMerge(
            'duration-200',
            variant === 'light' && 'text-shwarz group-hover:text-grau_900',
            variant === 'dark' && 'text-shwarz group-hover:text-grau_900',
            variant === 'outline' && 'text-grau_100 group-hover:text-shwarz',
            disabled && 'text-grau_600',
          )}
        >
          {label}
        </span>
      )}
      {children}
    </button>
  )
}
