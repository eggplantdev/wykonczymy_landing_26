import Image from 'next/image'
import Link from 'next/link'

export function SiteLogo({ homeHref }: { homeHref: string }) {
  return (
    <Link
      href={homeHref}
      aria-label="Wykończymy"
      className="fixed top-4 left-4 z-50 md:top-6 md:left-6"
    >
      <Image
        src="/images/logo-wykonczymy.png"
        alt="Wykończymy"
        // 72x56 keeps the source's 360x280 ratio; sizes must track the rendered width.
        width={72}
        height={56}
        sizes="72px"
        priority
      />
    </Link>
  )
}
