'use client'

import { useId } from 'react'
import { useConsentManager } from '@c15t/nextjs/headless'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useTranslation } from '@/lib/i18n/use-translation'

import { CONSENT_CATEGORIES } from './consent-categories'

// `showModal()` is the only opener that brings the focus trap, Escape and the inert
// background with it, and throws if called twice. React re-runs a ref callback whenever
// its identity changes, so a stable identity is what makes this run once per mount.
function openModal(node: HTMLDialogElement | null) {
  node?.showModal()
}

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

  if (activeUI !== 'dialog') return null

  return (
    <dialog
      ref={openModal}
      aria-labelledby={`${dialogId}-title`}
      onCancel={() => setActiveUI('none')}
      // The backdrop is a pseudo-element with no node of its own, so a click on it
      // reports the dialog as its target.
      onClick={(event) => event.target === event.currentTarget && setActiveUI('none')}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-md bg-card p-6 text-foreground backdrop:bg-scrim/50 md:p-8"
    >
      <h2 id={`${dialogId}-title`} className="mb-2 text-16 md:text-18">
        {t('settingsTitle')}
      </h2>
      <p className="text-12 leading-150 text-muted-foreground">{t('settingsDescription')}</p>

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
                    <span className="text-12 text-foreground md:text-14">{t(title)}</span>
                    <span className="text-10 leading-150 text-muted-foreground md:text-12">
                      {t(body)}
                    </span>
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
    </dialog>
  )
}
