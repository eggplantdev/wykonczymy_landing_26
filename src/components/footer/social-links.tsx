import { cn } from '@/lib/cn'
// TRIAL: swap these two back to `facebook`/`instagram` to undo.
import { FacebookFlat } from '@/components/ui/icons/facebook-flat'
import { InstagramFlat } from '@/components/ui/icons/instagram-flat'

const SOCIALS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/people/Warsaw-Handyman/100085905117915/',
    Icon: FacebookFlat,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/handyman_warsaw_/',
    Icon: InstagramFlat,
  },
]

type PropsT = {
  className?: string
}

export function SocialLinks({ className }: PropsT) {
  return (
    <ul className={cn('text-foreground flex items-center gap-x-3', className)}>
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
