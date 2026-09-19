'use client'

import * as Popover from '@radix-ui/react-popover'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

import { SettingsPanel } from '@/components/layout/settings-panel'
import { SettingsTrigger } from '@/components/layout/settings-trigger'
import type { Locale } from '@/lib/i18n/i18n'
import { useTranslation } from '@/lib/i18n/use-translation'

type PropsT = {
  paths: Partial<Record<Locale, string>>
  variant?: 'header' | 'mobile-menu'
  onNavigate?: () => void
}

export function SettingsMenu({ paths, variant = 'header', onNavigate }: PropsT) {
  const { t } = useTranslation('common')
  const shouldReduceMotion = useReducedMotion()
  const [isOpen, setIsOpen] = useState(false)
  const isMobileMenu = variant === 'mobile-menu'

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <SettingsTrigger label={t('settings')} isOpen={isOpen} isMobileMenu={isMobileMenu} />
      </Popover.Trigger>

      <AnimatePresence>
        {isOpen && (
          <Popover.Content
            forceMount
            // The panel is wider than the gear, so it cannot hang off the trigger's own edge:
            // in the bar it is pinned to the right so it opens inward, and in the sheet it is
            // centred on the column everything else in there is centred on.
            align={isMobileMenu ? 'center' : 'end'}
            // Measured from the gear, which in the bar sits inside the group's padding — so
            // the gap the panel actually shows below the bar is this minus that padding.
            sideOffset={12}
            // Focus stays on the gear, so the next Tab walks into the panel and the one after
            // that leaves it. Radix would otherwise move focus onto the panel itself, which
            // lands a keyboard user past the language control they most likely opened it for.
            onOpenAutoFocus={(event) => event.preventDefault()}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
            >
              <SettingsPanel
                paths={paths}
                onNavigate={() => {
                  setIsOpen(false)
                  onNavigate?.()
                }}
              />
            </motion.div>
          </Popover.Content>
        )}
      </AnimatePresence>
    </Popover.Root>
  )
}
