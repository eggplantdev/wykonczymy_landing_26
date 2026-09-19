'use client'

import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useId, useState } from 'react'

import { buttonClasses, buttonLabelClasses } from '@/components/ui/button'
import { Paperclip } from '@/components/ui/icons/paperclip'
import { cn } from '@/lib/cn'
import '@/lib/fontawesome'
import { useTranslation } from '@/lib/i18n/use-translation'

type PropsT = {
  className?: string
}

export function ContactFormAttachments({ className }: PropsT) {
  const { t } = useTranslation('form')
  const id = useId()
  const [fileNames, setFileNames] = useState<string[]>([])

  return (
    <div className={cn('pt-5 md:pt-8', className)}>
      {/* `items-start` and not `items-center`: the hint runs to two or three lines on a phone,
          and a centred mark would drift to the middle of the block instead of sitting on the
          line the sentence starts on. */}
      <p className="text-12 flex items-start gap-2 text-black">
        {/* `1lh` is one line box of the text beside it, so a mark centred inside this span
            lands on that first line's optical middle exactly. A hand-tuned `mt-*` only holds
            for the one font size and line height it was eyeballed against. */}
        <span aria-hidden className="flex h-[1lh] shrink-0 items-center">
          <FontAwesomeIcon icon={faCircleInfo} className="size-3.5" />
        </span>
        {t('attachments')}
      </p>

      {/* A <label> rather than a <button>: a file input opens only from its own label or
          from a scripted click, so the control that looks like a button has to be the
          thing the input is labelled by — which also makes its text the input's
          accessible name, and the sentence above only a hint. */}
      <label
        htmlFor={id}
        className={buttonClasses({
          variant: 'outline',
          size: 'sm',
          icon: 'trailing',
          className: 'mt-3 cursor-pointer',
        })}
      >
        <span className={buttonLabelClasses({ variant: 'outline' })}>{t('attachmentsCta')}</span>
        <span aria-hidden className={cn(buttonLabelClasses({ variant: 'outline' }), 'flex')}>
          <Paperclip />
        </span>
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
        <ul className="text-10 text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {fileNames.map((fileName, index) => (
            <li key={index}>{fileName}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
