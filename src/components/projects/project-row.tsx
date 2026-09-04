import Link from 'next/link'

import { Arrow } from '@/components/ui/icons/arrow'
import { Media } from '@/components/media/media'
import { SpecStrip } from '@/components/ui/spec-strip'
import type { MediaImageT } from '@/components/media/types'
import type { SpecItemT } from '@/types/projects'

type PropsT = {
  href: string
  title: string
  summary: string
  image: MediaImageT | null
  details: SpecItemT[]
}

// One listing entry. The carousel's slide body reserves two columns for its arrows, which
// a listing has no use for, so this row spans the full grid instead.
export function ProjectRow({ href, title, summary, image, details }: PropsT) {
  return (
    <Link
      href={href}
      className="gridContainer paddings group bg-transparent py-8 delay-100 duration-1000 hover:bg-grau_900 lg:py-12"
    >
      <div className="relative col-span-full mb-6 aspect-[3/2] overflow-hidden md:order-2 md:col-span-4 md:col-start-5 md:mb-0 lg:col-span-6 lg:col-start-7">
        <Media image={image} sizes="(max-width: 767px) 100vw, 50vw" />
      </div>

      <div className="col-span-full flex flex-col md:col-span-4 lg:col-span-5">
        <div className="mb-6 flex items-center justify-between gap-4 md:mb-9 lg:mb-12">
          <h2 className="text-20 md:text-22 lg:text-28">{title}</h2>
          <div className="h-2.5 shrink-0 opacity-0 delay-100 duration-1000 group-hover:opacity-100">
            <Arrow color="#1B1B1B" />
          </div>
        </div>
        <p className="text-12 md:text-14 leading-130 mb-8 lg:mb-12">{summary}</p>
        <SpecStrip items={details} className="mt-auto grid-cols-1 lg:grid" />
      </div>
    </Link>
  )
}
