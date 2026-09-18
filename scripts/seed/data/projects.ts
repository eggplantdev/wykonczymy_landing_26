import type { SpecRowT } from '@/lib/content/specs'
import type { LocalizedT } from '../types'

export type ProjectCopyT = {
  title: string
  slug: string
  summary: string
  area: string
  duration: string
  address: string
  description: string
  scope: SpecRowT[]
  materials: SpecRowT[]
}

const spec = (rows: [string, string][]): SpecRowT[] =>
  rows.map(([name, value]) => ({ name, value }))

// Carried over from tdg's object template, with its four subpages flattened onto one
// address. Photos are added in the admin — the seed only writes copy.
export const projectSeeds: LocalizedT<ProjectCopyT>[] = [
  {
    pl: {
      title: 'Jastrzębie',
      slug: 'patkow-lesnych-106g',
      summary:
        'Kompletny remont domu w Jastrzębiu, prowadzony pomieszczenie po pomieszczeniu, żeby właściciele mogli w nim mieszkać przez cały czas trwania prac.',
      area: '142 m²',
      duration: '11 tygodni',
      address: 'Jastrzębie',
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
      title: 'Jastrzębie',
      slug: 'patkow-lesnych-106g',
      summary:
        'A full house renovation in Jastrzębie, taken on room by room so the owners could stay living in it throughout.',
      area: '142 m²',
      duration: '11 weeks',
      address: 'Jastrzębie',
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
      title: 'Warszawa, Praga-Południe',
      slug: 'lizbonska-5',
      summary:
        'Kuchnia i łazienka przebudowane wg nowego układu, z przełożonymi instalacjami zamiast zakrycia starych.',
      area: '62 m²',
      duration: '5 tygodni',
      address: 'Praga-Południe, Warszawa',
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
      title: 'Warszawa, Praga-Południe',
      slug: 'lizbonska-5',
      summary:
        'Kitchen and bathroom rebuilt around a new layout, with the services rerouted rather than just re-covered.',
      area: '62 m²',
      duration: '5 weeks',
      address: 'Praga-Południe, Warsaw',
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
  {
    pl: {
      title: 'Warszawa, Mokotów',
      slug: 'kiwi-8',
      summary:
        'Wykończenie mieszkania na Mokotowie: kuchnia na wymiar otwarta na część dzienną, dwie łazienki i jodełka na całej podłodze.',
      area: 'do uzupełnienia',
      duration: 'do uzupełnienia',
      address: 'Mokotów, Warszawa',
      description:
        'Część dzienna jest jedną przestrzenią, więc kuchnia musiała wyglądać jak meble, a nie jak aneks. Zabudowa w ciemnej okleinie idzie od podłogi do sufitu, sprzęt w całości siedzi w zabudowie, a jasny blat trzyma ją optycznie przy ziemi. Jodełka biegnie bez progów przez salon i przedpokój, dzięki czemu mieszkanie czyta się jako całość. W obu łazienkach płytki wielkoformatowe i czarna armatura, w większej wanna, w mniejszej umywalka nablatowa na szafce.',
      scope: spec([
        ['Kuchnia', 'Zabudowa na wymiar, sprzęt w zabudowie'],
        ['Łazienki', 'Dwie, wykończone od nowa'],
        ['Podłogi', 'Jodełka w części dziennej i przedpokoju'],
        ['Przedpokój', 'Zabudowa wnękowa'],
        ['Ściany', 'Gładzie i malowanie, całe mieszkanie'],
        ['Oświetlenie', 'Punktowe w suficie, osprzęt wymieniony'],
      ]),
      materials: spec([
        ['Podłogi', 'Deska w jodełkę, płytki w pomieszczeniach mokrych'],
        ['Kuchnia', 'Ciemna okleina drewnopodobna, jasny blat'],
        ['Łazienki', 'Płytki wielkoformatowe, armatura czarna'],
        ['Ściany', 'Gładzie gipsowe, farba matowa'],
      ]),
    },
    en: {
      title: 'Warszawa, Mokotów',
      slug: 'kiwi-8',
      summary:
        'An apartment fit-out in Mokotów: a bespoke kitchen open to the living area, two bathrooms, and herringbone throughout.',
      area: 'to be confirmed',
      duration: 'to be confirmed',
      address: 'Mokotów, Warsaw',
      description:
        'The living area is a single space, so the kitchen had to read as furniture rather than as a kitchenette. The dark-veneer units run floor to ceiling, every appliance is built in, and a pale worktop keeps the whole run visually grounded. The herringbone floor carries through the living room and hallway without thresholds, so the flat reads as one piece. Both bathrooms are finished in large-format tile with black fittings — a bath in the larger one, a counter-top basin on a cabinet in the smaller.',
      scope: spec([
        ['Kitchen', 'Bespoke units, integrated appliances'],
        ['Bathrooms', 'Two, finished from scratch'],
        ['Floors', 'Herringbone in the living area and hallway'],
        ['Hallway', 'Fitted alcove storage'],
        ['Walls', 'Smoothed and painted throughout'],
        ['Lighting', 'Recessed downlights, fittings replaced'],
      ]),
      materials: spec([
        ['Flooring', 'Herringbone board, tile in wet rooms'],
        ['Kitchen', 'Dark wood-effect veneer, pale worktop'],
        ['Bathrooms', 'Large-format tile, black fittings'],
        ['Walls', 'Gypsum skim, matt paint'],
      ]),
    },
  },
  {
    pl: {
      title: 'Warszawa, Mokotów',
      slug: 'woloska',
      summary:
        'Mieszkanie wykończone pod klucz, z łazienką na płytkach kamiennych i światłem poprowadzonym we wnękach sufitowych.',
      area: 'do uzupełnienia',
      duration: 'do uzupełnienia',
      address: 'Mokotów, Warszawa',
      description:
        'Całe mieszkanie trzyma jedna paleta: jasne drewno na zabudowie i kamienny rysunek na płytkach. W łazience owalne podświetlone lustro wisi nad blatem z litego drewna, a prysznic bez brodzika wchodzi w ścianę wyłożoną drobną mozaiką, która jako jedyna łamie spokojny ton. Oświetlenie prowadzi liniami we wnękach sufitowych zamiast punktami, więc sufit zostaje gładki. Kuchnia jest w zabudowie do sufitu, z płytą i okapem wpuszczonymi w ciąg roboczy.',
      scope: spec([
        ['Łazienki', 'Płytki wielkoformatowe, prysznic bez brodzika'],
        ['Kuchnia', 'Zabudowa do sufitu, sprzęt wpuszczony'],
        ['Oświetlenie', 'Linie LED we wnękach sufitowych'],
        ['Sufity', 'Podwieszane z wnękami pod oświetlenie'],
        ['Podłogi', 'Płytki i panele, całe mieszkanie'],
        ['Ściany', 'Gładzie i malowanie'],
      ]),
      materials: spec([
        ['Łazienki', 'Płytki o rysunku kamienia, mozaika w strefie prysznica'],
        ['Kuchnia', 'Jasna okleina drewnopodobna, blat kamienny'],
        ['Armatura', 'Baterie podtynkowe, czarne wykończenie'],
        ['Oświetlenie', 'Taśmy LED, lustra podświetlane'],
      ]),
    },
    en: {
      title: 'Warszawa, Mokotów',
      slug: 'woloska',
      summary:
        'A turnkey apartment fit-out, with stone-look bathrooms and the lighting run through recesses in the ceiling.',
      area: 'to be confirmed',
      duration: 'to be confirmed',
      address: 'Mokotów, Warsaw',
      description:
        'One palette carries the whole flat: pale wood on the joinery and a stone figure in the tile. In the bathroom an oval backlit mirror hangs over a solid timber counter, and the level-access shower runs into a wall of fine mosaic — the only thing that breaks the quiet tone. The lighting runs as lines inside ceiling recesses rather than as spots, so the ceiling stays flat. The kitchen is built to the ceiling, with hob and extractor sunk into the run.',
      scope: spec([
        ['Bathrooms', 'Large-format tile, level-access shower'],
        ['Kitchen', 'Floor-to-ceiling units, integrated appliances'],
        ['Lighting', 'LED lines in ceiling recesses'],
        ['Ceilings', 'Suspended, recessed for the lighting'],
        ['Floors', 'Tile and board throughout'],
        ['Walls', 'Smoothed and painted'],
      ]),
      materials: spec([
        ['Bathrooms', 'Stone-figured tile, mosaic in the shower'],
        ['Kitchen', 'Pale wood-effect veneer, stone worktop'],
        ['Fittings', 'Concealed faucets, black finish'],
        ['Lighting', 'LED tape, backlit mirrors'],
      ]),
    },
  },
  {
    pl: {
      title: 'Warszawa, Ursynów',
      slug: 'koprowskiego-6e',
      summary:
        'Mieszkanie na poddaszu, gdzie łazienka i sypialnie musiały ułożyć się pod skosami, a nie obok nich.',
      area: 'do uzupełnienia',
      duration: 'do uzupełnienia',
      address: 'Ursynów, Warszawa',
      description:
        'Skos nad łazienką decydował o wszystkim: umywalka i lustro poszły pod najwyższą ścianę, prysznic bez brodzika w najniższą, a odpływ liniowy pozwolił uciec z klasycznym spadkiem. Blat z ciemnego drewna jest jedynym ciepłym elementem w pomieszczeniu wyłożonym płytą o rysunku betonu. W części dziennej i sypialniach podłoga w jodełkę, duże przeszklenia na zieleń i klimatyzacja wpuszczona nad drzwiami.',
      scope: spec([
        ['Łazienka', 'Zbudowana pod skosem, odpływ liniowy'],
        ['Podłogi', 'Jodełka w pokojach'],
        ['Sufity', 'Zabudowa skosów, oświetlenie punktowe'],
        ['Klimatyzacja', 'Jednostki wewnętrzne i instalacja'],
        ['Ściany', 'Gładzie i malowanie'],
        ['Stolarka', 'Drzwi wewnętrzne wymienione'],
      ]),
      materials: spec([
        ['Łazienka', 'Płytki wielkoformatowe o rysunku betonu'],
        ['Umywalka', 'Blat z ciemnego drewna, umywalka nablatowa'],
        ['Podłogi', 'Deska w jodełkę'],
        ['Armatura', 'Baterie podtynkowe, stelaż podtynkowy'],
      ]),
    },
    en: {
      title: 'Warszawa, Ursynów',
      slug: 'koprowskiego-6e',
      summary:
        'A loft apartment where the bathroom and bedrooms had to be laid out under the slopes rather than around them.',
      area: 'to be confirmed',
      duration: 'to be confirmed',
      address: 'Ursynów, Warsaw',
      description:
        'The slope over the bathroom decided everything: the basin and mirror went under the tallest wall, the level-access shower under the lowest, and a linear drain let us avoid a conventional fall. A dark timber counter is the only warm element in a room lined with concrete-figured tile. In the living area and the bedrooms the floor is herringbone, the glazing is full height onto greenery, and the air conditioning is set in above the doors.',
      scope: spec([
        ['Bathroom', 'Built under the slope, linear drain'],
        ['Floors', 'Herringbone in the rooms'],
        ['Ceilings', 'Slopes boarded out, recessed downlights'],
        ['Air conditioning', 'Indoor units and pipework'],
        ['Walls', 'Smoothed and painted'],
        ['Joinery', 'Internal doors replaced'],
      ]),
      materials: spec([
        ['Bathroom', 'Large-format concrete-figured tile'],
        ['Vanity', 'Dark timber counter, counter-top basin'],
        ['Flooring', 'Herringbone board'],
        ['Fittings', 'Concealed faucets, concealed cistern'],
      ]),
    },
  },
  {
    pl: {
      title: 'Warszawa, Wilanów',
      slug: 'holzera-4',
      summary:
        'Wnętrze zbudowane światłem: zamiast lamp sufitowych linie LED we wnękach, kinkiety i podświetlone lustro.',
      area: 'do uzupełnienia',
      duration: 'do uzupełnienia',
      address: 'Wilanów, Warszawa',
      description:
        'Sufit jest tu elementem konstrukcyjnym, nie tłem. Podwieszane wnęki prowadzą ciepłe światło po obwodzie pokoi, kinkiety wieszają punkty na ścianie, a jedyne lampy w polu widzenia to płaskie plafony. Do tego ciemna stolarka i grzejnik w kolorze drzwi zamiast białego, zasłony na całą wysokość ściany i jasna jodełka na podłodze. W łazience ta sama zasada: podświetlony panel lustra zamiast lampy nad umywalką.',
      scope: spec([
        ['Oświetlenie', 'Linie LED we wnękach, kinkiety, plafony'],
        ['Sufity', 'Podwieszane z wnękami świetlnymi'],
        ['Podłogi', 'Jodełka w części dziennej i sypialniach'],
        ['Łazienka', 'Podświetlone lustro, zabudowa umywalki'],
        ['Stolarka', 'Ciemne drzwi, zabudowa wnęk'],
        ['Ściany', 'Gładzie i malowanie'],
      ]),
      materials: spec([
        ['Oświetlenie', 'Taśmy LED o ciepłej barwie, panel lustra'],
        ['Podłogi', 'Deska w jodełkę'],
        ['Stolarka', 'Ciemny fornir, grzejnik w kolorze drzwi'],
        ['Ściany', 'Gładzie gipsowe, farba matowa'],
      ]),
    },
    en: {
      title: 'Warszawa, Wilanów',
      slug: 'holzera-4',
      summary:
        'An interior built out of light: LED lines in ceiling recesses, wall sconces and a backlit mirror instead of ceiling fittings.',
      area: 'to be confirmed',
      duration: 'to be confirmed',
      address: 'Wilanów, Warsaw',
      description:
        'Here the ceiling is a structural element, not a backdrop. Suspended recesses carry warm light around the perimeter of each room, sconces hang the accents on the wall, and the only fittings in view are flat discs. With it: dark joinery and a radiator in the colour of the doors rather than white, full-height curtains, and a pale herringbone floor. The bathroom follows the same rule — a backlit mirror panel instead of a light over the basin.',
      scope: spec([
        ['Lighting', 'LED lines in recesses, sconces, flush fittings'],
        ['Ceilings', 'Suspended, with lighting recesses'],
        ['Floors', 'Herringbone in the living area and bedrooms'],
        ['Bathroom', 'Backlit mirror, fitted vanity'],
        ['Joinery', 'Dark doors, fitted alcoves'],
        ['Walls', 'Smoothed and painted'],
      ]),
      materials: spec([
        ['Lighting', 'Warm-white LED tape, mirror panel'],
        ['Flooring', 'Herringbone board'],
        ['Joinery', 'Dark veneer, radiator matched to the doors'],
        ['Walls', 'Gypsum skim, matt paint'],
      ]),
    },
  },
]
