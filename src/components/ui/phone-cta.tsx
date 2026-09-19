import { faPhoneVolume } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { buttonClasses, buttonLabelClasses, type ButtonVariantT } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import '@/lib/fontawesome'

type PropsT = {
  phone: string
  // Names the action for a reader who only hears the number.
  callLabel: string
  variant?: ButtonVariantT
  onClick?: () => void
  // `xl` is the size a tappable pill wants, and the mobile menu takes it as it comes. The
  // footer bar is a line of type rather than a target, so it hands back `h-auto` here.
  className?: string
}

// The pill is worn by the link itself: a <button> inside an <a> is invalid markup and
// announces two controls where the reader sees one.
export function PhoneCta({ phone, callLabel, variant = 'light', onClick, className }: PropsT) {
  return (
    <a
      href={`tel:${phone.replace(/\s/g, '')}`}
      aria-label={`${callLabel} ${phone}`}
      onClick={onClick}
      className={cn(buttonClasses({ variant, size: 'xl' }), className)}
    >
      {/* Wears the label's colours rather than its own copy of them: the icon is part of the
          same swap, and a second table here drifted — it mapped `outline` onto the light pair,
          which hovers the icon to the canvas colour on a transparent fill. */}
      <FontAwesomeIcon
        icon={faPhoneVolume}
        className={cn(
          'size-5 origin-top motion-safe:animate-ring',
          buttonLabelClasses({ variant }),
        )}
      />
      <span className={buttonLabelClasses({ variant })}>{phone}</span>
    </a>
  )
}
