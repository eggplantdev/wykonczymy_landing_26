import { cn } from '@/lib/cn'

export type TextSectionT = {
  text: string
  position: 'left' | 'right'
}

type PropsT = {
  data: TextSectionT
  container: string
}

export function TextSection({ data, container }: PropsT) {
  return (
    <section className={container}>
      <p
        className={cn(
          'text-18 leading-125 md:text-20 md:leading-130 lg:text-32 lg:leading-normal col-span-full md:col-span-6 lg:col-span-9 max-w-4xl',
          // Not `ml-auto`: a paragraph this long already fills its nine columns, so the auto
          // margin has no slack to absorb. Moving it right means moving the grid area.
          data.position === 'right' && 'md:col-start-3 lg:col-start-6',
        )}
      >
        {data.text}
      </p>
    </section>
  )
}
