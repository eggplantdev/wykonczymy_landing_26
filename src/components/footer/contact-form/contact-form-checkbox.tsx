'use client'

import { twMerge } from 'tailwind-merge'

import { Checkmark } from '@/components/ui/icons/checkmark'
import { FieldError, useFieldIds } from './contact-form-field'

type PropsT = {
  name: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  onBlur: () => void
  error?: string
  className?: string
}

export function ContactFormCheckbox({
  name,
  label,
  checked,
  onChange,
  onBlur,
  error,
  className,
}: PropsT) {
  const { id, errorId } = useFieldIds()

  return (
    <div className={className}>
      <label htmlFor={id} className="text-12 text-grau_300 flex cursor-pointer items-center">
        {/* The real control is hidden rather than absent, so it keeps its own focus,
            keyboard and assistive-tech behaviour while the span next to it is what the
            visitor sees. `peer` is how that span mirrors its focus ring. */}
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className="peer sr-only"
        />
        <span className="bg-grau_600 text-grau_200 flex size-4.5 shrink-0 items-center justify-center rounded-[1px] peer-focus-visible:outline peer-focus-visible:outline-offset-2">
          {checked && <Checkmark />}
        </span>
        <span
          className={twMerge(
            'ml-7.5 w-2/3 leading-150 md:w-auto',
            checked ? 'text-grau_200' : 'text-grau_500',
          )}
        >
          {label}
        </span>
      </label>
      <FieldError id={errorId} error={error} className="ml-7.5" />
    </div>
  )
}
