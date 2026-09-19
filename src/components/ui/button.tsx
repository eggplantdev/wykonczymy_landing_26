import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type ButtonVariantT = 'light' | 'dark' | 'outline'
export type ButtonSizeT = 'sm' | 'xl' | 'responsive'

type StyleT = {
  variant?: ButtonVariantT
  size?: ButtonSizeT
  disabled?: boolean
  // Which end the icon sits at: an icon needs less room on its own side than a word
  // does, so that end's padding tightens.
  icon?: 'leading' | 'trailing'
  className?: string
}

// Exported as classes, not just as a component, because the same pill is also worn by
// links: a <button> inside an <a> is invalid HTML and gives assistive tech two controls
// where the reader sees one, so a link renders as the pill itself.
export function buttonClasses({
  variant = 'light',
  size = 'responsive',
  disabled,
  icon,
  className,
}: StyleT) {
  return cn(
    // w-fit because a <button> shrink-wraps on its own but an <a> wearing this pill
    // does not — without it the link stretches across its row.
    'group flex w-fit items-center justify-center gap-2.5 rounded-md text-nowrap duration-200',
    variant === 'light' && 'bg-muted hover:bg-muted-foreground focus-visible:outline-ring',
    variant === 'dark' &&
      'bg-card hover:bg-muted-foreground focus-visible:bg-muted focus-visible:outline-ring disabled:bg-muted disabled:text-subtle-foreground',
    variant === 'outline' &&
      'border-border hover:border-foreground focus-visible:bg-muted focus-visible:outline-ring disabled:border-border-muted border bg-transparent',
    size === 'responsive' && 'h-8 px-4.5 text-12 md:h-9 md:text-14',
    size === 'sm' && 'h-8 px-4.5 text-12',
    size === 'xl' && 'text-18 h-12 px-6',
    icon === 'trailing' && 'pr-3 pl-4',
    icon === 'leading' && 'pl-3 pr-4',
    disabled && 'pointer-events-none',
    className,
  )
}

export function buttonLabelClasses({
  variant = 'light',
  disabled,
}: Pick<StyleT, 'variant' | 'disabled'>) {
  return cn(
    'duration-200',
    variant === 'light' && 'text-foreground group-hover:text-background',
    variant === 'dark' && 'text-foreground group-hover:text-background',
    variant === 'outline' && 'text-muted-foreground group-hover:text-foreground',
    disabled && 'text-subtle-foreground',
  )
}

type PropsT = StyleT & {
  label?: string
  onClick?: () => void
  children?: ReactNode
  // A form's send control has to be a submit button.
  type?: 'button' | 'submit'
  isBusy?: boolean
}

export function Button({
  variant = 'light',
  size = 'responsive',
  label,
  onClick,
  children,
  disabled,
  icon,
  className,
  type = 'button',
  isBusy,
}: PropsT) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-busy={isBusy}
      className={buttonClasses({ variant, size, disabled, icon, className })}
    >
      {label && <span className={buttonLabelClasses({ variant, disabled })}>{label}</span>}
      {children}
    </button>
  )
}
