import { Geist, Poppins } from 'next/font/google'

// `latin-ext` is not optional on either face — it is the subset carrying ą ć ę ł ń ó ś ź ż,
// and `ł` in particular is the character a face without it silently renders from a fallback.

// The body face.
export const siteFont = Geist({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-geist-sans',
  display: 'swap',
})

// The title face, applied to headings and the hero in `styles.css`. Poppins ships as static
// cuts rather than a variable axis, so every weight a heading can reach has to be named here
// — an unlisted one is not downloaded and the browser synthesises it instead.
export const titleFont = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-poppins',
  display: 'swap',
})
