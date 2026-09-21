'use client'

import { useEffect, useState } from 'react'
import { useForm } from '@tanstack/react-form'

import { Button } from '@/components/ui/button'
import { ButtonArrow } from '@/components/ui/button-arrow'
import { upload } from '@vercel/blob/client'

import { leadPrefix } from '@/lib/blob/prefix'
import { isThrottled, UPLOAD_TOKEN_PATH } from '@/lib/blob/throttled'
import { checkAttachments } from '@/lib/contact/attachments'
import { useContactFormStore } from '@/lib/contact/contact-form-store'
import { contactSchema, emptyContactValues } from '@/lib/contact/contact-schema'
import { firstIssueKey } from '@/lib/contact/form-message-key'
import { submitContactForm } from '@/lib/contact/submit-contact-form'
import { useTranslation } from '@/lib/i18n/use-translation'
import { ConsentLabel } from './consent-label'
import { ContactFormAttachments } from './contact-form-attachments'
import { ContactFormCheckbox } from './contact-form-checkbox'
import { ContactFormInput } from './contact-form-input'
import { ContactFormTextarea } from './contact-form-textarea'
import { ContactFormTrap } from './contact-form-trap'

const DRAFT_DEBOUNCE_MS = 500

// A stable reference, because `useForm` re-applies its options on every render and
// overwrites the form's values whenever `defaultValues` merely deep-differs from the
// previous object. A fresh literal per render would put the restored draft one
// untouched re-render away from being wiped.
const DEFAULT_VALUES = emptyContactValues()

type TextFieldT = {
  name: 'name' | 'email' | 'phone' | 'address' | 'area'
  type?: 'email' | 'tel'
  autoComplete?: string
  className?: string
}

// Each name doubles as its own `form` translation key. A control carries its spacing as top
// padding, which the top row of the grid has nothing to separate from — dropping it there is
// what puts the first placeholder on the same line as the contact block beside it. That padding
// is responsive, so an override has to answer at both widths: `pt-0` alone leaves `md:pt-8`
// untouched, because a class only displaces the one carrying the same modifier.
const TEXT_FIELDS: readonly TextFieldT[] = [
  { name: 'name', autoComplete: 'name', className: 'pt-0 md:pt-0' },
  { name: 'email', type: 'email', autoComplete: 'email', className: 'md:pt-0' },
  { name: 'phone', type: 'tel', autoComplete: 'tel' },
  { name: 'address', autoComplete: 'street-address' },
  { name: 'area' },
]

// Both answer in sentences rather than a line, so both are textareas and both run the
// full width of the grid. Each name doubles as its own `form` translation key.
const TEXTAREA_FIELDS = ['scope', 'message'] as const

type PropsT = {
  /** The policy's address in the locale being read; absent until the page is published. */
  privacyPolicyHref?: string
}

export function ContactForm({ privacyPolicyHref }: PropsT) {
  const { t } = useTranslation('form')
  const setDraft = useContactFormStore((state) => state.setDraft)
  const clearDraft = useContactFormStore((state) => state.clearDraft)
  const [serverError, setServerError] = useState<string>()
  const [isSent, setIsSent] = useState(false)
  // Outside the form's values: files go straight to the blob store, the action is told their urls.
  const [files, setFiles] = useState<File[]>([])
  // Also outside them, so the trap never reaches the draft store, the schema or the envelope.
  const [trap, setTrap] = useState('')

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

      const checked = checkAttachments(files)
      if (!checked.ok) {
        setServerError(t(checked.errorKey))
        return
      }

      // Names both the blob prefix and the queue row — one submission has to be one thing.
      const submissionId = crypto.randomUUID()

      // Never through the action: a function request body caps at 4.5 MB.
      let assets
      try {
        assets = await Promise.all(
          checked.files.map(async (file) => {
            const blob = await upload(`${leadPrefix(submissionId)}${file.name}`, file, {
              access: 'public',
              handleUploadUrl: UPLOAD_TOKEN_PATH,
              clientPayload: JSON.stringify({ submissionId, values: value }),
            })

            return {
              url: blob.url,
              filename: file.name,
              contentType: file.type,
              size: file.size,
            }
          }),
        )
      } catch {
        setServerError(t((await isThrottled()) ? 'throttled' : 'uploadFailed'))
        return
      }

      // handleSubmit rethrows whatever the handler throws, and its caller can only
      // `void` the promise — so an offline browser or a server action id invalidated
      // by a redeploy would otherwise leave the visitor with a silent dead button.
      let result
      try {
        result = await submitContactForm({ submissionId, values: value, assets, trap })
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
      setFiles([])
      setTrap('')
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
              className={field.className}
              value={fieldApi.state.value}
              onChange={fieldApi.handleChange}
              onBlur={fieldApi.handleBlur}
              error={errorFor(fieldApi.state.meta.errors)}
            />
          )}
        </form.Field>
      ))}

      {TEXTAREA_FIELDS.map((textareaName) => (
        <form.Field key={textareaName} name={textareaName}>
          {(field) => (
            <ContactFormTextarea
              name={field.name}
              placeholder={t(textareaName)}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              error={errorFor(field.state.meta.errors)}
              className="md:col-span-2"
            />
          )}
        </form.Field>
      ))}

      <ContactFormTrap value={trap} onChange={setTrap} />

      <ContactFormAttachments
        files={files}
        onFilesChange={(picked) => {
          const checked = checkAttachments(picked)
          setServerError(checked.ok ? undefined : t(checked.errorKey))
          setFiles(checked.ok ? checked.files : [])
        }}
        className="md:col-span-2"
      />

      <div className="items-center md:col-span-2 md:flex">
        <form.Field name="acceptsTerms">
          {(field) => (
            <ContactFormCheckbox
              name={field.name}
              label={<ConsentLabel href={privacyPolicyHref} />}
              checked={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              error={errorFor(field.state.meta.errors)}
              className="my-5 md:my-8"
            />
          )}
        </form.Field>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button
              type="submit"
              variant="solid"
              size="sm"
              icon="trailing"
              label={isSubmitting ? t('sending') : t('send')}
              disabled={isSubmitting}
              isBusy={isSubmitting}
              className="md:ml-auto"
            >
              <ButtonArrow variant="solid" disabled={isSubmitting} />
            </Button>
          )}
        </form.Subscribe>
      </div>

      <p role="status" aria-live="polite" className="text-12 md:col-span-2">
        {isSent && <span className="text-muted-foreground">{t('success')}</span>}
      </p>
      <p role="alert" className="text-12 text-error md:col-span-2">
        {serverError}
      </p>
    </form>
  )
}
