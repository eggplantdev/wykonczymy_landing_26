'use client'

import type { ReactNode } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/cn'
import { FieldError, useFieldIds } from './contact-form-field'

type PropsT = {
  name: string
  label: ReactNode
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
    <div className={cn('relative', className)}>
      <Checkbox
        id={id}
        name={name}
        label={label}
        checked={checked}
        onChange={onChange}
        onBlur={onBlur}
        invalid={Boolean(error)}
        describedBy={errorId}
        labelClassName="w-2/3 leading-150 md:w-auto"
      />
      <FieldError id={errorId} error={error} className="left-6.5" />
    </div>
  )
}
