import { getPayload } from 'payload'

import config from '@/payload.config'
import { i18n, type Locale } from '@/lib/i18n/i18n'
import type { ServiceIconKeyT } from '@/lib/service-icons'
import { HOME_PAGE_TYPE } from '@/lib/routing'
import { isWrite, runWriteScript } from './write-guard'

// The copy the section was designed against, lifted out of the placeholder constant it shipped
// on. One-off: from here the steps are ordinary Payload fields and the admin is where they are
// edited, so this script is for filling an empty group once, not for keeping it in sync.
const SECTION_TITLE: Record<Locale, string> = {
  pl: 'Jak wygląda współpraca',
  en: 'How we work together',
}

// The icon is not localized — one drawing stands for the step in both languages — so it sits
// beside the rows rather than inside each locale's copy.
const ICONS: ServiceIconKeyT[] = [
  'ruler-combined',
  'compass-drafting',
  'hammer',
  'paint-roller',
  'brush',
  'house-chimney',
]

const STEPS: Record<Locale, { title: string; text: string }[]> = {
  pl: [
    {
      title: 'Rozmowa i wycena',
      text: 'Oglądamy mieszkanie, spisujemy zakres prac i przygotowujemy bezpłatną wycenę — pozycja po pozycji, bez widełek.',
    },
    {
      title: 'Projekt i harmonogram',
      text: 'Ustalamy materiały, kolejność prac i termin zakończenia. Wszystko trafia do umowy, żeby na budowie nie było niespodzianek.',
    },
    {
      title: 'Realizacja',
      text: 'Jedna ekipa od wyburzeń po malowanie. Kierownik budowy jest pod telefonem i raz w tygodniu wysyła zdjęcia z postępu prac.',
    },
    {
      title: 'Wykończenia',
      text: 'Malowanie, montaż drzwi, białego montażu i oświetlenia — etap, na którym mieszkanie zaczyna wyglądać jak na wizualizacji.',
    },
    {
      title: 'Sprzątanie po remoncie',
      text: 'Wywozimy gruz i zostawiamy mieszkanie gotowe do wniesienia mebli, bez pyłu po szlifowaniu gładzi.',
    },
    {
      title: 'Odbiór i gwarancja',
      text: 'Sprzątamy po sobie, przechodzimy odbiór punkt po punkcie i poprawiamy usterki. Na wykonane prace dajemy gwarancję.',
    },
  ],
  en: [
    {
      title: 'A visit and a quote',
      text: 'We walk the flat with you, write down the scope of the work and prepare a free quote — line by line, no ranges.',
    },
    {
      title: 'Plan and schedule',
      text: 'We agree the materials, the order of the work and the finish date. All of it goes into the contract, so there are no surprises on site.',
    },
    {
      title: 'The build',
      text: 'One crew from demolition through to painting. The site manager is on the phone, and sends photographs of the progress once a week.',
    },
    {
      title: 'Finishes',
      text: 'Painting, doors, bathroom fittings and lighting — the stage where the flat starts to look like the drawings.',
    },
    {
      title: 'The clean-up',
      text: 'We take the rubble away and leave the flat ready for furniture, with none of the dust that sanding leaves behind.',
    },
    {
      title: 'Handover and guarantee',
      text: 'We clean up after ourselves, walk the handover point by point and put right anything on the list. The work is guaranteed.',
    },
  ],
}

// Rows are shared across locales and matched by id, so the group is written for the first
// locale and then *updated* for the rest — sending a fresh array in the second locale would
// create a second set of rows and leave the first locale's copy orphaned on them.
//
// The surrounding `home` group is re-read per locale rather than carried over from the first:
// spreading the Polish document into the English write would replace every English field on
// the page with its Polish text.
const run = async () => {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'pages',
    locale: i18n.defaultLocale,
    depth: 0,
    limit: 1,
    where: { pageType: { equals: HOME_PAGE_TYPE } },
  })

  const home = docs[0]
  if (!home) throw new Error('No home page — nothing to write the process section to.')

  const existing = home.home?.process?.steps ?? []
  if (existing.length) {
    console.log(`home already has ${existing.length} process steps — leaving them alone.`)
    return { written: 0, kept: 1 }
  }

  let ids: (string | null | undefined)[] = []

  for (const locale of i18n.locales) {
    const current = await payload.findByID({
      collection: 'pages',
      id: home.id,
      locale,
      depth: 0,
    })

    const steps = STEPS[locale].map((step, index) => ({
      ...(ids[index] ? { id: ids[index] } : {}),
      title: step.title,
      text: step.text,
      icon: ICONS[index]!,
    }))

    console.log(`${isWrite ? 'writing' : 'would write'} ${steps.length} steps · ${locale}`)

    if (!isWrite) continue

    const updated = await payload.update({
      collection: 'pages',
      id: home.id,
      locale,
      data: { home: { ...current.home, process: { sectionTitle: SECTION_TITLE[locale], steps } } },
    })

    ids = updated.home?.process?.steps?.map((step) => step.id) ?? []
  }

  return { written: 1, kept: 0 }
}

runWriteScript(run)
