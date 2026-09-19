'use client'

import { cn } from '@/lib/cn'
import { ContactFormField, fieldControlClasses, useFieldIds } from './contact-form-field'

type PropsT = {
  name: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  error?: string
  type?: 'text' | 'email' | 'tel'
  autoComplete?: string
  className?: string
}

export function ContactFormInput({
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  type = 'text',
  autoComplete,
  className,
}: PropsT) {
  const { id, errorId } = useFieldIds()

  return (
    <ContactFormField id={id} errorId={errorId} label={placeholder} error={error}>
      <input
        className={cn(fieldControlClasses, className)}
        id={id}
        name={name}
        placeholder={placeholder}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
      />
    </ContactFormField>
  )
}
