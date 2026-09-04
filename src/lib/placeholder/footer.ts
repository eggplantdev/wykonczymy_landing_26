import type { SiteFooterT } from '@/components/footer/site-footer'
import type { Locale } from '@/lib/i18n/i18n'

// Stand-in for the global `footer` field group. Carried over from tdg's
// `buildContactForm`; every value here is destined for Payload.
const CONTACT = {
  name: 'Bartosz Antonik',
  role: 'Wykończymy',
  phone: '+48 505 805 425',
  mail: 'bartekantonik@gmail.com',
} as const

const COPY: Record<Locale, Pick<SiteFooterT, 'title' | 'intro'>> = {
  pl: {
    title: 'Twoja wiadomość do nas',
    intro:
      'Napisz, co jest do zrobienia i jak duże jest wnętrze. Odeślemy wycenę z rozbiciem na pozycje, a jeśli zakres na to zasługuje — umówimy się na oględziny.',
  },
  en: {
    title: 'Your message to us',
    intro:
      'Tell us what needs doing and roughly how big the space is. You will get an itemised estimate back, and if the job is worth a look in person we will arrange a site visit.',
  },
}

export const footerPlaceholder = (locale: Locale): SiteFooterT => ({
  ...COPY[locale],
  ...CONTACT,
  avatar: null,
})
