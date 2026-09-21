import { getPayload } from 'payload'

import config from '@/payload.config'
import { i18n, type Locale } from '@/lib/i18n/i18n'
import type { ServiceIconKeyT } from '@/lib/service-icons'
import { HOME_PAGE_TYPE } from '@/lib/routing'
import { isWrite, runWriteScript } from './write-guard'

const SECTION_TITLE: Record<Locale, string> = {
  pl: 'Jak wygląda współpraca',
  en: 'How we work together',
}

// The icon is not localized — one drawing stands for the step in both languages — so it sits on
// the step rather than inside each locale's copy.
const STEPS: { icon: ServiceIconKeyT; copy: Record<Locale, { title: string; text: string }> }[] = [
  {
    icon: 'ruler-combined',
    copy: {
      pl: {
        title: 'Rozmowa i wycena',
        text: 'Oglądamy mieszkanie, spisujemy zakres prac i przygotowujemy bezpłatną wycenę — pozycja po pozycji, bez widełek.',
      },
      en: {
        title: 'A visit and a quote',
        text: 'We walk the flat with you, write down the scope of the work and prepare a free quote — line by line, no ranges.',
      },
    },
  },
  {
    icon: 'compass-drafting',
    copy: {
      pl: {
        title: 'Projekt i harmonogram',
        text: 'Ustalamy materiały, kolejność prac i termin zakończenia. Wszystko trafia do umowy, żeby na budowie nie było niespodzianek.',
      },
      en: {
        title: 'Plan and schedule',
        text: 'We agree the materials, the order of the work and the finish date. All of it goes into the contract, so there are no surprises on site.',
      },
    },
  },
  {
    icon: 'hammer',
    copy: {
      pl: {
        title: 'Realizacja',
        text: 'Jedna ekipa od wyburzeń po malowanie. Kierownik budowy jest pod telefonem i raz w tygodniu wysyła zdjęcia z postępu prac.',
      },
      en: {
        title: 'The build',
        text: 'One crew from demolition through to painting. The site manager is on the phone, and sends photographs of the progress once a week.',
      },
    },
  },
  {
    icon: 'paint-roller',
    copy: {
      pl: {
        title: 'Wykończenia',
        text: 'Malowanie, montaż drzwi, białego montażu i oświetlenia — etap, na którym mieszkanie zaczyna wyglądać jak na wizualizacji.',
      },
      en: {
        title: 'Finishes',
        text: 'Painting, doors, bathroom fittings and lighting — the stage where the flat starts to look like the drawings.',
      },
    },
  },
  {
    icon: 'brush',
    copy: {
      pl: {
        title: 'Sprzątanie po remoncie',
        text: 'Wywozimy gruz i zostawiamy mieszkanie gotowe do wniesienia mebli, bez pyłu po szlifowaniu gładzi.',
      },
      en: {
        title: 'The clean-up',
        text: 'We take the rubble away and leave the flat ready for furniture, with none of the dust that sanding leaves behind.',
      },
    },
  },
  {
    icon: 'house-chimney',
    copy: {
      pl: {
        title: 'Odbiór i gwarancja',
        text: 'Sprzątamy po sobie, przechodzimy odbiór punkt po punkcie i poprawiamy usterki. Na wykonane prace dajemy gwarancję.',
      },
      en: {
        title: 'Handover and guarantee',
        text: 'We clean up after ourselves, walk the handover point by point and put right anything on the list. The work is guaranteed.',
      },
    },
  },
]

const run = async () => {
  const payload = await getPayload({ config: await config })

  // `draft: true` so `_status` is the *latest* version's: `payload.update` merges onto that one,
  // not the published one, so writing to a page with unfinished editorial work would publish it
  // as a side effect. Same guard as `populate-seo.ts`.
  const { docs } = await payload.find({
    collection: 'pages',
    locale: i18n.defaultLocale,
    depth: 0,
    limit: 1,
    draft: true,
    where: { pageType: { equals: HOME_PAGE_TYPE } },
  })

  const home = docs[0]
  if (!home) throw new Error('No home page — nothing to write the process section to.')
  if (home._status !== 'published') {
    console.log('home has an unpublished draft — leaving it alone.')
    return { written: 0, kept: 1 }
  }

  let written = 0
  let kept = 0

  for (const locale of i18n.locales) {
    // Read per locale rather than once: with `fallback` off, a step filled in Polish comes back
    // with a null title in English, which is what the skip below has to see. It also carries the
    // row ids the Polish pass created — rows are shared across locales and matched by id, so a
    // write without them would create a second set and orphan the Polish copy on the first.
    const current = await payload.findByID({
      collection: 'pages',
      id: home.id,
      locale,
      depth: 0,
    })

    const existing = current.home?.process?.steps ?? []
    const filled = existing.filter((step) => step.title)
    if (filled.length) {
      console.log(`${locale} already has ${filled.length} process steps — leaving them alone.`)
      kept += filled.length
      continue
    }

    const steps = STEPS.map((step, index) => ({
      ...(existing[index]?.id ? { id: existing[index].id } : {}),
      title: step.copy[locale].title,
      text: step.copy[locale].text,
      icon: step.icon,
    }))

    console.log(`${isWrite ? 'writing' : 'would write'} ${steps.length} steps · ${locale}`)

    if (!isWrite) continue

    // Only the `process` group is sent. A partial group update leaves the page's other sections
    // alone — verified against the test database — while spreading them back in would re-submit
    // their required localized fields, and one untranslated sibling row would fail validation
    // and abort the run half-written.
    await payload.update({
      collection: 'pages',
      id: home.id,
      locale,
      data: { home: { process: { sectionTitle: SECTION_TITLE[locale], steps } } },
    })

    written += steps.length
  }

  return { written, kept }
}

runWriteScript(run)
