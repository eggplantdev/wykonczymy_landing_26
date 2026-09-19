import { buttonClasses, buttonLabelClasses } from '@/components/ui/button'
import { Phone } from '@/components/ui/icons/phone'

type PropsT = {
  phone: string
  // Names the action for a reader who only hears the number.
  callLabel: string
  onClick?: () => void
}

// The pill is worn by the link itself: a <button> inside an <a> is invalid markup and
// announces two controls where the reader sees one.
export function PhoneCta({ phone, callLabel, onClick }: PropsT) {
  return (
    <a
      href={`tel:${phone.replace(/\s/g, '')}`}
      aria-label={`${callLabel} ${phone}`}
      onClick={onClick}
      className={buttonClasses({ size: 'xl' })}
    >
      <span aria-hidden className="text-foreground group-hover:text-background duration-200">
        <Phone />
      </span>
      <span className={buttonLabelClasses({})}>{phone}</span>
    </a>
  )
}
