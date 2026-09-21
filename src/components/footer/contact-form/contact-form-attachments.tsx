'use client'

import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useId, useRef } from 'react'

import { buttonClasses, buttonLabelClasses } from '@/components/ui/button'
import { FILE_PICKER_ACCEPT } from '@/lib/contact/attachments'
import { Paperclip } from '@/components/ui/icons/paperclip'
import { cn } from '@/lib/cn'
import '@/lib/fontawesome'
import { useTranslation } from '@/lib/i18n/use-translation'

type PropsT = {
  files: File[]
  onFilesChange: (files: File[]) => void
  /** Re-encoding the picked photos, which runs before they are counted as attached. */
  isProcessing?: boolean
  className?: string
}

export function ContactFormAttachments({ files, onFilesChange, isProcessing, className }: PropsT) {
  const { t } = useTranslation('form')
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  // `formApi.reset` does not reach a file input, and re-picking its current value fires no `change`.
  useEffect(() => {
    if (files.length === 0 && inputRef.current) inputRef.current.value = ''
  }, [files])

  const processingLabel = t('processingFiles')
  const spokenStatus = isProcessing
    ? processingLabel
    : files.length > 0
      ? t('filesAttached', { files: files.map((file) => file.name).join(', ') })
      : ''

  return (
    <div className={cn('pt-5 md:pt-8', className)}>
      {/* `items-start` and not `items-center`: the hint runs to two or three lines on a phone,
          and a centred mark would drift to the middle of the block instead of sitting on the
          line the sentence starts on. */}
      <p className="flex items-start gap-2 text-14 text-foreground">
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
          ref={inputRef}
          id={id}
          name="attachments"
          type="file"
          multiple
          accept={FILE_PICKER_ACCEPT.join(',')}
          onChange={(event) => onFilesChange(Array.from(event.target.files ?? []))}
          className="sr-only"
        />
      </label>

      {/* Permanently mounted: a live region created in the same commit as its text announces
          nothing, and the <ul> below is not one — so this is the only spoken feedback. */}
      <p aria-live="polite" className="sr-only">
        {spokenStatus}
      </p>

      {isProcessing ? (
        <p aria-hidden className="mt-2 text-14 text-muted-foreground">
          {processingLabel}
        </p>
      ) : (
        files.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-14 text-muted-foreground">
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        )
      )}
    </div>
  )
}
