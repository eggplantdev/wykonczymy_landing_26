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
}

// The bar only, because the bar is the only place short of room for the controls themselves.
// The mobile sheet shows `SettingsPanel` outright — it has a whole screen, so a gear there
// only added a tap between a visitor and three buttons they could already see the shape of.
export function SettingsMenu({ paths }: PropsT) {
  const { t } = useTranslation('common')
  const shouldReduceMotion = useReducedMotion()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <SettingsTrigger label={t('settings')} isOpen={isOpen} />
      </Popover.Trigger>

      <AnimatePresence>
        {isOpen && (
          <Popover.Content
            forceMount
            // The panel is wider than the gear, so it cannot hang off the trigger's own edge:
            // pinned to the right, it opens inward.
            align="end"
            // Measured from the gear, which sits inside the group's padding — so the gap the
            // panel actually shows below the bar is this minus that padding.
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
                onNavigate={() => setIsOpen(false)}
                className="bg-card shadow-panel rounded-lg p-3"
              />
            </motion.div>
          </Popover.Content>
        )}
      </AnimatePresence>
    </Popover.Root>
  )
}
