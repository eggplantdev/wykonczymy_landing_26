import Image from 'next/image'
import Link from 'next/link'

// 72x56 keeps the source's 360x280 ratio; sizes must track the rendered width.
const WIDTH = 72
const HEIGHT = 56

// Both files ship and CSS picks one, rather than reading the theme in JS: `useTheme` only
// knows the answer after mount, which would leave the header logo-less on first paint —
// the one element on the page that cannot afford it. The cost is the second file, and the
// mark is the same 30KB drawing either way.
export function SiteLogo({ homeHref }: { homeHref: string }) {
  return (
    <Link href={homeHref} aria-label="Wykończymy">
      <Image
        src="/images/logo-wykonczymy-bw.png"
        alt="Wykończymy"
        width={WIDTH}
        height={HEIGHT}
        sizes="72px"
        priority
        className="dark:hidden"
      />
      {/* The wordmark alone is inverted — a whole-image filter would turn the mark
          inside out, blacking the house and flooding the toolbox white. */}
      <Image
        src="/images/logo-wykonczymy-bw-dark.png"
        alt=""
        aria-hidden
        width={WIDTH}
        height={HEIGHT}
        sizes="72px"
        priority
        className="hidden dark:block"
      />
    </Link>
  )
}
