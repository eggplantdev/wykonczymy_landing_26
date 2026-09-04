'use client'

import { useId, useState } from 'react'

import { useTranslation } from '@/lib/i18n/use-translation'

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
        className="border-grau_300 text-12 text-grau_300 hover:text-grau_100 flex w-full cursor-pointer border-b pt-8 pb-2 duration-200"
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
