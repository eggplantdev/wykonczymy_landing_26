import { BrandLogo } from '@/components/brand/brand-logo'
import type { MediaImageT } from '@/components/media/types'
import { cn } from '@/lib/cn'
import { getTranslations, type Locale } from '@/lib/i18n/i18n'
import { ContactForm } from './contact-form/contact-form'
import { ContactPerson } from './contact-person'
import { PhoneCta } from './phone-cta'
import { SocialLinks } from './social-links'

export type SiteFooterT = {
  intro: string
  title: string
  avatar?: MediaImageT | null
  name: string
  role: string
  phone: string
  mail: string
}

type PropsT = {
  container?: string
  data: SiteFooterT
  locale: Locale
}

export function SiteFooter({ container, data, locale }: PropsT) {
  const { intro, ...person } = data
  const { common, nav } = getTranslations(locale)

  return (
    <footer className={cn('md:grid md:grid-cols-8 md:gap-x-5 lg:grid-cols-12', container)}>
      <p className="text-18 leading-125 md:text-20 lg:text-32 mb-12 md:col-span-6 md:mb-16 lg:col-span-8 lg:col-start-5 lg:leading-normal">
        {intro}
      </p>

      <div className="col-span-full justify-between lg:grid lg:grid-cols-12 lg:gap-x-5 lg:pt-8">
        <ContactPerson {...person} />
        <div className="lg:col-span-8 lg:col-start-5">
          <ContactForm />
        </div>
      </div>

      <div className="border-grau_700 col-span-full mt-12 border-t pt-8 md:mt-16">
        {/* Three zones rather than justify-between: the socials sit in the middle column,
            so they stay centred on the row whatever the phone number and credit measure.
            Bottom-aligned because only the middle zone carries a label above its icons —
            centring the zones would leave the phone, the socials and the credit on three
            different lines. Held back to lg: a third of the tablet row is narrower than the
            socials label, which then wraps mid-phrase. */}
        <div className="flex flex-col items-center gap-y-7 lg:grid lg:grid-cols-3 lg:items-end lg:gap-x-5">
          <PhoneCta phone={data.phone} callLabel={nav.callUs} />

          <div className="flex flex-col items-center gap-y-3 lg:justify-self-center">
            <p className="text-10 md:text-14">{common.followUsOnSocial}</p>
            <SocialLinks />
          </div>

          <a
            href="https://eggplantdev.com"
            target="_blank"
            rel="noreferrer"
            className="text-10 hover:text-grau_100 inline-flex items-center gap-x-2 transition-colors lg:justify-self-end"
          >
            <span>© 2026 eggplantdev.com</span>
            <BrandLogo className="h-8 w-auto" />
          </a>
        </div>
      </div>
    </footer>
  )
}
