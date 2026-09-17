import type { MediaImageT } from '@/components/media/types'
import { cn } from '@/lib/cn'
import { ContactForm } from './contact-form/contact-form'
import { ContactPerson } from './contact-person'

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
}

export function SiteFooter({ container, data }: PropsT) {
  const { intro, ...person } = data

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
    </footer>
  )
}
