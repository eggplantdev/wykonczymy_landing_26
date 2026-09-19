import type { Page } from '@/payload-types'
import { homeShared, type HomeCopyT } from './data/home'
import { toLexical } from './lexical'

/**
 * Payload matches array rows by id: a row written without one is a new row, so the old row
 * is deleted along with every field the seed does not supply — the photos an editor attached
 * to a services card. Both passes therefore carry the ids already in the database, the Polish
 * one included; otherwise re-seeding rebuilds the rows from scratch on every run.
 */
export type CarriedT = {
  services: (string | undefined)[]
  numbers: (string | undefined)[]
  testimonials: (string | undefined)[]
  // The hero photo is attached by `pnpm seed:photos`, which this pass knows nothing about.
  // Writing the group without it would blank the field on every copy re-seed.
  heroImage: number | null
  heroVideo: number | null
}

/** Depth varies between the two passes: the second reads back a document Payload populated. */
const idOf = (value: number | { id: number } | null | undefined): number | null =>
  typeof value === 'object' && value !== null ? value.id : (value ?? null)

export const carriedFrom = (doc: Page | undefined): CarriedT => ({
  services: (doc?.home?.services?.cards ?? []).map((card) => card.id ?? undefined),
  numbers: (doc?.home?.numbers?.cards ?? []).map((card) => card.id ?? undefined),
  testimonials: (doc?.home?.testimonials?.quotes ?? []).map((row) => row.id ?? undefined),
  heroImage: idOf(doc?.home?.hero?.image),
  heroVideo: idOf(doc?.home?.hero?.video),
})

export const homeGroup = (copy: HomeCopyT, carried: CarriedT) => ({
  hero: {
    title: copy.hero.title,
    image: carried.heroImage,
    video: carried.heroVideo,
    ctaLabel: copy.hero.ctaLabel,
    ctaLink: homeShared.heroCtaLink,
  },
  intro: { text: copy.intro, position: homeShared.introPosition },
  afterServices: {
    text: copy.afterServices,
    position: homeShared.afterServicesPosition,
  },
  services: {
    sectionTitle: copy.services.sectionTitle,
    cards: copy.services.cards.map((card, index) => ({ id: carried.services[index], ...card })),
  },
  projects: {
    sectionTitle: copy.projects.sectionTitle,
    ctaLabel: copy.projects.ctaLabel,
    ctaLink: homeShared.projectsCtaLink,
  },
  numbers: {
    sectionTitle: copy.numbers.sectionTitle,
    cards: copy.numbers.cards.map((card, index) => ({
      id: carried.numbers[index],
      value: homeShared.numberValues[index],
      ...card,
    })),
  },
  testimonials: {
    sectionTitle: copy.testimonials.sectionTitle,
    quotes: copy.testimonials.quotes.map((row, index) => ({
      ...row,
      id: carried.testimonials[index],
      quote: toLexical(row.quote),
    })),
  },
  interiorStyles: {
    sectionTitle: copy.interiorStyles.sectionTitle,
    ctaLabel: copy.interiorStyles.ctaLabel,
    ctaLink: homeShared.interiorStylesCtaLink,
  },
})
