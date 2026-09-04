import type { MediaImageT } from '@/components/media/types'
import type { ProjectT, SpecItemT } from '@/types/projects'

// Stand-in for the `projects` collection, carried over from tdg's `objectTemplateData.ts`
// with its four subpages flattened into one page; every value here is destined for Payload.
const image = (file: string, alt: string): MediaImageT => ({
  url: `/images/projects/${file}`,
  alt,
})

type ProjectSeedT = Omit<ProjectT, 'id' | 'image' | 'gallery' | 'scope' | 'materials'> & {
  scope: [string, string][]
  materials: [string, string][]
  /** Shared leading part of this project's photo filenames. */
  prefix: string
  /** Filename numbers, in the order the live gallery shows them. */
  photos: number[]
}

const seeds: ProjectSeedT[] = [
  {
    slug: 'patkow-lesnych-106g',
    title: 'Pątków Leśnych 106G',
    summary:
      'A full house renovation in Jastrzębie, taken on room by room so the owners could stay living in it throughout.',
    price: 'on request',
    area: '142 m²',
    duration: '11 weeks',
    address: 'Pątków Leśnych 106G, Jastrzębie',
    description:
      'The house had not been touched since it was built. We rewired it, replaced the heating, levelled and relaid every floor, and rebuilt the kitchen and both bathrooms. Because the family stayed in the house, the work was sequenced one floor at a time — services first, then ceilings and floors, then decoration — so there was always a finished half to live in.',
    scope: [
      ['Rewiring', 'Full house, new consumer unit'],
      ['Heating', 'New central heating installation'],
      ['Floors', 'Levelled and relaid throughout'],
      ['Kitchen', 'Rebuilt around a new layout'],
      ['Bathrooms', 'Two, stripped back to structure'],
      ['Decoration', 'All rooms, walls and ceilings'],
    ],
    materials: [
      ['Flooring', 'Oak panels, tiles in wet rooms'],
      ['Walls', 'Smoothed gypsum, matt emulsion'],
      ['Bathrooms', 'Large-format tile, concealed fittings'],
      ['Heating', 'Gas boiler, new radiators'],
    ],
    prefix: 'Jastrzebie-Patkow-lesnych-106G',
    photos: [1, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  {
    slug: 'zupnicza-19',
    title: 'Zupnicza 19 m.57',
    summary:
      'A two-room apartment in Praga-Południe taken from bare walls to move-in ready in just under three weeks.',
    price: 'on request',
    area: '48 m²',
    duration: '3 weeks',
    address: 'ul. Zupnicza 19, 03-821 Warszawa',
    description:
      'The agreed completion date was four weeks; the team finished in just under three, which gave the owners extra time to furnish the flat before their baby was due. Everything was itemised in the quote up front, and the schedule for the noisy work was agreed with the neighbours in advance.',
    scope: [
      ['Walls', 'Filled, smoothed and painted'],
      ['Floors', 'Levelled, vinyl panels laid'],
      ['Bathroom', 'Full rebuild, new layout'],
      ['Kitchen', 'Services moved, tiling'],
      ['Electrics', 'Sockets relocated, new lighting'],
      ['Doors', 'Replaced and adjusted'],
    ],
    materials: [
      ['Flooring', 'Vinyl panels'],
      ['Walls', 'Gypsum smoothing, matt emulsion'],
      ['Bathroom', 'Microcement walls and floor'],
      ['Fittings', 'Concealed faucets throughout'],
    ],
    prefix: 'Zupnicza-19-m57',
    photos: [1, 10, 11, 12, 13, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  {
    slug: 'lizbonska-5',
    title: 'Lizbońska 5',
    summary:
      'Kitchen and bathroom rebuilt around a new layout, with the services rerouted rather than just re-covered.',
    price: 'on request',
    area: '62 m²',
    duration: '5 weeks',
    address: 'ul. Lizbońska 5, 03-943 Warszawa',
    description:
      'The owners wanted the bathroom where the storage room had been. That meant new supply and waste runs across the flat and a re-graded waste fall, not a cosmetic refresh. We ran and pressure-tested the services, photographed every hidden run before covering it, and only then let the tiler start.',
    scope: [
      ['Plumbing', 'New supply and waste runs'],
      ['Bathroom', 'Relocated and rebuilt'],
      ['Kitchen', 'New layout, services moved'],
      ['Floors', 'Rebuilt over the new runs'],
      ['Tiling', 'Walls and floors, wet rooms'],
      ['Decoration', 'Whole apartment'],
    ],
    materials: [
      ['Flooring', 'Engineered wood, tile in wet rooms'],
      ['Walls', 'Smoothed and painted'],
      ['Bathroom', 'Large-format tile'],
      ['Kitchen', 'Tiled splashback, concealed services'],
    ],
    prefix: 'Lizbonska-5-m197',
    photos: [1, 10, 11, 12, 2, 3, 4, 5, 6, 7, 8, 9],
  },
]

const specList = (pairs: [string, string][]): SpecItemT[] =>
  pairs.map(([name, value], index) => ({ id: index + 1, name, value }))

export const projects: ProjectT[] = seeds.map((seed, index) => {
  const gallery = seed.photos.map((photo, photoIndex) =>
    image(`${seed.prefix}-${photo}.webp`, `${seed.title} — photo ${photoIndex + 1}`),
  )

  return {
    id: index + 1,
    slug: seed.slug,
    title: seed.title,
    summary: seed.summary,
    price: seed.price,
    area: seed.area,
    duration: seed.duration,
    address: seed.address,
    description: seed.description,
    scope: specList(seed.scope),
    materials: specList(seed.materials),
    image: gallery[0],
    gallery,
  }
})

export const projectsPlaceholder = {
  projects,
}

/** Every other project, so the page always closes on somewhere else to go. */
export const relatedProjects = (slug: string): ProjectT[] =>
  projects.filter((project) => project.slug !== slug)
