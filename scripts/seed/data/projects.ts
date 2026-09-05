import type { LocalizedT, SpecRowT } from '../types'

export type ProjectCopyT = {
  title: string
  slug: string
  summary: string
  price: string
  area: string
  duration: string
  address: string
  description: string
  scope: SpecRowT[]
  materials: SpecRowT[]
}

const spec = (rows: [string, string][]): SpecRowT[] =>
  rows.map(([name, value]) => ({ name, value }))

// Three completed jobs, carried over from tdg's object template with its four subpages
// flattened onto one address. Photos are added in the admin — the seed only writes copy.
export const projectSeeds: LocalizedT<ProjectCopyT>[] = [
  {
    pl: {
      title: 'Pątków Leśnych 106G',
      slug: 'patkow-lesnych-106g',
      summary:
        'Kompletny remont domu w Jastrzębiu, prowadzony pomieszczenie po pomieszczeniu, żeby właściciele mogli w nim mieszkać przez cały czas trwania prac.',
      price: 'wycena indywidualna',
      area: '142 m²',
      duration: '11 tygodni',
      address: 'Pątków Leśnych 106G, Jastrzębie',
      description:
        'Dom nie był remontowany od czasu budowy. Wymieniliśmy instalację elektryczną i ogrzewanie, wyrównaliśmy i położyliśmy od nowa wszystkie podłogi, przebudowaliśmy kuchnię i obie łazienki. Ponieważ rodzina mieszkała w domu przez cały remont, prace szły kondygnacjami — najpierw instalacje, potem sufity i podłogi, na końcu wykończenie — więc zawsze była gotowa połowa do mieszkania.',
      scope: spec([
        ['Elektryka', 'Cały dom, nowa rozdzielnica'],
        ['Ogrzewanie', 'Nowa instalacja centralnego ogrzewania'],
        ['Podłogi', 'Wyrównane i ułożone od nowa'],
        ['Kuchnia', 'Przebudowana wg nowego układu'],
        ['Łazienki', 'Dwie, rozebrane do stanu surowego'],
        ['Wykończenie', 'Wszystkie pomieszczenia, ściany i sufity'],
      ]),
      materials: spec([
        ['Podłogi', 'Deska dębowa, płytki w pomieszczeniach mokrych'],
        ['Ściany', 'Gładzie gipsowe, farba matowa'],
        ['Łazienki', 'Płytki wielkoformatowe, armatura podtynkowa'],
        ['Ogrzewanie', 'Kocioł gazowy, nowe grzejniki'],
      ]),
    },
    en: {
      title: 'Pątków Leśnych 106G',
      slug: 'patkow-lesnych-106g',
      summary:
        'A full house renovation in Jastrzębie, taken on room by room so the owners could stay living in it throughout.',
      price: 'on request',
      area: '142 m²',
      duration: '11 weeks',
      address: 'Pątków Leśnych 106G, Jastrzębie',
      description:
        'The house had not been touched since it was built. We rewired it, replaced the heating, levelled and relaid every floor, and rebuilt the kitchen and both bathrooms. Because the family stayed in the house, the work was sequenced one floor at a time — services first, then ceilings and floors, then decoration — so there was always a finished half to live in.',
      scope: spec([
        ['Rewiring', 'Full house, new consumer unit'],
        ['Heating', 'New central heating installation'],
        ['Floors', 'Levelled and relaid throughout'],
        ['Kitchen', 'Rebuilt around a new layout'],
        ['Bathrooms', 'Two, stripped back to structure'],
        ['Decoration', 'All rooms, walls and ceilings'],
      ]),
      materials: spec([
        ['Flooring', 'Oak panels, tiles in wet rooms'],
        ['Walls', 'Smoothed gypsum, matt emulsion'],
        ['Bathrooms', 'Large-format tile, concealed fittings'],
        ['Heating', 'Gas boiler, new radiators'],
      ]),
    },
  },
  {
    pl: {
      title: 'Zupnicza 19 m.57',
      slug: 'zupnicza-19',
      summary:
        'Dwupokojowe mieszkanie na Pradze-Południe doprowadzone od surowych ścian do stanu pod klucz w niecałe trzy tygodnie.',
      price: 'wycena indywidualna',
      area: '48 m²',
      duration: '3 tygodnie',
      address: 'ul. Zupnicza 19, 03-821 Warszawa',
      description:
        'Umówiony termin zakończenia to były cztery tygodnie; ekipa skończyła w niecałe trzy, dzięki czemu właściciele mieli zapas czasu na umeblowanie mieszkania przed narodzinami dziecka. Wszystko było wycenione pozycja po pozycji przed startem, a harmonogram głośnych prac ustaliliśmy wcześniej z sąsiadami.',
      scope: spec([
        ['Ściany', 'Szpachlowane, gładzone i malowane'],
        ['Podłogi', 'Wylewka wyrównująca, panele winylowe'],
        ['Łazienka', 'Pełna przebudowa, nowy układ'],
        ['Kuchnia', 'Przeniesione instalacje, glazura'],
        ['Elektryka', 'Przeniesione gniazdka, nowe oświetlenie'],
        ['Drzwi', 'Wymienione i wyregulowane'],
      ]),
      materials: spec([
        ['Podłogi', 'Panele winylowe'],
        ['Ściany', 'Gładzie gipsowe, farba matowa'],
        ['Łazienka', 'Mikrocement na ścianach i podłodze'],
        ['Armatura', 'Baterie podtynkowe'],
      ]),
    },
    en: {
      title: 'Zupnicza 19 m.57',
      slug: 'zupnicza-19',
      summary:
        'A two-room apartment in Praga-Południe taken from bare walls to move-in ready in just under three weeks.',
      price: 'on request',
      area: '48 m²',
      duration: '3 weeks',
      address: 'ul. Zupnicza 19, 03-821 Warszawa',
      description:
        'The agreed completion date was four weeks; the team finished in just under three, which gave the owners extra time to furnish the flat before their baby was due. Everything was itemised in the quote up front, and the schedule for the noisy work was agreed with the neighbours in advance.',
      scope: spec([
        ['Walls', 'Filled, smoothed and painted'],
        ['Floors', 'Levelled, vinyl panels laid'],
        ['Bathroom', 'Full rebuild, new layout'],
        ['Kitchen', 'Services moved, tiling'],
        ['Electrics', 'Sockets relocated, new lighting'],
        ['Doors', 'Replaced and adjusted'],
      ]),
      materials: spec([
        ['Flooring', 'Vinyl panels'],
        ['Walls', 'Gypsum smoothing, matt emulsion'],
        ['Bathroom', 'Microcement walls and floor'],
        ['Fittings', 'Concealed faucets throughout'],
      ]),
    },
  },
  {
    pl: {
      title: 'Lizbońska 5',
      slug: 'lizbonska-5',
      summary:
        'Kuchnia i łazienka przebudowane wg nowego układu, z przełożonymi instalacjami zamiast zakrycia starych.',
      price: 'wycena indywidualna',
      area: '62 m²',
      duration: '5 tygodni',
      address: 'ul. Lizbońska 5, 03-943 Warszawa',
      description:
        'Właściciele chcieli mieć łazienkę tam, gdzie była komórka lokatorska. To oznaczało nowe rozprowadzenie wody i kanalizacji przez całe mieszkanie oraz nowy spadek odpływu, a nie kosmetykę. Rozprowadziliśmy i sprawdziliśmy instalacje pod ciśnieniem, sfotografowaliśmy każde ukryte przejście przed zakryciem i dopiero wtedy wpuściliśmy glazurnika.',
      scope: spec([
        ['Hydraulika', 'Nowe rozprowadzenie wody i kanalizacji'],
        ['Łazienka', 'Przeniesiona i zbudowana od nowa'],
        ['Kuchnia', 'Nowy układ, przeniesione instalacje'],
        ['Podłogi', 'Odtworzone nad nowymi przejściami'],
        ['Glazura', 'Ściany i podłogi w pomieszczeniach mokrych'],
        ['Wykończenie', 'Całe mieszkanie'],
      ]),
      materials: spec([
        ['Podłogi', 'Deska warstwowa, płytki w pomieszczeniach mokrych'],
        ['Ściany', 'Gładzie i malowanie'],
        ['Łazienka', 'Płytki wielkoformatowe'],
        ['Kuchnia', 'Płytki nad blatem, instalacje w zabudowie'],
      ]),
    },
    en: {
      title: 'Lizbońska 5',
      slug: 'lizbonska-5',
      summary:
        'Kitchen and bathroom rebuilt around a new layout, with the services rerouted rather than just re-covered.',
      price: 'on request',
      area: '62 m²',
      duration: '5 weeks',
      address: 'ul. Lizbońska 5, 03-943 Warszawa',
      description:
        'The owners wanted the bathroom where the storage room had been. That meant new supply and waste runs across the flat and a re-graded waste fall, not a cosmetic refresh. We ran and pressure-tested the services, photographed every hidden run before covering it, and only then let the tiler start.',
      scope: spec([
        ['Plumbing', 'New supply and waste runs'],
        ['Bathroom', 'Relocated and rebuilt'],
        ['Kitchen', 'New layout, services moved'],
        ['Floors', 'Rebuilt over the new runs'],
        ['Tiling', 'Walls and floors, wet rooms'],
        ['Decoration', 'Whole apartment'],
      ]),
      materials: spec([
        ['Flooring', 'Engineered wood, tile in wet rooms'],
        ['Walls', 'Smoothed and painted'],
        ['Bathroom', 'Large-format tile'],
        ['Kitchen', 'Tiled splashback, concealed services'],
      ]),
    },
  },
]

/** The project the home page leads with, matched on its Polish slug. */
export const featuredProjectSlug = 'zupnicza-19'
