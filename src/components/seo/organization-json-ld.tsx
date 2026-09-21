import type { PostalAddressT } from '@/lib/contact/postal-address'
import type { OrganizationT } from '@/lib/content/organization'
import { SERVER_URL } from '@/lib/env'
import { absoluteUrl } from '@/lib/seo/absolute-url'
import { SITE_NAME } from '@/lib/seo/constants'

// schema.org also accepts `address` as Text, which is what this emitted while the CMS held one
// free-text line. The parts are stored separately now, so the typed form costs nothing and
// leaves the street, town and postcode individually machine-readable.
const postalAddress = ({ street, locality, postalCode, country }: PostalAddressT) => {
  // `country` is excluded from the test on purpose: it defaults to `PL`, so counting it would
  // make every empty address look populated and emit a `PostalAddress` carrying nothing but a
  // country — worse than claiming no address at all.
  if (!street && !locality && !postalCode) return undefined

  return {
    '@type': 'PostalAddress',
    streetAddress: street,
    addressLocality: locality,
    postalCode,
    addressCountry: country,
  }
}

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
    address: postalAddress(address),
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
