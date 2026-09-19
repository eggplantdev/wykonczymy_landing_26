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
  data: SiteFooterT
  locale: Locale
  typePaths: Partial<Record<Page['pageType'], string>>
}

export function SiteFooter({ data, locale, typePaths }: PropsT) {
  const { intro, title, ...person } = data
  const { nav } = getTranslations(locale)

  return (
    <footer
      className={cn('md:grid md:grid-cols-8 md:gap-x-5 lg:grid-cols-12 paddings pt-20 md:pt-36 ')}
    >
      <p className="text-18 leading-125 md:text-20 lg:text-32 mb-  md:col-span-6 md:mb-36 lg:col-span-8 lg:col-start-5 lg:leading-normal max-w-4xl">
        {intro}
      </p>

      {/* The header is fixed, so the anchored block keeps its own offset from the top. */}
      <div
        id={CONTACT_FORM_ANCHOR}
        className="col-span-full scroll-mt-24 md:scroll-mt-28 lg:grid lg:grid-cols-12 lg:gap-x-5"
      >
        <SectionTitle title={title} className="mb-6 md:mb-8 lg:col-span-full lg:mb-10" />

        <ContactPerson {...person} />
        <div className="lg:col-span-8 lg:col-start-5">
          <ContactForm privacyPolicyHref={typePaths[PRIVACY_POLICY_PAGE_TYPE]} />
        </div>
      </div>

      {/* The form stays on the page's own canvas and only this block claims the dark role
          tokens — the same re-pointing the theme toggle does, scoped to a subtree. The
          colour change is what separates it from the form above, so it carries no hairline.
          The negative margins cancel the footer's padding so the black reaches the edges of
          the viewport, then put that padding back on itself. */}
      <div
        data-theme="dark"
        className="bg-background text-foreground col-span-full -mx-6 mt-6 px-6 py-4 md:-mx-8 md:px-8 xl:-mx-12 xl:px-12"
      >
        {/* Three equal tracks, not `justify-between`: the latter equalises the gaps, so the
            middle item lands on the page's centre only when the two outer ones happen to be
            the same width. They are not, and it sat off centre by half their difference. */}
        <div className="flex w-full flex-col items-center gap-y-7 lg:grid lg:grid-cols-3 lg:justify-items-start lg:gap-x-5">
          <PhoneCta phone={data.phone} callLabel={nav.callUs} />

          <SocialLinks className="lg:justify-self-center" />
          <LegalLinks typePaths={typePaths} nav={nav} className="lg:justify-self-end" />
        </div>

        <a
          href="https://eggplantdev.com"
          target="_blank"
          rel="noreferrer"
          className="text-10 hover:text-muted-foreground mt-2  flex items-center justify-center gap-x-2 font-semibold transition-colors  w-fit mx-auto"
        >
          <span>© 2026 eggplantdev.com</span>
          <BrandLogo className="h-8 w-auto" />
        </a>
      </div>
    </footer>
  )
}
