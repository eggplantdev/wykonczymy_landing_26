import type { HomePageDataT } from '@/components/home/home-page'
import type { MediaImageT } from '@/components/media/types'
import type { Page } from '@/payload-types'
import { interiorStyles } from './interior-styles'

// Stand-in for the `home` field group, which arrives with S1. Carried over from tdg's
// `utils/temp/homeTemplateData.ts` so the ported sections have the shape of content they
// were built for; every value here is destined for Payload.
const image = (file: string, alt: string): MediaImageT => ({ url: file, alt })

const project = (file: string) => `/images/projects/${file}`

type PathsT = Partial<Record<Page['pageType'], string>>

export function homePlaceholder(paths: PathsT): HomePageDataT {
  const link = (pageType: Page['pageType']) => paths[pageType] ?? '/'

  return {
    hero: {
      title: 'Your home, our finishing touch',
      image: image(
        project('Jastrzebie-Patkow-lesnych-106G-10.webp'),
        'Finished interior by Wykończymy',
      ),
      video: null,
      ctaLabel: 'Schedule a free estimate',
      ctaHref: link('contact'),
    },

    intro: {
      position: 'left',
      text: 'Quality finishing, affordable renovations for every budget. We guarantee top-quality workmanship and customer satisfaction, and our team is here to help no matter the size of the project. We handle even the small things, because we care about our clients at every stage of the job.',
    },

    services: {
      sectionTitle: 'What we do',
      cards: [
        {
          tint: 'blue',
          label: 'renovations',
          title: 'Renovations',
          text: 'Comprehensive renovations of apartments, houses, offices and commercial premises — from a single room to turnkey finishing, priced line by line before we start.',
          href: link('offer'),
          image: image(project('Jastrzebie-Patkow-lesnych-106G-11.webp'), 'Renovation in progress'),
          video: null,
        },
        {
          tint: 'green',
          label: 'installations',
          title: 'Installations',
          text: 'Electrical work, water and sewage networks, central heating and air conditioning — designed, fitted and tested by our own team.',
          href: link('offer'),
          image: image(project('Lizbonska-5-m197-10.webp'), 'Installation work'),
          video: null,
        },
        {
          tint: 'slate',
          label: 'finishing',
          title: 'Finishing',
          text: 'Painting, floors, decorative plaster and design services. The stage where a building site finally starts looking like somewhere you live.',
          href: link('offer'),
          image: image(project('Zupnicza-19-m57-11.webp'), 'Finished interior'),
          video: null,
        },
      ],
    },

    offers: {
      sectionTitle: 'Recent work',
      ctaLabel: 'See all projects',
      ctaHref: link('completed-works'),
      slides: [
        {
          image: image(
            project('Zupnicza-19-m57-1.webp'),
            'Apartment renovation on Zupnicza street',
          ),
          video: null,
          caption: 'Zupnicza 19 — a two-room apartment taken from bare walls to move-in ready.',
        },
        {
          image: image(
            project('Jastrzebie-Patkow-lesnych-106G-12.webp'),
            'House renovation in Jastrzębie',
          ),
          video: null,
          caption: 'Pątków Leśnych 106G — a full house renovation, inside and out.',
        },
        {
          image: image(
            project('Lizbonska-5-m197-1.webp'),
            'Apartment renovation on Lizbońska street',
          ),
          video: null,
          caption: 'Lizbońska 5 — kitchen and bathroom rebuilt around a new layout.',
        },
      ],
    },

    // Figures come from the published price list, so they stay true to what is actually quoted.
    numbers: {
      sectionTitle: 'Where our prices start',
      cards: [
        { id: 1, value: 16, unit: 'PLN / m²', description: 'Interior painting' },
        { id: 2, value: 70, unit: 'PLN / m²', description: 'Self-levelling compound' },
        { id: 3, value: 120, unit: 'PLN / m²', description: 'Tile installation' },
        { id: 4, value: 250, unit: 'PLN / m²', description: 'Microcement' },
      ],
    },

    interiorStyles: {
      sectionTitle: 'Interior styles',
      ctaLabel: 'See all interior styles',
      ctaHref: link('interior-styles'),
      styles: interiorStyles,
    },

    featuredProject: {
      sectionTitle: 'Featured project',
      projectTitle: 'Pątków Leśnych 106G',
      projectSubtitle:
        'A full house renovation in Jastrzębie, finished room by room while the owners stayed in.',
      ctaLabel: 'See the project',
      ctaHref: link('completed-works'),
      image: image(
        project('Jastrzebie-Patkow-lesnych-106G-13.webp'),
        'House renovation in Jastrzębie',
      ),
      video: null,
    },
  }
}
