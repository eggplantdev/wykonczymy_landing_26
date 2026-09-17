'use client'

import { useEffect, useState } from 'react'
import { useForm } from '@tanstack/react-form'

import { Button, buttonLabelClasses } from '@/components/ui/button'
import { Arrow } from '@/components/ui/icons/arrow'
import { cn } from '@/lib/cn'
import { useContactFormStore } from '@/lib/contact/contact-form-store'
import { contactSchema, emptyContactValues, firstIssueKey } from '@/lib/contact/contact-schema'
import { submitContactForm } from '@/lib/contact/submit-contact-form'
import { useTranslation } from '@/lib/i18n/use-translation'
import { ContactFormAttachments } from './contact-form-attachments'
import { ContactFormCheckbox } from './contact-form-checkbox'
import { ContactFormInput } from './contact-form-input'
import { ContactFormTextarea } from './contact-form-textarea'

const DRAFT_DEBOUNCE_MS = 500

// A stable reference, because `useForm` re-applies its options on every render and
// overwrites the form's values whenever `defaultValues` merely deep-differs from the
// previous object. A fresh literal per render would put the restored draft one
// untouched re-render away from being wiped.
const DEFAULT_VALUES = emptyContactValues()

type TextFieldT = {
  name: 'name' | 'email' | 'phone' | 'area'
  type?: 'email' | 'tel'
  autoComplete?: string
}

// Each name doubles as its own `form` translation key.
const TEXT_FIELDS: readonly TextFieldT[] = [
  { name: 'name', autoComplete: 'name' },
  { name: 'email', type: 'email', autoComplete: 'email' },
  { name: 'phone', type: 'tel', autoComplete: 'tel' },
  { name: 'area' },
]

// Both answer in sentences rather than a line, so both are textareas and both run the
// full width of the grid. Each name doubles as its own `form` translation key.
const TEXTAREA_FIELDS = ['scope', 'message'] as const

export function ContactForm() {
  const { t } = useTranslation('form')
  const setDraft = useContactFormStore((state) => state.setDraft)
  const clearDraft = useContactFormStore((state) => state.clearDraft)
  const [serverError, setServerError] = useState<string>()
  const [isSent, setIsSent] = useState(false)

  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    validators: { onSubmit: contactSchema },
    listeners: {
      onChange: ({ formApi }) => setDraft(formApi.state.values),
      onChangeDebounceMs: DRAFT_DEBOUNCE_MS,
    },
    onSubmit: async ({ value, formApi }) => {
      setServerError(undefined)
      setIsSent(false)

      // handleSubmit rethrows whatever the handler throws, and its caller can only
      // `void` the promise — so an offline browser or a server action id invalidated
      // by a redeploy would otherwise leave the visitor with a silent dead button.
      let result
      try {
        result = await submitContactForm(value)
      } catch {
        setServerError(t('error'))
        return
      }

      if (!result.ok) {
        setServerError(t(result.errorKey))
        return
      }

      clearDraft()
      formApi.reset(DEFAULT_VALUES)
      setIsSent(true)
    },
  })

  // The footer is server-rendered, so the form starts from constant empty values and the
  // saved draft is applied on the client. `keepDefaultValues` is load-bearing: without it
  // the restored draft *becomes* the form's defaults, and the reset after a successful
  // send refills every field with the enquiry that was just sent.
  useEffect(() => {
    if (form.state.isDirty) return
    form.reset(
      { ...useContactFormStore.getState().draft, acceptsTerms: false },
      {
        keepDefaultValues: true,
      },
    )
  }, [form])

  const errorFor = (errors: readonly ({ message: string } | undefined)[]) => {
    const key = firstIssueKey(errors)
    return key ? t(key) : undefined
  }

  return (
    <form
      className="grid gap-x-5 md:grid-cols-2"
      // The schema is the only validator: the browser's own bubble would fire first
      // and in the wrong language.
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      {TEXT_FIELDS.map((field) => (
        <form.Field key={field.name} name={field.name}>
          {(fieldApi) => (
            <ContactFormInput
              name={fieldApi.name}
              placeholder={t(field.name)}
              type={field.type}
              autoComplete={field.autoComplete}
              value={fieldApi.state.value}
              onChange={fieldApi.handleChange}
              onBlur={fieldApi.handleBlur}
              error={errorFor(fieldApi.state.meta.errors)}
            />
          )}
        </form.Field>
      ))}

      {TEXTAREA_FIELDS.map((name) => (
        <form.Field key={name} name={name}>
          {(field) => (
            <ContactFormTextarea
              name={field.name}
              placeholder={t(name)}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              error={errorFor(field.state.meta.errors)}
              className="md:col-span-2"
            />
          )}
        </form.Field>
      ))}

      <ContactFormAttachments className="md:col-span-2" />

      <div className="items-center md:col-span-2 md:flex">
        <form.Field name="acceptsTerms">
          {(field) => (
            <ContactFormCheckbox
              name={field.name}
              label={t('acceptTerms')}
              checked={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              error={errorFor(field.state.meta.errors)}
              className="mt-8 mb-8"
            />
          )}
        </form.Field>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button
              type="submit"
              hasIcon
              label={isSubmitting ? t('sending') : t('send')}
              disabled={isSubmitting}
              isBusy={isSubmitting}
              className="md:ml-auto"
            >
              <span
                aria-hidden
                className={cn(buttonLabelClasses({ disabled: isSubmitting }), 'flex h-3')}
              >
                <Arrow />
              </span>
            </Button>
          )}
        </form.Subscribe>
      </div>

      <p role="status" aria-live="polite" className="text-12 md:col-span-2">
        {isSent && <span className="text-grau_200">{t('success')}</span>}
      </p>
      <p role="alert" className="text-12 text-error md:col-span-2">
        {serverError}
      </p>
    </form>
  )
}
