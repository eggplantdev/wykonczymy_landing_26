import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

import { FieldError } from './field-error'

type PropsT = {
  id: string
  errorId: string
  label: string
  error?: string
  className?: string
  children: ReactNode
}

export function ContactFormField({ id, errorId, label, error, className, children }: PropsT) {
  return (
    <div className={cn('relative', className)}>
      <label htmlFor={id}>
        <span className="sr-only">{label}</span>
      </label>
      {children}
      <FieldError id={errorId} error={error} />
    </div>
  )
}
