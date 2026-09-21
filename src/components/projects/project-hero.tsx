import { Media } from '@/components/media/media'
import type { ProjectT } from '@/lib/content/projects'

type PropsT = {
  project: ProjectT
}

export function ProjectHero({ project }: PropsT) {
  const { title, summary, image } = project

  return (
    <section className="relative h-svh">
      <div className="absolute inset-0 flex">
        <Media image={image} priority sizes="100vw" />
      </div>

      <div className="relative flex h-full w-full flex-col items-start justify-end paddings pb-5 text-on-media md:pb-12 xl:pb-10">
        <h1 className="mb-6 text-18 md:leading-111 xl:text-24 xl:leading-normal">{title}</h1>
        <div className="gridContainer w-full">
          <p className="col-span-6 text-18 leading-125 md:text-20 md:leading-130 xl:text-32 xl:leading-normal">
            {summary}
          </p>
        </div>
      </div>
    </section>
  )
}
