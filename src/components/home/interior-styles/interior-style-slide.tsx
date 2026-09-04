import Link from 'next/link'

import { StyleCardBody } from '@/components/interior-styles/style-card-body'
import type { InteriorStyleT } from '@/components/interior-styles/types'

type PropsT = {
  style: InteriorStyleT
  href: string
}

export function InteriorStyleSlide({ style, href }: PropsT) {
  return (
    <Link
      href={href}
      className="group border-r-grau_300 relative block shrink-0 border-r px-2 md:px-2.5"
    >
      <div className="w-[257px] px-2 md:w-[306px] md:px-4">
        <StyleCardBody
          style={style}
          imageClassName="h-40 md:h-[182px]"
          sizes="(max-width: 767px) 241px, 274px"
        />
      </div>
    </Link>
  )
}
