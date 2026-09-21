import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faEnvelope, faLocationDot, faPhoneVolume } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { PageWrapper } from '@/components/layout/page-wrapper'
import { formatPostalAddress } from '@/lib/contact/postal-address'
import type { ContactDetailsT } from '@/lib/content/contact'
import { getTranslations, type Locale } from '@/lib/i18n/i18n'
import '@/lib/fontawesome'

export type ContactPageDataT = ContactDetailsT & { phone: string; mail: string }

type RowT = {
  key: string
  label: string
  text: string
  href: string
  icon: IconDefinition
}

type PropsT = {
  locale: Locale
  // The heading is the page document's own localized title, not part of the field group.
  title: string
  data: ContactPageDataT
}

// A phone number is dialled from the href, not read from it, so the spaces that make it
// legible have to come out of the `tel:` target while staying in the text.
const telHref = (phone: string) => `tel:${phone.replace(/\s/g, '')}`

const mapsHref = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

// The page carries no form of its own: the footer puts one under every page, this one
// included. All that is left is the company's postal details.
export function ContactPage({ locale, title, data }: PropsT) {
  const { contact } = getTranslations(locale)
  const { nip, phone, mail } = data
  const address = formatPostalAddress(data.address, locale)

  // The address row is a spread rather than a filtered-out falsy entry: a conditional
  // member widens the array to include `false`, which no amount of filtering narrows back.
  const rows: RowT[] = [
    ...(address
      ? [
          {
            key: 'address',
            label: contact.address,
            text: address,
            href: mapsHref(address),
            icon: faLocationDot,
          },
        ]
      : []),
    {
      key: 'mail',
      label: contact.email,
      text: mail,
      href: `mailto:${mail}`,
      icon: faEnvelope,
    },
    // Still, unlike `phone-cta.tsx`'s ringing mark: this row sits between two motionless icons.
    {
      key: 'phone',
      label: contact.phone,
      text: phone,
      href: telHref(phone),
      icon: faPhoneVolume,
    },
  ]

  return (
    <PageWrapper hasHero={false} title={title}>
      <div className="flex flex-col items-center text-center">
        <ul className="flex flex-col items-start gap-y-4 text-14 md:text-18">
          {rows.map(({ key, label, text, href, icon }) => (
            <li key={key} className="flex items-center gap-x-4">
              <FontAwesomeIcon icon={icon} className="size-5 shrink-0" aria-hidden />
              <a
                href={href}
                aria-label={`${label}: ${text}`}
                {...(key === 'address' ? { target: '_blank', rel: 'noreferrer' } : {})}
                className="transition-colors hover:text-muted-foreground"
              >
                {text}
              </a>
            </li>
          ))}
        </ul>

        {nip && (
          <p className="mt-8 text-14 text-muted-foreground">
            {contact.nip} {nip}
          </p>
        )}
      </div>
    </PageWrapper>
  )
}
