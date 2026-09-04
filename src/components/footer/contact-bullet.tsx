type PropsT = {
  label: string
}

export function ContactBullet({ label }: PropsT) {
  return (
    <span className="bg-grau_800 text-grau_100 flex size-3.5 items-center justify-center rounded-full text-[0.5rem]">
      {label}
    </span>
  )
}
