type PropsT = {
  label: string
}

export function ContactBullet({ label }: PropsT) {
  return (
    <span className="bg-muted text-muted-foreground flex size-3.5 items-center justify-center rounded-full text-8">
      {label}
    </span>
  )
}
