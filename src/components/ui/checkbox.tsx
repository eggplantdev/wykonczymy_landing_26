'use client'

import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'
import '@/lib/fontawesome'

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
        'flex items-center gap-x-2 text-14 text-muted-foreground',
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
      {/* The message under it is two lines lower and ten pixels tall, so on its own it reads
          as a stray note rather than as this checkbox being what stopped the send — the control
          has to carry the signal itself. The focus ring goes to two pixels because the invalid
          state already paints a one-pixel outline in the same colour: at one pixel each, focus
          on an invalid box changed nothing but the offset. */}
      <span
        className={cn(
          'flex size-4.5 shrink-0 items-center justify-center rounded-md peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring peer-disabled:opacity-60',
          invalid
            ? 'bg-error/15 text-error outline outline-error'
            : 'bg-subtle text-muted-foreground',
        )}
      >
        {checked && <FontAwesomeIcon icon={faCheck} className="size-3" />}
      </span>
      <span className={cn(invalid ? 'text-error' : 'text-muted-foreground', labelClassName)}>
        {label}
      </span>
    </label>
  )
}
