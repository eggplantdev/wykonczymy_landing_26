'use client'

import type { ReactNode } from 'react'

import { Checkmark } from '@/components/ui/icons/checkmark'
import { cn } from '@/lib/cn'

type PropsT = {
  id: string
  name?: string
  label: ReactNode
  checked: boolean
  disabled?: boolean
  onChange: (checked: boolean) => void
  onBlur?: () => void
  invalid?: boolean
  describedBy?: string
  className?: string
  labelClassName?: string
}

export function Checkbox({
  id,
  name,
  label,
  checked,
  disabled,
  onChange,
  onBlur,
  invalid,
  describedBy,
  className,
  labelClassName,
}: PropsT) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'text-12 text-muted-foreground flex items-center gap-x-2',
        !disabled && 'cursor-pointer',
        className,
      )}
    >
      {/* Hidden rather than absent, so it keeps its native focus and keyboard behaviour
          while the span beside it is what the visitor sees. */}
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        onBlur={onBlur}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className="peer sr-only"
      />
      <span className="bg-subtle text-muted-foreground peer-focus-visible:outline-offset-2 peer-disabled:opacity-60 flex size-4.5 shrink-0 items-center justify-center rounded-[1px] peer-focus-visible:outline">
        {checked && <Checkmark />}
      </span>
      <span className={cn('text-muted-foreground', labelClassName)}>{label}</span>
    </label>
  )
}
