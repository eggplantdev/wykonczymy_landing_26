type PropsT = {
  title: string
}

export function SpecGroupHeading({ title }: PropsT) {
  return (
    <header className="mb-6 text-14 font-medium capitalize md:mb-8 md:text-18 xl:text-20">
      {title}
    </header>
  )
}
