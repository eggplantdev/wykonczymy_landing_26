import { SERVER_URL } from '@/lib/env'
import { SITE_NAME } from '@/lib/seo/constants'

type PropsT = {
  telephone?: string
  email?: string
  /** One free-text line, as the editor typed it. */
  address?: string
  vatID?: string
}

export function OrganizationJsonLd({ telephone, email, address, vatID }: PropsT) {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SERVER_URL,
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
