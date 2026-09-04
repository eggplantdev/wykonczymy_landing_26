import { Media } from '@/components/media/media'
import type { ProjectT } from '@/types/projects'

type PropsT = {
  project: ProjectT
}

export function ProjectHero({ project }: PropsT) {
  const { title, summary, area, price, image } = project
  const textStyle = 'text-18 leading-125 md:text-20 md:leading-130 xl:text-32 xl:leading-normal'

  return (
    <section className="relative h-svh">
      <div className="absolute inset-0 flex">
        <Media image={image} priority sizes="100vw" />
      </div>

      <div className="paddings relative flex h-full w-full flex-col items-start justify-end pb-5 text-white md:pb-12 xl:pb-10">
        <h1 className="text-18 xl:text-24 mb-6 md:leading-[111%] xl:leading-normal">{title}</h1>
        <div className="w-full justify-between xl:flex">
          <p className={`mb-4 max-w-[402px] md:mb-10 xl:mb-0 xl:max-w-[887px] ${textStyle}`}>
            {summary}
          </p>
          <div className={`gap-x-2 md:flex xl:flex-col ${textStyle}`}>
            <p>{area}</p>
            <p className="hidden md:block xl:hidden">-</p>
            <p>{price}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
