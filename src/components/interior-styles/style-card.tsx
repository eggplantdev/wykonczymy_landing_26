import Link from 'next/link'

import { StyleCardBody } from './style-card-body'
import { cn } from '@/lib/cn'
import type { InteriorStyleT } from '@/lib/content/interior-styles'

type PropsT = {
  style: InteriorStyleT
  href: string
  index: number
}

export function StyleCard({ style, href, index }: PropsT) {
  const isLastInRow = (index + 1) % 3 === 0

  return (
    <Link
      href={href}
      className={cn(
        'group border-grau_300 relative pt-6 md:px-6 md:even:border-l lg:border-r lg:px-6.5 lg:even:border-l-0',
        isLastInRow && 'lg:border-r-0',
      )}
    >
      <StyleCardBody
        style={style}
        imageClassName="h-50 md:h-51.5 lg:aspect-287/190 lg:h-auto"
        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 45vw, (max-width: 1279px) 30vw, (max-width: 1919px) 25vw, 480px"
      />
    </Link>
  )
}
