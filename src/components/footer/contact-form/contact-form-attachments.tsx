'use client'

import { useId, useState } from 'react'

import { cn } from '@/lib/cn'
import { useTranslation } from '@/lib/i18n/use-translation'
import { fieldShellClasses } from './contact-form-field'

type PropsT = {
  className?: string
}

export function ContactFormAttachments({ className }: PropsT) {
  const { t } = useTranslation('form')
  const id = useId()
  const [fileNames, setFileNames] = useState<string[]>([])

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={cn(fieldShellClasses, 'hover:text-grau_100 flex cursor-pointer duration-200')}
      >
        {t('attachments')}
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
        <ul className="text-10 text-grau_200 mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {fileNames.map((fileName) => (
            <li key={fileName}>{fileName}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
