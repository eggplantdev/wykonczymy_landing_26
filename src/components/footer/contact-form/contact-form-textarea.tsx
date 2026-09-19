'use client'

import { ContactFormField } from './contact-form-field'
import { fieldControlClasses } from './field-control-classes'
import { useFieldIds } from './use-field-ids'
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
      {/* Starts at the height of the single-line fields and grows with what is typed. The drag
          handle goes with it: resizing writes an inline height that then pins the box and stops
          it growing. `field-sizing` sizes the box from its content, which overrides `rows` — so
          `rows` only covers the browsers that don't support it. The cap keeps a 5000-character
          message from pushing the send button off the footer. */}
      <textarea
        className={cn(fieldControlClasses, 'field-sizing-content max-h-64 resize-none')}
        id={id}
        name={name}
        placeholder={placeholder}
        rows={1}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
      />
    </ContactFormField>
  )
}
