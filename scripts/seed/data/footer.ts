import type { LocalizedT } from '../types'

type FooterCopyT = { title: string; intro: string; role: string }

// The person a quote request reaches. Shared across locales except the job title.
export const footerContact = {
  name: 'Bartosz Antonik',
  phone: '+48 505 805 425',
  mail: 'bartekantonik@gmail.com',
}

export const footerCopy: LocalizedT<FooterCopyT> = {
  pl: {
    title: 'Twoja wiadomość do nas',
    intro:
      'Napisz, co jest do zrobienia i jak duże jest wnętrze. Odeślemy wycenę z rozbiciem na pozycje, a jeśli zakres na to zasługuje — umówimy się na oględziny.',
    role: 'Wykończymy',
  },
  en: {
    title: 'Your message to us',
    intro:
      'Tell us what needs doing and roughly how big the space is. You will get an itemised estimate back, and if the job is worth a look in person we will arrange a site visit.',
    role: 'Wykończymy',
  },
}
