import { cn } from '@/lib/cn'

type PropsT = {
  title: string
  className?: string
}

export function PageTitle({ title, className }: PropsT) {
  return (
    <h1
      className={cn(
        'mb-12 paddings text-center text-32 font-bold md:mb-24 md:text-40 lg:mb-20 lg:text-58',
        className,
      )}
    >
      {title}
    </h1>
  )
}
