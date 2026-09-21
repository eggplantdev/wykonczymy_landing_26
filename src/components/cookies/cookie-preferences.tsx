'use client'

import { useEffect, useId, useRef } from 'react'
import { useConsentManager } from '@c15t/nextjs/headless'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useTranslation } from '@/lib/i18n/use-translation'

import { CONSENT_CATEGORIES } from './consent-categories'

export function CookiePreferences() {
  const {
    activeUI,
    setActiveUI,
    saveConsents,
    selectedConsents,
    setSelectedConsent,
    consentTypes,
  } = useConsentManager()
  const { t } = useTranslation('cookies')
  const dialogId = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Opened and closed rather than mounted and unmounted, because `close()` is what hands
  // focus back to whatever was focused before — and three different buttons can open this
  // (the banner, and `CookieSettingsButton` in both the header popover and the mobile
  // sheet), so there is no single trigger to point a ref at. Unmounting skipped the close
  // steps entirely and dropped focus on `<body>`.
  useEffect(() => {
    const node = dialogRef.current
    if (!node) return

    // `showModal()` throws on an already-open dialog, which Strict Mode's second pass
    // would otherwise walk straight into.
    if (activeUI === 'dialog') {
      if (!node.open) node.showModal()
    } else if (node.open) {
      node.close()
    }
  }, [activeUI])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${dialogId}-title`}
      // Covers Escape and `close()` alike, so the store follows the element however it
      // was dismissed.
      onClose={() => setActiveUI('none')}
      // The backdrop is a pseudo-element with no node of its own, so a click on it
      // reports the dialog as its target.
      onClick={(event) => event.target === event.currentTarget && setActiveUI('none')}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-md bg-card p-6 text-foreground backdrop:bg-scrim/50 md:p-8"
    >
      {/* The element persists so `close()` can run; its contents do not, so a closed
          dialog costs every prerendered page one empty tag rather than the whole panel. */}
      {activeUI === 'dialog' && (
        <>
          <h2 id={`${dialogId}-title`} className="mb-2 text-16 md:text-18">
            {t('settingsTitle')}
          </h2>
          <p className="text-14 leading-150 text-muted-foreground">{t('settingsDescription')}</p>

          <ul className="mt-6 flex flex-col gap-4">
            {CONSENT_CATEGORIES.map(({ id, title, body }) => {
              // The store is what actually refuses to turn a category off, so it is also what
              // decides whether the row is lockable — a second flag here could disagree.
              const isLocked = consentTypes.find((type) => type.name === id)?.disabled ?? false

              return (
                <li key={id}>
                  {/* Ticked and locked rather than hidden, so the visitor is told what runs
                      whatever they choose. */}
                  <Checkbox
                    id={`${dialogId}-${id}`}
                    checked={isLocked || selectedConsents[id]}
                    disabled={isLocked}
                    onChange={(value) => setSelectedConsent(id, value)}
                    className="items-start"
                    label={
                      <span className="flex flex-col gap-y-1">
                        <span className="text-14 text-foreground">{t(title)}</span>
                        <span className="text-14 leading-150 text-muted-foreground">{t(body)}</span>
                      </span>
                    }
                  />
                </li>
              )
            })}
          </ul>

          {/* The two shortcuts stay equal to each other for the same reason the banner's do. */}
          <div className="mt-8 flex flex-col gap-2 md:flex-row-reverse">
            <Button size="sm" label={t('save')} onClick={() => saveConsents('custom')} />
            <Button
              size="sm"
              variant="outline"
              label={t('acceptAll')}
              onClick={() => saveConsents('all')}
            />
            <Button
              size="sm"
              variant="outline"
              label={t('rejectAll')}
              onClick={() => saveConsents('necessary')}
            />
          </div>
        </>
      )}
    </dialog>
  )
}
