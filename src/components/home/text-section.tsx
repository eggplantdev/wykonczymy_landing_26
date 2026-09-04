import { twMerge } from 'tailwind-merge'

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
        className={twMerge(
          'text-18 leading-125 md:text-20 md:leading-130 lg:text-32 lg:leading-normal col-span-full lg:col-span-9',
          data.position === 'right' && 'ml-auto',
        )}
      >
        {data.text}
      </p>
    </section>
  )
}
