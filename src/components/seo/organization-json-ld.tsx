import { SERVER_URL } from '@/lib/env'
import type { OrganizationT } from '@/lib/content/organization'
import { absoluteUrl } from '@/lib/seo/absolute-url'
import { SITE_NAME } from '@/lib/seo/constants'

export function OrganizationJsonLd({ telephone, email, address, vatID }: OrganizationT) {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    // The block renders on every address, so PL and EN each emit one. A stable `@id` is what
    // says they describe the same business rather than two that happen to share a url.
    '@id': absoluteUrl('#organization'),
    name: SITE_NAME,
    url: SERVER_URL,
    // Required for the Organization rich result; the favicon is the only square mark we ship.
    logo: absoluteUrl('/icon.png'),
    telephone,
    email,
    // schema.org accepts `address` as Text. Splitting the editor's single line into a
    // `PostalAddress` would invent structure they never entered.
    address,
    vatID,
  }

  return (
    <script
      type="application/ld+json"
      // Every value is CMS text, so a stray `</script>` in a field would close this block
      // early and hand the rest of it to the parser as markup.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organization).replace(/</g, '\\u003c'),
      }}
    />
  )
}
