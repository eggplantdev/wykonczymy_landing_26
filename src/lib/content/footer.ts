import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { SiteFooterT } from '@/components/footer/site-footer'
import type { Locale } from '@/lib/i18n/i18n'
import { toImage } from './media'

export const findFooter = cache(async (locale: Locale): Promise<SiteFooterT> => {
  const payload = await getPayload({ config: await config })
  const doc = await payload.findGlobal({ slug: 'footer', locale, depth: 1 })

  return {
    title: doc.title,
    intro: doc.intro,
    name: doc.name,
    role: doc.role,
    phone: doc.phone,
    mail: doc.mail,
    avatar: toImage(doc.avatar),
  }
})
