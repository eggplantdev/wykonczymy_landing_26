import { twMerge } from 'tailwind-merge'

type PropsT = {
  title?: string
  className?: string
}

export function SectionTitle({ title, className }: PropsT) {
  return (
    <h2 className={twMerge('text-22 md:text-28 lg:text-36 font-medium text-balance', className)}>
      {title}
    </h2>
  )
}
