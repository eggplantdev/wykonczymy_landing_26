'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

import { LanguageMenu } from '@/components/layout/language-menu'
import { LanguageTrigger } from '@/components/layout/language-trigger'
import type { Locale } from '@/lib/i18n/i18n'
import { useTranslation } from '@/lib/i18n/use-translation'

const MENU_ID = 'language-menu'

type PropsT = {
  paths: Partial<Record<Locale, string>>
  variant?: 'header' | 'mobile-menu'
  onNavigate?: () => void
}

// Both locales are listed rather than a single toggle to the other one: the trigger has
// to say which language you are currently reading, which a bare "EN" cannot.
export function LanguageSwitcher({ paths, variant = 'header', onNavigate }: PropsT) {
  const { t, locale } = useTranslation('common')
  const shouldReduceMotion = useReducedMotion()
  const [isOpen, setIsOpen] = useState(false)
  const isMobileMenu = variant === 'mobile-menu'

  const labelFor = (candidate: Locale) => t(candidate === 'en' ? 'languageEn' : 'languagePl')

  return (
    <div
      className="relative inline-flex flex-col"
      // Closes when focus leaves the whole control — a click elsewhere blurs the
      // trigger, and a tab out of the last link blurs the menu.
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false)
      }}
    >
      <LanguageTrigger
        locale={locale}
        label={labelFor(locale)}
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        menuId={MENU_ID}
        isMobileMenu={isMobileMenu}
      />

      {/* Out of flow, so opening the list never shoves whatever sits below it down the
          page. */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 z-10 w-full overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
          >
            <LanguageMenu
              paths={paths}
              locale={locale}
              labelFor={labelFor}
              onSelect={() => {
                setIsOpen(false)
                onNavigate?.()
              }}
              id={MENU_ID}
              isMobileMenu={isMobileMenu}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
