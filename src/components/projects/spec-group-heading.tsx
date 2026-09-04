type PropsT = {
  title: string
}

export function SpecGroupHeading({ title }: PropsT) {
  return (
    <header className="text-14 md:text-18 xl:text-20 mb-6 font-medium capitalize md:mb-8">
      {title}
    </header>
  )
}
