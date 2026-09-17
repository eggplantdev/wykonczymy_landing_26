import type { Page } from '@/payload-types'
import { homeShared, type HomeCopyT } from './data/home'
import { toLexical } from './lexical'

/**
 * Payload matches array rows by id: a row written without one is a new row, so the old row
 * is deleted along with every field the seed does not supply — the photos an editor attached
 * to a services card. Both passes therefore carry the ids already in the database, the Polish
 * one included; otherwise re-seeding rebuilds the rows from scratch on every run.
 */
export type RowIdsT = {
  services: (string | undefined)[]
  numbers: (string | undefined)[]
  testimonials: (string | undefined)[]
}

export const rowIdsOf = (doc: Page | undefined): RowIdsT => ({
  services: (doc?.home?.services?.cards ?? []).map((card) => card.id ?? undefined),
  numbers: (doc?.home?.numbers?.cards ?? []).map((card) => card.id ?? undefined),
  testimonials: (doc?.home?.testimonials?.quotes ?? []).map((row) => row.id ?? undefined),
})

export const homeGroup = (copy: HomeCopyT, rowIds: RowIdsT) => ({
  hero: {
    title: copy.hero.title,
    ctaLabel: copy.hero.ctaLabel,
    ctaLink: homeShared.heroCtaLink,
  },
  intro: { text: copy.intro, position: homeShared.introPosition },
  services: {
    sectionTitle: copy.services.sectionTitle,
    cards: copy.services.cards.map((card, index) => ({ id: rowIds.services[index], ...card })),
  },
  projects: {
    sectionTitle: copy.projects.sectionTitle,
    ctaLabel: copy.projects.ctaLabel,
    ctaLink: homeShared.projectsCtaLink,
  },
  numbers: {
    sectionTitle: copy.numbers.sectionTitle,
    cards: copy.numbers.cards.map((card, index) => ({
      id: rowIds.numbers[index],
      value: homeShared.numberValues[index],
      ...card,
    })),
  },
  testimonials: {
    sectionTitle: copy.testimonials.sectionTitle,
    quotes: copy.testimonials.quotes.map((row, index) => ({
      ...row,
      id: rowIds.testimonials[index],
      quote: toLexical(row.quote),
    })),
  },
  interiorStyles: {
    sectionTitle: copy.interiorStyles.sectionTitle,
    ctaLabel: copy.interiorStyles.ctaLabel,
    ctaLink: homeShared.interiorStylesCtaLink,
  },
})
