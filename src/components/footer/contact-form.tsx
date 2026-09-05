'use client'

import { useId, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Checkmark } from '@/components/ui/icons/checkmark'
import { useTranslation } from '@/lib/i18n/use-translation'
import { ContactFormAttachments } from './contact-form-attachments'
import { ContactFormInput } from './contact-form-input'

export function ContactForm() {
  const { t } = useTranslation('form')
  const termsId = useId()
  const [acceptsTerms, setAcceptsTerms] = useState(false)

  return (
    <form className="grid gap-x-5 md:grid-cols-2">
      <ContactFormInput id="first-name" placeholder={t('firstName')} />
      <ContactFormInput id="last-name" placeholder={t('lastName')} />
      <ContactFormInput id="email" placeholder={t('email')} type="email" />
      <ContactFormInput id="phone" placeholder={t('phone')} type="tel" />
      <ContactFormInput id="scope" placeholder={t('scope')} />
      <ContactFormInput id="area" placeholder={t('area')} />
      <ContactFormAttachments className="md:col-span-2" />

      <div className="items-center md:col-span-2 md:flex">
        <label
          htmlFor={termsId}
          className="text-12 text-grau_300 mt-8 mb-8 flex cursor-pointer items-center"
        >
          <input
            id={termsId}
            type="checkbox"
            checked={acceptsTerms}
            onChange={(event) => setAcceptsTerms(event.target.checked)}
            className="peer sr-only"
          />
          <span className="bg-grau_600 text-grau_200 flex size-4.5 shrink-0 items-center justify-center rounded-[1px] peer-focus-visible:outline peer-focus-visible:outline-offset-2">
            {acceptsTerms && <Checkmark />}
          </span>
          <span
            className={`ml-7.5 w-2/3 leading-150 md:w-auto ${acceptsTerms ? 'text-grau_200' : 'text-grau_500'}`}
          >
            {t('acceptTerms')}
          </span>
        </label>

        <Button
          variant="dark"
          label={t('send')}
          disabled={!acceptsTerms}
          className="mb-8 md:mb-0 md:ml-auto"
        />
      </div>
    </form>
  )
}
