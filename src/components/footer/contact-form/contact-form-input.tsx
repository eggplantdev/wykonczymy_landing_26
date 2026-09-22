'use client'

import { cn } from '@/lib/cn'
import { ContactFormField } from './contact-form-field'
import { fieldControlClasses } from './field-control-classes'
import { useFieldIds } from './use-field-ids'

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
  controlClassName?: string
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
  controlClassName,
}: PropsT) {
  const { id, errorId } = useFieldIds()

  return (
    <ContactFormField
      id={id}
      errorId={errorId}
      label={placeholder}
      error={error}
      className={className}
    >
      <input
        className={cn(fieldControlClasses, controlClassName)}
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
