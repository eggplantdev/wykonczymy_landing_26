import { BrandLogo } from '@/components/brand/brand-logo'
import type { Page } from '@/payload-types'
import { CONTACT_FORM_ANCHOR } from '@/lib/anchors'
import type { MediaImageT } from '@/components/media/types'
import { FadeUp } from '@/components/ui/fade-up'
import { SectionTitle } from '@/components/layout/section-title'
import { getTranslations, type Locale } from '@/lib/i18n/i18n'
import { PRIVACY_POLICY_PAGE_TYPE } from '@/lib/routing'
import { PhoneCta } from '@/components/ui/phone-cta'
import { ContactForm } from './contact-form/contact-form'
import { ContactPerson } from './contact-person'
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
    <footer className="md:grid md:grid-cols-8 md:gap-x-5 lg:grid-cols-12 paddings pt-20 md:pt-36">
      {/* The grid placement rides on the wrapper, not the paragraph: the wrapper is what the
          footer's grid lays out once it sits between them. */}
      <FadeUp className="mb-20 md:col-span-6 md:mb-36 lg:col-span-8 lg:col-start-5">
        <p className="text-18 leading-125 md:text-20 lg:text-32 max-w-4xl lg:leading-normal">
          {intro}
        </p>
      </FadeUp>

      {/* The header is fixed, so the anchored block keeps its own offset from the top. The id and
          that offset stay on the inner element — an anchor that moves onto an animated wrapper
          would be scrolled to while the wrapper is still 20px out of place. */}
      <FadeUp className="col-span-full">
        <div
          id={CONTACT_FORM_ANCHOR}
          className="scroll-mt-24 md:scroll-mt-28 lg:grid lg:grid-cols-12 lg:gap-x-5"
        >
          <SectionTitle title={title} className="mb-6 md:mb-8 lg:col-span-full lg:mb-10" />

          <ContactPerson {...person} />
          <div className="lg:col-span-8 lg:col-start-5">
            <ContactForm privacyPolicyHref={typePaths[PRIVACY_POLICY_PAGE_TYPE]} />
          </div>
        </div>
      </FadeUp>

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
            the same width. They are not — a pill against a credit line — and it sat off centre
            by half their difference. */}
        <div className="flex w-full flex-col items-center gap-y-2 md:grid md:grid-cols-3 md:justify-items-start md:gap-x-5">
          <PhoneCta phone={data.phone} callLabel={nav.callUs} variant="ghost" />

          <SocialLinks className="md:justify-self-center" />

          <a
            href="https://eggplantdev.com"
            target="_blank"
            rel="noreferrer"
            className="text-10 hover:text-muted-foreground flex items-center gap-x-2 font-semibold transition-colors md:justify-self-end"
          >
            <span>© 2026 eggplantdev.com</span>
            <BrandLogo className="h-8 w-auto" />
          </a>
        </div>
      </div>
    </footer>
  )
}
