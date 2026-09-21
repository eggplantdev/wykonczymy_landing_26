import { BrandLogo } from '@/components/brand/brand-logo'
import type { Page } from '@/payload-types'
import { CONTACT_FORM_ANCHOR } from '@/lib/anchors'
import { SectionTitle } from '@/components/ui/section-title'
import type { MediaImageT } from '@/components/media/types'
import { FadeUp } from '@/components/ui/fade-up'
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
    <footer>
      {/* The reading half takes the column; the dark bar below is a sibling rather than a grid
          item precisely so it does not. */}
      <div className="site-container paddings pt-20 md:grid md:grid-cols-8 md:gap-x-5 md:pt-28 lg:grid-cols-12">
        {/* Placement rides on the wrapper: once it sits between the grid and its item, the wrapper
            is the grid item, and classes left on the paragraph would be laid out against nothing. */}
        <FadeUp className="mb-20 md:col-span-6 lg:col-span-8 lg:col-start-5">
          <p className="max-w-4xl text-18 leading-125 md:text-32 md:leading-normal">{intro}</p>
        </FadeUp>

        {/* The header is fixed, so the anchored block carries its own offset from the top. Landing
            on the anchor mid-entrance still resolves ~20px high — the wrapper's transform moves the
            target with it — so the offset is sized to survive that rather than to be exact. */}
        <FadeUp className="col-span-full">
          <div
            id={CONTACT_FORM_ANCHOR}
            className="mb-8 scroll-mt-24 md:scroll-mt-28 lg:mb-20 lg:grid lg:grid-cols-12 lg:gap-x-5"
          >
            <SectionTitle title={title} className="mb-6 md:mb-8 lg:col-span-full lg:mb-10" />

            <ContactPerson {...person} />
            <div className="lg:col-span-8 lg:col-start-5">
              <ContactForm privacyPolicyHref={typePaths[PRIVACY_POLICY_PAGE_TYPE]} />
            </div>
          </div>
        </FadeUp>
      </div>

      <div className="paddings py-4 text-foreground md:bg-background md:theme-dark">
        <div className="flex w-full flex-col items-center gap-y-2 md:grid md:grid-cols-3 md:justify-items-start md:gap-x-5">
          <PhoneCta
            phone={data.phone}
            callLabel={nav.callUs}
            variant="ghost"
            className="h-auto py-0"
          />

          <SocialLinks className="md:justify-self-center" />

          <a
            href="https://eggplantdev.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-x-2 text-14 font-semibold transition-colors hover:text-muted-foreground md:justify-self-end"
          >
            <span>© 2026 eggplantdev.com</span>
            <BrandLogo className="h-8 w-auto" />
          </a>
        </div>
      </div>
    </footer>
  )
}
