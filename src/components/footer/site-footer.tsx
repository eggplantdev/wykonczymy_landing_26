import { BrandLogo } from '@/components/brand/brand-logo'
import type { Page } from '@/payload-types'
import { CONTACT_FORM_ANCHOR } from '@/lib/anchors'
import { SectionTitle } from '@/components/layout/section-title'
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
      <div className="site-container paddings md:grid md:grid-cols-8 md:gap-x-5 lg:grid-cols-12 pt-20 md:pt-28">
        {/* Placement rides on the wrapper: once it sits between the grid and its item, the wrapper
            is the grid item, and classes left on the paragraph would be laid out against nothing. */}
        <FadeUp className="mb-20 md:col-span-6 lg:col-span-8 lg:col-start-5">
          <p className="text-18 leading-125 max-w-4xl md:text-32 md:leading-normal">{intro}</p>
        </FadeUp>

        {/* The header is fixed, so the anchored block carries its own offset from the top. Landing
            on the anchor mid-entrance still resolves ~20px high — the wrapper's transform moves the
            target with it — so the offset is sized to survive that rather than to be exact. */}
        <FadeUp className="col-span-full">
          <div
            id={CONTACT_FORM_ANCHOR}
            className="scroll-mt-24 md:scroll-mt-28 lg:grid lg:grid-cols-12 lg:gap-x-5 mb-8 lg:mb-20"
          >
            <SectionTitle title={title} className="mb-6 md:mb-8 lg:col-span-full lg:mb-10" />

            <ContactPerson {...person} />
            <div className="lg:col-span-8 lg:col-start-5">
              <ContactForm privacyPolicyHref={typePaths[PRIVACY_POLICY_PAGE_TYPE]} />
            </div>
          </div>
        </FadeUp>
      </div>

      {/* The form stays on the page's own canvas and only this block claims the dark role
          tokens — the same re-pointing the theme toggle does, scoped to a subtree. The colour
          change is what separates it from the form above, so it carries no hairline. It takes
          `paddings` without the column, so the black runs the width of the screen while its
          contents sit as far in from the edge as the header's logo.

          From `md` up only: on a phone the bar sits on the page's own canvas, so the roles have
          to stay the page's too — re-pointing them there painted the light theme's text on the
          light theme's background and the whole bar vanished. */}
      <div className="md:theme-dark md:bg-background text-foreground paddings py-4">
        {/* Three equal tracks, not `justify-between`: the latter equalises the gaps, so the
            middle item lands on the page's centre only when the two outer ones happen to be
            the same width. They are not — a pill against a credit line — and it sat off centre
            by half their difference. */}
        <div className="flex w-full flex-col items-center gap-y-2 md:grid md:grid-cols-3 md:justify-items-start md:gap-x-5">
          {/* No pill height down here: the bar is a credit line and the number reads as part
              of it, so the link is as tall as the type it is set in. `xl`'s h-12 made it a
              48px band on a phone, which looked like a button with its fill missing. */}
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
