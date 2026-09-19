import { Geist, Outfit } from 'next/font/google'

// `latin-ext` is not optional on either face — it is the subset carrying ą ć ę ł ń ó ś ź ż,
// and `ł` in particular is the character a face without it silently renders from a fallback.

// The body face.
export const siteFont = Geist({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-geist-sans',
  display: 'swap',
})

// The title face, applied to headings and the hero in `styles.css`.
export const titleFont = Outfit({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-outfit',
  display: 'swap',
})
