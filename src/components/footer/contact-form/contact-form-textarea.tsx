'use client'

import { ContactFormField, fieldControlClasses, useFieldIds } from './contact-form-field'
import { cn } from '@/lib/cn'

type PropsT = {
  name: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  error?: string
  className?: string
}

export function ContactFormTextarea({
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  className,
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
      {/* Grows with what is typed. The drag handle goes with it: resizing writes an inline
          height that then pins the box and stops it growing. `rows` stays as the floor and as
          the fallback where `field-sizing` is unsupported; the cap keeps a 5000-character
          message from pushing the send button off the footer. */}
      <textarea
        className={cn(fieldControlClasses, 'field-sizing-content max-h-64 resize-none')}
        id={id}
        name={name}
        placeholder={placeholder}
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
      />
    </ContactFormField>
  )
}
