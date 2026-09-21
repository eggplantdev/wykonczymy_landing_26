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
          'col-span-full max-w-4xl text-18 leading-125 md:col-span-6 md:text-32 md:leading-normal lg:col-span-9',
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
