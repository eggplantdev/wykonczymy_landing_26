import { cn } from '@/lib/cn'

type PropsT = {
  title: string
  className?: string
}

export function PageTitle({ title, className }: PropsT) {
  return (
    <h1
      className={cn(
        'paddings text-32 md:text-40 lg:text-58 mb-12 text-center font-bold md:mb-24 lg:mb-20',
        className,
      )}
    >
      {title}
    </h1>
  )
}
