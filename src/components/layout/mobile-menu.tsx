'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { MenuToggle } from '@/components/layout/menu-toggle'
import { SiteNav } from '@/components/layout/site-nav'
import { Button } from '@/components/ui/button'
import type { Locale } from '@/lib/i18n/i18n'
import { useTranslation } from '@/lib/i18n/use-translation'
import type { Page } from '@/payload-types'

type PropsT = {
  paths: Partial<Record<Locale, string>>
  typePaths: Partial<Record<Page['pageType'], string>>
  phone: string
}

const PANEL_ID = 'mobile-menu-panel'

// The toggle morphs into the close icon, so it stays above the panel and is the only
// way to dismiss it — no second close button inside.
export function MobileMenu({ paths, typePaths, phone }: PropsT) {
  const { t } = useTranslation('nav')
  const shouldReduceMotion = useReducedMotion()
  const [isOpen, setIsOpen] = useState(false)

  // The panel covers the viewport, so a scrolling page behind it would silently move
  // the reader somewhere else before they close it.
  function setOpen(open: boolean) {
    document.body.style.overflow = open ? 'hidden' : ''
    setIsOpen(open)
  }

  return (
    <>
      <MenuToggle
        label={isOpen ? t('closeMenu') : t('menu')}
        isOpen={isOpen}
        onClick={() => setOpen(!isOpen)}
        aria-controls={PANEL_ID}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={PANEL_ID}
            className="bg-white fixed inset-0 z-40 flex h-lvh w-full flex-col items-center justify-center gap-8 overflow-y-auto p-6 md:hidden"
            initial={{ x: '100%' }}
            animate={{
              x: 0,
              transition: shouldReduceMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 400, damping: 28 },
            }}
            exit={{
              x: '100%',
              transition: shouldReduceMotion
                ? { duration: 0 }
                : { type: 'tween', duration: 0.15, ease: 'easeOut' },
            }}
          >
            <SiteNav paths={typePaths} variant="panel" onNavigate={() => setOpen(false)} />

            <LanguageSwitcher paths={paths} variant="panel" onNavigate={() => setOpen(false)} />

            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              aria-label={`${t('callUs')} ${phone}`}
              onClick={() => setOpen(false)}
            >
              <Button label={phone} size="xl" className="text-18 h-12 px-6" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
