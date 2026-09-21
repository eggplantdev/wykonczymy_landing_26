'use client'

type PropsT = {
  value: string
  onChange: (value: string) => void
}

/**
 * A honeypot. Off-screen rather than `hidden` or `display:none`, both of which a form-filler checks
 * for; `aria-hidden` and `tabIndex={-1}` are what keep it away from a screen reader and the tab
 * order, since being off-screen alone hides it from neither.
 *
 * `website` and not `company`: the fields around it are a textbook address form, Chrome maps
 * `company` to `organization` and fills it from a saved profile regardless of `autoComplete`, and a
 * honeypot that autofill can trip discards a real enquiry while showing the visitor a thank-you.
 * No address profile carries a website, so nothing but a script puts a value here.
 */
export function ContactFormTrap({ value, onChange }: PropsT) {
  return (
    <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
      <input
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
