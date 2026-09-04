import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

import { Media } from '@/components/media/media'
import type { MediaImageT, MediaVideoT } from '@/components/media/types'
import { Arrow } from '@/components/ui/icons/arrow'

export type ServiceTintT = 'blue' | 'green' | 'slate'

export type ServiceCardT = {
  tint: ServiceTintT
  label: string
  title: string
  text: string
  href: string
  image: MediaImageT | null
  video: MediaVideoT | null
}

type PropsT = {
  card: ServiceCardT
}

export function ServiceCard({ card }: PropsT) {
  const { tint, label, title, text, href, image, video } = card

  return (
    <Link
      href={href}
      className={twMerge(
        'group w-auto bg-transparent px-4 pt-3 delay-100 duration-1000 md:pb-6',
        tint === 'slate' && 'hover:bg-living_800',
        tint === 'blue' && 'hover:bg-finance_800',
        tint === 'green' && 'hover:bg-optimum_800',
      )}
    >
      <div className="relative md:aspect-[400/382]">
        <Media
          image={image}
          video={video}
          sizes="(max-width: 767px) 75vw, (max-width: 1023px) 52vw, (max-width: 1919px) 33vw, 560px"
        />
      </div>
      <div className="border-b-shwarz flex h-10 items-center justify-between border-b">
        <span className="text-14">{label}</span>
        <div className="h-2.5 opacity-0 delay-100 duration-1000 group-hover:opacity-100">
          <Arrow color="#1B1B1B" />
        </div>
      </div>

      <header className="text-20 mb-4 line-clamp-1 pt-8 font-medium">{title}</header>
      <div className="text-14 leading-130 line-clamp-7 h-[5.625rem] overflow-hidden">{text}</div>
    </Link>
  )
}
