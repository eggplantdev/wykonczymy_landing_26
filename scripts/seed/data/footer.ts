import type { LocalizedT } from '../types'

type FooterCopyT = { title: string; intro: string; role: string }

// The person a contact form submission reaches. Shared across locales except the job title.
export const footerContact = {
  name: 'Bartosz Antonik',
  phone: '+48 505 805 425',
  mail: 'bartekantonik@gmail.com',
}

// Read off each profile by hand — Fixly has no API, and Google's costs money per page view.
// Google's link is the listing's CID, the one identifier that survives a rename or a move.
export const footerRatings = [
  {
    platform: 'fixly',
    rating: 4.8,
    reviewCount: 206,
    profileUrl: 'https://fixly.pl/profil/tYMYyA5I',
  },
  {
    platform: 'google',
    rating: 4.9,
    reviewCount: 89,
    profileUrl: 'https://maps.google.com/?cid=15506338548739739236',
  },
] as const

export const footerCopy: LocalizedT<FooterCopyT> = {
  pl: {
    title: 'Twoja wiadomość',
    intro:
      'Napisz, co jest do zrobienia i jak duże jest wnętrze. Odeślemy wycenę z rozbiciem na pozycje, a jeśli zakres na to zasługuje — umówimy się na oględziny.',
    role: 'Wykończymy',
  },
  en: {
    title: 'Your message',
    intro:
      'Tell us what needs doing and roughly how big the space is. You will get an itemised estimate back, and if the job is worth a look in person we will arrange a site visit.',
    role: 'Wykończymy',
  },
}
