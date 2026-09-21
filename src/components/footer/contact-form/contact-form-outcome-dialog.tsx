'use client'

import { faCheck, faTriangleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as RadixDialog from '@radix-ui/react-dialog'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { useTranslation } from '@/lib/i18n/use-translation'
import { useOverlayLock } from '@/lib/overlay'
import '@/lib/fontawesome'

// The error carries its own sentence: the reason varies — a rejected upload, a throttled
// visitor, a schema issue the server caught — while success has only ever one thing to say.
export type ContactFormOutcomeT = { variant: 'success' } | { variant: 'error'; message: string }

type PropsT = {
  outcome: ContactFormOutcomeT
  onClose: () => void
}

// Mounted only while it is open, which is what lets it take the overlay lock: the page's
// carousels bind arrow keys on `document`, so they would otherwise page along behind it.
export function ContactFormOutcomeDialog({ outcome, onClose }: PropsT) {
  const { t } = useTranslation('form')
  const { t: tCommon } = useTranslation('common')
  const isError = outcome.variant === 'error'

  useOverlayLock()

  return (
    <RadixDialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-scrim/50" />

        {/* `inset-x-6` and `mx-auto` rather than a translated half-width: the gutter is then
            the same measurement on a phone as the panel's own padding. */}
        <RadixDialog.Content className="fixed inset-x-6 top-1/2 z-50 mx-auto max-w-md -translate-y-1/2 rounded-md bg-card p-6 text-foreground outline-hidden md:p-8">
          <RadixDialog.Close
            aria-label={tCommon('close')}
            className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-md hover:bg-muted md:top-6 md:right-6"
          >
            <FontAwesomeIcon icon={faXmark} className="size-3.5" />
          </RadixDialog.Close>

          <div
            className={cn(
              'flex size-11 items-center justify-center rounded-full',
              isError ? 'bg-error/10 text-error' : 'bg-success/10 text-success',
            )}
          >
            <FontAwesomeIcon
              icon={isError ? faTriangleExclamation : faCheck}
              className="size-4.5"
            />
          </div>

          <RadixDialog.Title className="mt-5 text-16 md:text-18">
            {t(isError ? 'errorTitle' : 'successTitle')}
          </RadixDialog.Title>

          <RadixDialog.Description className="mt-2 text-14 leading-150 text-muted-foreground">
            {isError ? outcome.message : t('success')}
          </RadixDialog.Description>

          <Button
            size="sm"
            variant="outline"
            label={tCommon('close')}
            onClick={onClose}
            className="mt-8 ml-auto"
          />
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
