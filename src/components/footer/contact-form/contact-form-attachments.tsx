'use client'

import { useId, useState } from 'react'

import { buttonClasses, buttonLabelClasses } from '@/components/ui/button'
import { Paperclip } from '@/components/ui/icons/paperclip'
import { cn } from '@/lib/cn'
import { useTranslation } from '@/lib/i18n/use-translation'

type PropsT = {
  className?: string
}

export function ContactFormAttachments({ className }: PropsT) {
  const { t } = useTranslation('form')
  const id = useId()
  const [fileNames, setFileNames] = useState<string[]>([])

  return (
    <div className={cn('pt-8', className)}>
      <p className="text-12 text-grau_300">{t('attachments')}</p>

      {/* A <label> rather than a <button>: a file input opens only from its own label or
          from a scripted click, so the control that looks like a button has to be the
          thing the input is labelled by — which also makes its text the input's
          accessible name, and the sentence above only a hint. */}
      <label
        htmlFor={id}
        className={buttonClasses({
          variant: 'outline',
          size: 'sm',
          icon: 'leading',
          className: 'mt-3 cursor-pointer',
        })}
      >
        <span aria-hidden className={cn(buttonLabelClasses({ variant: 'outline' }), 'flex')}>
          <Paperclip />
        </span>
        <span className={buttonLabelClasses({ variant: 'outline' })}>{t('attachmentsCta')}</span>
        <input
          id={id}
          name="attachments"
          type="file"
          multiple
          accept="image/*,application/pdf"
          onChange={(event) =>
            setFileNames(Array.from(event.target.files ?? []).map((file) => file.name))
          }
          className="sr-only"
        />
      </label>

      {fileNames.length > 0 && (
        <ul className="text-10 text-grau_100 mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {fileNames.map((fileName, index) => (
            <li key={index}>{fileName}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
