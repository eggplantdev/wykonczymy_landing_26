'use client'

import * as Popover from '@radix-ui/react-popover'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

import { LanguageMenu } from '@/components/layout/language-menu'
import { LanguageTrigger } from '@/components/layout/language-trigger'
import type { Locale } from '@/lib/i18n/i18n'
import { useTranslation } from '@/lib/i18n/use-translation'

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
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <LanguageTrigger
          locale={locale}
          label={labelFor(locale)}
          isOpen={isOpen}
          isMobileMenu={isMobileMenu}
        />
      </Popover.Trigger>

      <AnimatePresence>
        {isOpen && (
          <Popover.Content
            forceMount
            align="start"
            sideOffset={0}
            // Links, so tabbing off the last one should carry on into the page instead of
            // cycling back to the first.
            onOpenAutoFocus={(event) => event.preventDefault()}
            className="w-[var(--radix-popover-trigger-width)] overflow-hidden"
          >
            <motion.div
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
                isMobileMenu={isMobileMenu}
              />
            </motion.div>
          </Popover.Content>
        )}
      </AnimatePresence>
    </Popover.Root>
  )
}
