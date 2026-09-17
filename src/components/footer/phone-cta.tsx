import { buttonClasses, buttonLabelClasses } from '@/components/ui/button'
import { Phone } from '@/components/ui/icons/phone'

type PropsT = {
  phone: string
  // Names the action for a reader who only hears the number.
  callLabel: string
}

// The pill is worn by the link itself: a <button> inside an <a> is invalid markup and
// announces two controls where the reader sees one — same as the mobile menu's CTA.
export function PhoneCta({ phone, callLabel }: PropsT) {
  return (
    <a
      href={`tel:${phone.replace(/\s/g, '')}`}
      aria-label={`${callLabel} ${phone}`}
      className={buttonClasses({ size: 'xl' })}
    >
      <span aria-hidden className="text-shwarz group-hover:text-grau_900 duration-200">
        <Phone />
      </span>
      <span className={buttonLabelClasses({})}>{phone}</span>
    </a>
  )
}
