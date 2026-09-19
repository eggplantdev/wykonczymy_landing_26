'use client'

import { useRef, useState } from 'react'

import { MenuToggle } from '@/components/layout/menu-toggle'
import { SettingsPanel } from '@/components/layout/settings-panel'
import { SiteNav } from '@/components/layout/site-nav'
import { PhoneCta } from '@/components/ui/phone-cta'
import { Sheet } from '@/components/ui/sheet'
import type { Locale } from '@/lib/i18n/i18n'
import { useTranslation } from '@/lib/i18n/use-translation'
import { useMediaQuery } from '@/lib/use-media-query'
import type { Page } from '@/payload-types'

type PropsT = {
  paths: Partial<Record<Locale, string>>
  typePaths: Partial<Record<Page['pageType'], string>>
  phone: string
}

const MENU_ID = 'mobile-menu'

// Mirrors `--breakpoint-md` in styles.css, where the toggle and the panel both stop
// being rendered.
const MD_AND_UP = '(min-width: 768px)'

export function MobileMenu({ paths, typePaths, phone }: PropsT) {
  const { t } = useTranslation('nav')
  const [isOpen, setIsOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Hiding the panel with `md:hidden` would leave the dialog open behind it: the scroll
  // lock, the focus trap and the page's `aria-hidden` would all survive a rotation into
  // landscape, with the toggle gone too and no key to press on a phone.
  const isDesktop = useMediaQuery(MD_AND_UP)
  if (isDesktop && isOpen) setIsOpen(false)

  return (
    <>
      <MenuToggle
        ref={toggleRef}
        label={isOpen ? t('closeMenu') : t('menu')}
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        aria-controls={MENU_ID}
      />

      <Sheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        triggerRef={toggleRef}
        label={t('menu')}
        closeLabel={t('closeMenu')}
        id={MENU_ID}
        className="items-center gap-4 bg-card p-6"
      >
        {/* `my-auto` on the nav and nothing on what follows it: the auto margins take the whole
            of the free space and split it evenly, so the nav sits centred and everything after
            it is left flush against the floor. */}
        <SiteNav
          paths={typePaths}
          variant="mobile-menu"
          onNavigate={() => setIsOpen(false)}
          className="my-auto"
        />

        {/* The panel itself, not the gear that opens it in the bar: the sheet has the room, so a
            trigger here only put a tap between a visitor and three buttons. Bare, because the
            sheet is already the card the popover has to draw for itself. Down here with the call
            button rather than under the nav — language and theme are settings, not destinations,
            and the nav should not read as five items long. */}
        <SettingsPanel paths={paths} onNavigate={() => setIsOpen(false)} />

        {/* Last, so the primary action keeps the floor and the thumb. */}
        <PhoneCta
          phone={phone}
          callLabel={t('callUs')}
          variant="solid"
          onClick={() => setIsOpen(false)}
        />
      </Sheet>
    </>
  )
}
