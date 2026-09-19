import { BrandLogo } from '@/components/brand/brand-logo'
import type { Page } from '@/payload-types'
import { CONTACT_FORM_ANCHOR } from '@/lib/anchors'
import type { MediaImageT } from '@/components/media/types'
import { cn } from '@/lib/cn'
import { SectionTitle } from '@/components/layout/section-title'
import { getTranslations, type Locale } from '@/lib/i18n/i18n'
import { PRIVACY_POLICY_PAGE_TYPE } from '@/lib/routing'
import { PhoneCta } from '@/components/ui/phone-cta'
import { ContactForm } from './contact-form/contact-form'
import { ContactPerson } from './contact-person'
import { LegalLinks } from './legal-links'
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
  typePaths: Partial<Record<Page['pageType'], string>>
}

export function SiteFooter({ container, data, locale, typePaths }: PropsT) {
  const { intro, title, ...person } = data
  const { nav } = getTranslations(locale)

  return (
    <footer className={cn('md:grid md:grid-cols-8 md:gap-x-5 lg:grid-cols-12', container)}>
      <p className="text-18 leading-125 md:text-20 lg:text-32 mb-12 md:col-span-6 md:mb-16 lg:col-span-8 lg:col-start-5 lg:leading-normal max-w-4xl">
        {intro}
      </p>

      {/* TRIAL: everything under the intro claims the dark role tokens — the same
          re-pointing the theme toggle does, scoped to this band. The negative margins
          cancel the footer's own padding so the band reaches the edges of the viewport
          and then puts that padding back on itself. */}
      <div
        data-theme="dark"
        className="bg-background text-foreground col-span-full -mx-6 -mb-6 px-6 pt-12 pb-6 md:-mx-8 md:px-8 xl:-mx-12 xl:px-12"
      >
        {/* The header is fixed, so the anchored block keeps its own offset from the top. */}
        <div
          id={CONTACT_FORM_ANCHOR}
          className="col-span-full scroll-mt-24 justify-between md:scroll-mt-28 lg:grid lg:grid-cols-12 lg:gap-x-5 lg:pt-8"
        >
          <SectionTitle title={title} className="mb-8 md:mb-11 lg:col-span-full lg:mb-10" />

          <ContactPerson {...person} />
          <div className="lg:col-span-8 lg:col-start-5">
            <ContactForm privacyPolicyHref={typePaths[PRIVACY_POLICY_PAGE_TYPE]} />
          </div>
        </div>

        <div className="border-border col-span-full mt-10 border-t pt-4 md:mt-12">
          <LegalLinks typePaths={typePaths} nav={nav} className="mb-4" />

          <div className="flex flex-col items-center gap-y-7 lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-5">
            <PhoneCta phone={data.phone} callLabel={nav.callUs} />

            <SocialLinks className="lg:justify-self-end" />
          </div>
        </div>

        {/* The credit sits on its own strip, flush to the bottom of the band: the negative
            margins cancel the band's padding so the rule above it reaches both edges, then
            put that padding back inside. */}
        <div className="border-border -mx-6 -mb-6 mt-8 flex h-10 items-center border-t px-6 md:-mx-8 md:px-8 xl:-mx-12 xl:px-12">
          <a
            href="https://eggplantdev.com"
            target="_blank"
            rel="noreferrer"
            className="text-12 hover:text-muted-foreground inline-flex items-center gap-x-2 font-semibold transition-colors"
          >
            <span>© 2026 eggplantdev.com</span>
            <BrandLogo className="h-6 w-auto" />
          </a>
        </div>
      </div>
    </footer>
  )
}
