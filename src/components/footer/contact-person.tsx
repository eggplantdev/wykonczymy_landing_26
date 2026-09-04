import { Media } from '@/components/media/media'
import type { MediaImageT } from '@/components/media/types'
import { ContactBullet } from './contact-bullet'

type PropsT = {
  title: string
  avatar?: MediaImageT | null
  name: string
  role: string
  phone: string
  mail: string
}

export function ContactPerson({ title, avatar, name, role, phone, mail }: PropsT) {
  return (
    <div className="mb-12 md:mb-16 lg:col-span-3 lg:mb-10">
      <p className="text-14 md:text-18 lg:text-20 mb-8 font-medium md:mb-11 lg:mb-10">{title}</p>
      <div className="flex gap-x-5">
        <div className="size-[90px] shrink-0 overflow-hidden rounded-full">
          <Media image={avatar} sizes="90px" placeholderClassName="rounded-full" />
        </div>
        <div className="text-10 flex grow flex-col gap-y-1">
          <p>{name}</p>
          <p>{role}</p>
          <p className="mt-auto flex items-center gap-x-2">
            <ContactBullet label="T" />
            <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
          </p>
          <p className="flex items-center gap-x-2">
            <ContactBullet label="M" />
            <a href={`mailto:${mail}`}>{mail}</a>
          </p>
        </div>
      </div>
    </div>
  )
}
