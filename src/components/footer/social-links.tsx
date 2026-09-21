import { cn } from '@/lib/cn'
import { Facebook } from '@/components/ui/icons/facebook'
import { Instagram } from '@/components/ui/icons/instagram'

const SOCIALS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/people/Warsaw-Handyman/100085905117915/',
    Icon: Facebook,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/handyman_warsaw_/',
    Icon: Instagram,
  },
]

type PropsT = {
  className?: string
}

export function SocialLinks({ className }: PropsT) {
  return (
    <ul className={cn('flex items-center gap-x-3 text-foreground', className)}>
      {SOCIALS.map(({ label, href, Icon }) => (
        <li key={label} className="flex">
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="transition-opacity hover:opacity-70"
          >
            <Icon />
          </a>
        </li>
      ))}
    </ul>
  )
}
