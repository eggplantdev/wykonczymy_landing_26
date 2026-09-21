'use client'

type PropsT = {
  value: string
  onChange: (value: string) => void
}

/**
 * A honeypot: a field no visitor can see, reach or hear, so anything in it was typed by something
 * filling every input it found. Off-screen rather than `hidden` or `display:none`, both of which a
 * form-filler checks for; `aria-hidden` and `tabIndex={-1}` are what keep it away from a screen
 * reader and the tab order, since being off-screen alone hides it from neither.
 *
 * `company` because the trap only works if the name looks worth filling.
 */
export function ContactFormTrap({ value, onChange }: PropsT) {
  return (
    <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
      <input
        name="company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
