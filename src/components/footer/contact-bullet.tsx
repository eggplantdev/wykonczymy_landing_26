type PropsT = {
  label: string
}

export function ContactBullet({ label }: PropsT) {
  return (
    <span className="flex size-3.5 items-center justify-center rounded-full bg-muted text-8 text-muted-foreground">
      {label}
    </span>
  )
}
