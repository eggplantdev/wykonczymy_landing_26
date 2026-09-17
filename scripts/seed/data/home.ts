import type { LocalizedT } from '../types'

type SectionCopyT = { sectionTitle: string; ctaLabel: string }

export type HomeCopyT = {
  hero: { title: string; ctaLabel: string }
  intro: string
  services: { sectionTitle: string; cards: { title: string; text: string }[] }
  projects: SectionCopyT
  numbers: { sectionTitle: string; cards: { unit: string; description: string }[] }
  interiorStyles: SectionCopyT
  featuredProject: SectionCopyT
}

// The parts of the home group that do not translate: which page each button opens, the
// figures on the numbers cards, and which project the page leads with. Their row order is
// what pairs the figures with the copy.
export const homeShared = {
  heroCtaLink: 'contact',
  projectsCtaLink: 'completed-works',
  interiorStylesCtaLink: 'interior-styles',
  introPosition: 'left',
  numberValues: [16, 70, 120, 250],
  /** Matched on its Polish slug. */
  featuredProjectSlug: 'zupnicza-19',
} as const

export const homeCopy: LocalizedT<HomeCopyT> = {
  pl: {
    hero: {
      title: 'Twój dom, nasze wykończenie',
      ctaLabel: 'Umów bezpłatną wycenę',
    },
    intro:
      'Solidne wykończenia i remonty w rozsądnej cenie, dopasowane do każdego budżetu. Gwarantujemy jakość wykonania i zadowolenie klienta, a nasza ekipa pomoże niezależnie od skali zlecenia. Zajmujemy się też drobiazgami, bo zależy nam na kliencie na każdym etapie prac.',
    services: {
      sectionTitle: 'Czym się zajmujemy',
      cards: [
        {
          title: 'Remonty',
          text: 'Kompleksowe remonty mieszkań, domów, biur i lokali usługowych — od jednego pokoju po wykończenie pod klucz, wycenione pozycja po pozycji przed startem.',
        },
        {
          title: 'Instalacje',
          text: 'Elektryka, instalacje wodno-kanalizacyjne, centralne ogrzewanie i klimatyzacja — zaprojektowane, wykonane i sprawdzone przez naszą ekipę.',
        },
        {
          title: 'Wykończenia',
          text: 'Malowanie, podłogi, tynki dekoracyjne i usługi projektowe. Etap, na którym plac budowy zaczyna wreszcie wyglądać jak miejsce do życia.',
        },
      ],
    },
    projects: {
      sectionTitle: 'Ostatnie realizacje',
      ctaLabel: 'Zobacz wszystkie realizacje',
    },
    numbers: {
      sectionTitle: 'Od ilu zaczynają się nasze ceny',
      cards: [
        { unit: 'zł / m²', description: 'Malowanie wnętrz' },
        { unit: 'zł / m²', description: 'Wylewka samopoziomująca' },
        { unit: 'zł / m²', description: 'Układanie płytek' },
        { unit: 'zł / m²', description: 'Mikrocement' },
      ],
    },
    interiorStyles: {
      sectionTitle: 'Style wnętrz',
      ctaLabel: 'Zobacz wszystkie style wnętrz',
    },
    featuredProject: {
      sectionTitle: 'Wybrana realizacja',
      ctaLabel: 'Zobacz realizację',
    },
  },
  en: {
    hero: {
      title: 'Your home, our finishing touch',
      ctaLabel: 'Schedule a free estimate',
    },
    intro:
      'Quality finishing, affordable renovations for every budget. We guarantee top-quality workmanship and customer satisfaction, and our team is here to help no matter the size of the project. We handle even the small things, because we care about our clients at every stage of the job.',
    services: {
      sectionTitle: 'What we do',
      cards: [
        {
          title: 'Renovations',
          text: 'Comprehensive renovations of apartments, houses, offices and commercial premises — from a single room to turnkey finishing, priced line by line before we start.',
        },
        {
          title: 'Installations',
          text: 'Electrical work, water and sewage networks, central heating and air conditioning — designed, fitted and tested by our own team.',
        },
        {
          title: 'Finishing',
          text: 'Painting, floors, decorative plaster and design services. The stage where a building site finally starts looking like somewhere you live.',
        },
      ],
    },
    projects: {
      sectionTitle: 'Recent work',
      ctaLabel: 'See all projects',
    },
    numbers: {
      sectionTitle: 'Where our prices start',
      cards: [
        { unit: 'PLN / m²', description: 'Interior painting' },
        { unit: 'PLN / m²', description: 'Self-levelling compound' },
        { unit: 'PLN / m²', description: 'Tile installation' },
        { unit: 'PLN / m²', description: 'Microcement' },
      ],
    },
    interiorStyles: {
      sectionTitle: 'Interior styles',
      ctaLabel: 'See all interior styles',
    },
    featuredProject: {
      sectionTitle: 'Featured project',
      ctaLabel: 'See the project',
    },
  },
}
