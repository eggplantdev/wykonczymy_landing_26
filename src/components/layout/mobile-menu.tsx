'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

import { LanguageSwitcher } from '@/components/layout/language-switcher'
import { MenuToggle } from '@/components/layout/menu-toggle'
import { SiteNav } from '@/components/layout/site-nav'
import { buttonClasses, buttonLabelClasses } from '@/components/ui/button'
import type { Locale } from '@/lib/i18n/i18n'
import { useTranslation } from '@/lib/i18n/use-translation'
import type { Page } from '@/payload-types'

type PropsT = {
  paths: Partial<Record<Locale, string>>
  typePaths: Partial<Record<Page['pageType'], string>>
  phone: string
}

const MENU_ID = 'mobile-menu'

// The toggle morphs into the close icon, so it stays above the menu and is the only
// way to dismiss it — no second close button inside.
export function MobileMenu({ paths, typePaths, phone }: PropsT) {
  const { t } = useTranslation('nav')
  const shouldReduceMotion = useReducedMotion()
  const [isOpen, setIsOpen] = useState(false)

  // The menu covers the viewport, so a scrolling page behind it would silently move the
  // reader somewhere else before they close it. Driven by an effect rather than by the
  // toggle handler so the cleanup restores `overflow` even when the menu unmounts while
  // open — a route change or a resize past the md breakpoint would otherwise leave the
  // whole page unscrollable.
  useEffect(() => {
    if (!isOpen) return

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  return (
    <>
      <MenuToggle
        label={isOpen ? t('closeMenu') : t('menu')}
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        aria-controls={MENU_ID}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={MENU_ID}
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
            <SiteNav paths={typePaths} variant="mobile-menu" onNavigate={() => setIsOpen(false)} />

            <LanguageSwitcher
              paths={paths}
              variant="mobile-menu"
              onNavigate={() => setIsOpen(false)}
            />

            {/* The pill is worn by the link itself: a <button> inside an <a> is invalid
                markup and announces two controls where the reader sees one. */}
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              aria-label={`${t('callUs')} ${phone}`}
              onClick={() => setIsOpen(false)}
              className={buttonClasses({ size: 'xl' })}
            >
              <span className={buttonLabelClasses({})}>{phone}</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
