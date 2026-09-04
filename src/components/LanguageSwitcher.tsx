'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { NavGroup } from '@/components/layout/nav-group'
import { NavItem } from '@/components/layout/nav-item'
import {
  navMenuClass,
  navMenuItemClass,
  navTriggerClass,
  navTriggerOpenClass,
  type NavVariantT,
} from '@/components/layout/nav-variants'
import { ChevronDown } from '@/components/ui/icons/chevron-down'
import { i18n, type Locale } from '@/lib/i18n/i18n'
import { useTranslation } from '@/lib/i18n/use-translation'

// Home is the fallback because `pathsForPage` omits a locale the page has no slug
// for — the switcher still has somewhere to send you, in the language you asked for.
const localeHome = (locale: Locale) => (locale === i18n.defaultLocale ? '/' : `/${locale}/home/`)

const MENU_ID = 'language-menu'

type PropsT = {
  paths: Partial<Record<Locale, string>>
  variant?: NavVariantT
  onNavigate?: () => void
}

// Both locales are listed rather than a single toggle to the other one: the trigger has
// to say which language you are currently reading, which a bare "EN" cannot.
export function LanguageSwitcher({ paths, variant = 'bar', onNavigate }: PropsT) {
  const { t, locale } = useTranslation('common')
  const shouldReduceMotion = useReducedMotion()
  const [isOpen, setIsOpen] = useState(false)

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
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={MENU_ID}
        aria-label={labelFor(locale)}
        onClick={() => setIsOpen(!isOpen)}
        className={twMerge(
          'text-14 text-shwarz inline-flex items-center justify-center gap-2',
          navTriggerClass[variant],
          isOpen && navTriggerOpenClass,
        )}
      >
        {locale.toUpperCase()}
        <span
          aria-hidden="true"
          className={twMerge('inline-flex size-4 duration-300', isOpen && 'rotate-180')}
        >
          <ChevronDown />
        </span>
      </button>

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
            <NavGroup id={MENU_ID} className={navMenuClass[variant]}>
              {i18n.locales.map((candidate) => (
                <NavItem
                  key={candidate}
                  href={paths[candidate] ?? localeHome(candidate)}
                  className={navMenuItemClass[variant]}
                  hrefLang={candidate}
                  aria-label={labelFor(candidate)}
                  aria-current={candidate === locale ? 'true' : undefined}
                  onClick={() => {
                    setIsOpen(false)
                    onNavigate?.()
                  }}
                >
                  {candidate.toUpperCase()}
                </NavItem>
              ))}
            </NavGroup>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
