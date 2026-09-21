import Image from 'next/image'
import Link from 'next/link'

// 72x56 keeps the source's 360x280 ratio; sizes must track the rendered width.
const WIDTH = 72
const HEIGHT = 56

// Both files ship and CSS picks one, rather than reading the theme in JS: `useTheme` only
// knows the answer after mount, which would leave the header logo-less on first paint —
// the one element on the page that cannot afford it. The cost is the second file, and the
// mark is the same 30KB drawing either way.
//
// `fetchPriority` and not `preload`: both marks are in the DOM, so preloading would fetch the
// hidden one as well. Lazy's observer never fires on a `display: none` element, which is what
// keeps the download to the one mark this theme shows — at the front of the queue, not ahead
// of the hero photo, which is the page's LCP and the one thing that should preload.
export function SiteLogo({ homeHref }: { homeHref: string }) {
  return (
    <Link href={homeHref} aria-label="Wykończymy">
      <Image
        src="/images/logo-wykonczymy-bw.png"
        alt="Wykończymy"
        width={WIDTH}
        height={HEIGHT}
        sizes="72px"
        fetchPriority="high"
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
        fetchPriority="high"
        className="hidden dark:block"
      />
    </Link>
  )
}
