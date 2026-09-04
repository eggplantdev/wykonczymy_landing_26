import type { InteriorStyleT } from '@/types/interior-styles'
import type { MediaImageT } from '@/components/media/types'

// Stand-in for the `interior-styles` collection. Copy and photos are the live site's own
// (`/wykonczenia/`, fetched 2026-09-04), translated to match the rest of the placeholder
// set; every value here is destined for Payload.
const image = (file: string, alt: string): MediaImageT => ({
  url: `/images/styles/${file}`,
  alt,
})

// The photo filenames are Polish room names, so the alt text comes from the filename
// rather than being written out twelve times over.
const ROOMS: Record<string, string> = {
  gabinet: 'study',
  biuro: 'office',
  hall: 'hall',
  kuchnia: 'kitchen',
  lazienka: 'bathroom',
  salon: 'living room',
  sypialnia: 'bedroom',
  spialnia: 'bedroom',
}

type StyleSeedT = {
  slug: string
  title: string
  text: string
  body: string[]
  /** Shared leading part of this style's six filenames. */
  prefix: string
  /** Filename remainders, in the order the live gallery shows them. */
  photos: string[]
}

const seeds: StyleSeedT[] = [
  {
    slug: 'boho',
    title: 'Boho',
    text: 'Boho style in interior design expresses freedom, creativity, and a love of living by your own rules.',
    body: [
      'Boho style in interior design expresses freedom, creativity, and a love of living by your own rules. Rooted in nineteenth-century Parisian bohemia, it brings ease, individuality and a certain unconventionality into the home, creating spaces full of colour, history and personal touches.',
      'Boho pairs colour with natural materials — wood, rattan, woven textiles, linen, cotton and wool bring warmth and a connection to nature. The furniture often has a past of its own: a restored cabinet, table or chair gives a room its authenticity. The style allows for considered eclecticism, where patchwork throws, ethnic patterns, knits and fringing add up to one story about the people who live there.',
      'Atmosphere matters as much as objects. Generous sofas and armchairs, soft cushions, blankets and low, warm lighting make the space easy to relax in, and plants bring it to life while underlining the organic character of the interior.',
      'Every room takes to it. A bedroom becomes a calm retreat in gentle colours and soft fabrics, a living room mixes forms and textures, and the kitchen and dining area invite people to linger at the table. A terrace or balcony extends the same idea outdoors, among plants and comfortable furniture.',
      'Above all it lets the interior tell the story of the people in it — their travels, memories and plans. Culture, nature, colour and history meet in a home full of energy and artistic expression, where you can simply be yourself.',
    ],
    prefix: 'boho',
    photos: ['gabinet-1', 'hall1-2', 'kuchnia-1', 'lazienka-2', 'salon-2', 'sypialnia-2-scaled'],
  },
  {
    slug: 'glamour',
    title: 'Glamour',
    text: 'Glamour style is a blend of elegance, luxury, and spectacular shine, inspired by Hollywood’s golden era.',
    body: [
      'Glamour style is a blend of elegance, luxury and spectacular shine, inspired by the golden era of Hollywood. It works through contrast: deep, saturated colours such as black, burgundy or violet set against whites, beiges and pastels, with gold, silver and mirrored surfaces underlining the refinement of the room.',
      'The furniture is meant to be seen. Quilted sofas and armchairs in velvet upholstery, marble side tables, chests and consoles with mirrored or gilded detailing establish the luxury. Classic forms are combined with modern restraint, which keeps the contrast attractive rather than heavy. Crystal chandeliers, mirrors in decorative frames, elegant vases and velvet cushions complete it.',
      'In the living room a broad sofa is usually the centre, with a statement table and decorative lighting around it. The bedroom turns on a luxurious bed, velvet cushions and subtle throws. The kitchen balances plain light fronts with polished detail, and the bathroom becomes a private spa through marble, a freestanding bath and generous mirrors.',
      'Glamour combines refinement with comfort and luxury with liveability. It suits anyone who wants a home to be somewhere to rest and, at the same time, a stage for a little everyday Hollywood splendour.',
    ],
    prefix: 'glamour',
    photos: ['gabinet-2', 'hall-2', 'kuchnia-1', 'lazienka-2', 'salon-2', 'sypialnia-2'],
  },
  {
    slug: 'hampton',
    title: 'Hampton',
    text: 'Hampton style is the essence of coastal luxury, where elegance meets comfort and a carefree mood.',
    body: [
      'Hampton style is the essence of coastal luxury, where elegance meets comfort and a carefree mood. It comes from the exclusive resorts of Long Island, where houses were arranged around a maritime climate. The interiors are calm, bright and spacious, with a holiday feeling to them.',
      'White dominates the palette, harmonised with blues, beiges and natural wood. The blues arrive in fabrics, accessories and porcelain, keeping everything light and fresh. Furniture is comfortable and practical — large sofas and armchairs in linen or cotton, layered with cushions and throws in muted shades. Wooden and wicker elements and the occasional antique add classic elegance without turning the room into a museum.',
      'Maritime touches — shells, lanterns, striped blankets — carry the holiday character. The living room is built around seating groups, bedrooms stay pale with comfortable beds and linen bedding, and bathrooms keep classic forms with herringbone tiling. Terraces and balconies extend the interior through light furniture, cushions and greenery.',
      'The contemporary reading of Hampton adds gentle art deco accents and warmer colours — lavender, mustard yellow, chocolate brown — while keeping the lightness intact. The result joins timeless polish with comfort: a space for relaxation, luxury and natural ease.',
    ],
    prefix: 'hampton',
    photos: ['gabinet', 'hall-1', 'kuchnia-1', 'lazienka-1', 'salon-1', 'sypialnia-1'],
  },
  {
    slug: 'industrial',
    title: 'Industrial (loft)',
    text: 'Industrial style, also called loft style, emerged from converting former factory spaces in cities like New York or Berlin.',
    body: [
      'Industrial style, also called loft style, emerged from converting former factory spaces in cities such as New York and Berlin. Its character rests on rawness and function together — exposed brick, concrete floors, high ceilings and metal elements make a minimal but atmospheric space. A loft is not a cold place: the right furniture and accessories give it warmth and personality.',
      'The basis is simple, substantial furniture in wood, metal and leather, set against the raw surfaces. Muted colours lead — greys, black, browns and white — with stronger accents for movement. Open plans, large windows and high ceilings let light and air move through.',
      'In the living room, broad sofas and steel-legged tables anchor the functional zones around them. Industrial decoration — lamps, shelving, prints, neon — sets the tone, while rugs, cushions, plants and designer pieces keep the raw materials companionable.',
      'Loft kitchens are open, often with an island and industrial lighting. Tall rooms allow mezzanines for a bedroom, office or library without disturbing the character below. Plants bring freshness, and a lighter palette with a few exposed industrial elements carries the idea into smaller spaces as well.',
    ],
    prefix: 'industrialny',
    photos: ['gabinet-1', 'hall-1', 'kuchnia-1', 'lazienka-1', 'salon-1', 'sypialnia-1'],
  },
  {
    slug: 'japandi',
    title: 'Japandi',
    text: 'Japandi style is a harmonious combination of Japanese simplicity and Nordic coziness, creating interiors that are calm, balanced, and full of natural beauty.',
    body: [
      'Japandi is a harmonious combination of Japanese simplicity and Nordic cosiness, producing interiors that are calm, balanced and full of natural beauty. At its core is a minimalism built on function but without any coldness — the warmth of wood, soft textiles and subtle detail create an everyday sense of calm.',
      'The palette is neutral and muted: beiges, sand tones, off-white, warm grey, smoked black. Those shades are a quiet background for natural materials — pale and dark wood, bamboo, ceramics, stone and linen. Forms are simple, low and visually light, and every object has a role, which keeps the room free of accidental decoration.',
      'Furniture has soft, organic lines and is made from natural materials: wooden tables and benches, low beds, light shelving, textiles with a pronounced natural texture. Instead of loud ornament there are single deliberate accents — minimal ceramics, a handmade vase, a branch, a restrained print.',
      'Light does a great deal of the work. Rice-paper lamps, linen shades and soft lighting build the atmosphere of a quiet home. Plants appear sparingly, more often as one striking specimen than a collection, echoing the Japanese art of arranging nature.',
      'Japandi works in generous modern interiors and in small flats alike, because its premise is function, moderation and balance. It suits anyone who wants a space that is minimal but warm, ordered but not sterile, elegant without excess.',
    ],
    prefix: 'japandi',
    photos: ['gabinet', 'hall-1', 'kuchnia-1', 'lazienka-1', 'salon-1', 'spialnia-1'],
  },
  {
    slug: 'classic',
    title: 'Classic',
    text: 'Classic style is synonymous with timeless elegance, harmony, and fine craftsmanship.',
    body: [
      'Classic style is synonymous with timeless elegance, harmony and fine craftsmanship. Its sources are European palaces and residences, which shows in the care given to proportion, symmetry and quality of execution. Light muted colours lead — creams, beiges, off-whites and warm greys — broken by deep accents of navy, burgundy or bottle green.',
      'The furniture is substantial, solid and richly finished. Wooden chests, display cabinets, consoles and side tables carry mouldings, carving and decorative handles, while upholstered sofas and armchairs keep soft, rounded forms. Velvet, jacquard and good linen add dignity, as do marble, natural wood, crystal and porcelain.',
      'Architectural detail is the giveaway: stucco on walls and ceilings, skirting, elegant mirror frames and classic panelling. Floors are usually wooden parquet, often herringbone, which underlines the warmth and traditional character of the rooms.',
      'Decoration is chosen sparingly but with great attention to quality. Paintings in gilded frames, porcelain vases, crystal candlesticks, antiques, tall curtains in heavy fabric and lamps with shades complete a composition that does not need ostentation to impress.',
      'It suits a spacious living room with a fireplace, a formal dining room around a substantial table, a bedroom with an upholstered bed, a study lined with books — interiors that never go out of fashion and grow more distinguished with age.',
    ],
    prefix: 'klasyczny',
    photos: ['gabinet-1', 'hall-1', 'kuchnia-1', 'lazienka-1', 'salon-1', 'sypialnia'],
  },
  {
    slug: 'minimalist',
    title: 'Minimalist',
    text: 'Minimalist style is the essence of simplicity, harmony, and functionality.',
    body: [
      'Minimalist style is the essence of simplicity, harmony and function. Inspired by zen philosophy and Japanese aesthetics, it reduces excess and keeps only what is needed and does a job. The result is ordered, spacious and calm, and every detail carries weight because there is nothing competing with it.',
      'Simple geometric furniture without superfluous ornament takes the central place, made from good materials — wood, stone, linen, cotton, leather. The palette is muted: white, greys and beiges, occasionally lifted by a subtle accent that gives the room elegance and character. Minimalism allows accessories, but only carefully selected ones, so the balance holds.',
      'Light plays a decisive role, both daylight and simple, well-chosen lamps that draw out the depth of the space. In the living room a sofa and table anchor the functional zones while the space around them stays open. The kitchen and bedroom follow the same rule of simplicity and comfort: worktops stay clear, and furniture and accessories keep a spare, timeless form.',
    ],
    prefix: 'minimalistyczny',
    photos: ['biuro', 'kuchnia', 'lazienka', 'salon', 'sypialnia', 'sypialnia1'],
  },
  {
    slug: 'modern-classic',
    title: 'Modern Classic',
    text: 'Modern Classic is an elegant blend of classic and contemporary elements, creating interiors that are luxurious, cozy, and functional.',
    body: [
      'Modern classic is an elegant blend of classic and contemporary elements, producing interiors that are luxurious, comfortable and practical. It builds on a light muted palette — whites, beiges, greys — completed by refined accents of navy, burgundy or bottle green, which give the space calm and a timeless character.',
      'These interiors celebrate good materials: velvet, velour, bouclé, marble, wood and metal. The furniture refers to classic forms reinterpreted in a modern spirit — rounded contours, subtle detailing, elegant proportions and comfortable seating make the space both stylish and easy to live in. Sofas, armchairs, sideboards and consoles combine function with luxury, while designer lamps, chandeliers and accessories add freshness.',
      'Decorative detail sets the character: stucco, herringbone parquet, mirrors in richly decorated frames, curtains in heavy soft fabric, porcelain and crystal behind glass. Modern conveniences enter quietly — concealed electronics, practical storage, a designer accent — without disturbing the lightness of the room.',
      'The style works everywhere: a comfortable sofa and elegant table in the living room, a luxurious bed with a quilted headboard in the bedroom, classic cabinetry with modern appliances in the kitchen. Tradition and contemporary aesthetics sit together, giving interiors that are elegant, warm and quietly bright.',
    ],
    prefix: 'modern-classic',
    photos: ['gabinet', 'hall', 'kuchnia', 'lazienka', 'salon', 'sypialnia'],
  },
  {
    slug: 'mid-century-modern',
    title: 'Mid Century Modern',
    text: 'Mid-Century Modern style is elegance and functionality rooted in the mid-20th century, especially the 1950s.',
    body: [
      'Mid-century modern is elegance and function rooted in the middle of the twentieth century, particularly the 1950s. The interiors are light and open, with simple forms that join practicality to a timeless design language. Large windows let daylight in, and easy transitions between rooms reinforce the sense of space.',
      'The furniture is characteristic: simple geometric shapes in wood, leather and metal. Designer forms, from rounded sofas to inventive chairs, give a room lightness and personality. Colours stay muted, with subtle accents — warm wood, green, mustard yellow or orange — that recall the post-war era.',
      'Materials such as wood, stone, leather and metal make a space that is comfortable and modern at once. Every piece is functional, and decoration is limited to carefully chosen details that reinforce the character of the room.',
      'It suits living rooms, bedrooms and studies alike, where designer furniture, a harmonious palette and natural materials produce something elegant, warm and workable — a timeless alternative to austere minimalism or industrial schemes that keeps the spirit of the fifties and sixties alongside a fresh contemporary aesthetic.',
    ],
    prefix: 'mcm',
    photos: ['gabinet', 'hall-1', 'kuchnia', 'lazienka-1', 'salon-1', 'sypialnia-1'],
  },
  {
    slug: 'modern-retro',
    title: 'Modern Retro',
    text: 'Modern retro is a balanced combination of modern functionality and the bold aesthetics of past decades — mainly the 1950s, 60s, and 70s.',
    body: [
      'Modern retro is a balanced combination of contemporary function and the bold aesthetics of past decades, chiefly the 1950s, 60s and 70s. It draws on recognisable retro forms — rounded sofas, slim armchairs on turned legs, low sideboards, designer lamps — and sets them against the plainness of modern arrangement. The space stays fresh and practical while gaining a distinct, nostalgic atmosphere.',
      'The palette pairs a muted base of white, beige and grey with stronger, energetic accents. Mustard yellow, bottle green, turquoise, terracotta or powder pink appear on upholstery, cushions or decorative details, giving the room movement and a cheerful character. Geometric and period-inspired patterns — stripes, diamonds, stylised botanicals — are used sparingly, so they read as an accent rather than a theme.',
      'Materials combine the natural with a note of elegance: warm-toned wood, velour, velvet, leather, and gold or brass finishes. Furniture keeps a light form with telling details — rounded shapes, thin legs, profiled backs — next to contemporary solutions such as plain worktops, smooth cabinet fronts and minimal accessories that keep the room orderly. Lighting matters: globe shades, geometric fittings or references to iconic mid-century designs build the mood.',
      'It works particularly well in living rooms, where a designer sofa or a wing chair becomes the centre of the arrangement; in bedrooms, through soft fabrics and warm colours; and in kitchens, with pastel fronts, rounded appliances and details borrowed from older pattern books. The result is warm, cheerful and full of personality, where nostalgia meets the comfort of contemporary life.',
    ],
    prefix: 'modern-retro',
    photos: ['gabinet', 'hall', 'kuchnia', 'lazienka', 'salon', 'sypialnia'],
  },
  {
    slug: 'postmodern',
    title: 'Postmodern',
    text: 'Postmodern style in interiors is a creative play with form, colour, and irony that breaks the rigid rules of modernism.',
    body: [
      'Postmodern style in interiors is a creative play with form, colour and irony that breaks the rigid rules of modernism. Apparently mismatched elements are brought together to make a space full of energy, humour and artistic expression. Postmodernism rejects minimalism in favour of eclectic combinations, contrast and bold decisions.',
      'The palette is varied and emphatic: saturated reds, turquoise and orange next to pastels and muted beiges that balance the whole. Colour underlines geometric and organic furniture that often resembles sculpture — arcs, asymmetry, unusual proportions, inventive detail. Objects are treated as useful and decorative at once, and given an almost symbolic character.',
      'Materials are mixed with nerve: concrete against marble, steel against coloured lacquer, matte surfaces against glossy fabric. That variety creates depth and layering while making the aesthetic freedom of the style explicit. Decoration is central — pop-art-inspired prints, sculpture, unusual mirrors and lamps in artistic forms become the focal points.',
      'Postmodern belongs in living rooms, dining rooms and studies, where a designer armchair, an eclectic chest or a geometric lamp can define the entire arrangement. It brings lightness, playfulness and individuality — a style that is expressive and deliberately constructed, for anyone who enjoys breaking the pattern.',
    ],
    prefix: 'postmodern',
    photos: ['hall', 'hall2', 'kuchnia', 'salon1', 'salon2', 'sypialnia'],
  },
  {
    slug: 'rustic',
    title: 'Rustic',
    text: 'Rustic style brings a pastoral, countryside charm into modern interiors, emphasizing closeness to nature.',
    body: [
      'Rustic style brings a pastoral, countryside charm into contemporary interiors, emphasising closeness to nature. Natural materials lead — wood, stone, linen and cotton — and furniture is often left lightly aged, with the grain and knots visible, which gives a room its authentic, welcoming character. Simple forms, function and uneven texture make the atmosphere.',
      'The palette is light and neutral: white, cream, beiges and warm wood tones form the base, completed by subtle accents such as pastel blue, lime green or yellow. Rustic interiors are comfortable — soft textiles, throws, cushions, jute rugs and wicker baskets create a friendly, family climate.',
      'It suits every room. The living room is led by wooden furniture, a fireplace and a classic sofa, with a rattan chair or a wood-framed mirror alongside. The bedroom offers calm, while the kitchen and dining room gain character from wooden tables, porcelain and practical accessories. Tradition and modernity coexist: antiques next to modern appliances, classic patterns next to simple forms.',
      'The result is a harmonious space full of natural materials, quiet colour and simplicity, combining function with warmth — a home that is easy to rest in.',
    ],
    prefix: 'rustykalny',
    photos: ['gabinet', 'hall', 'kuchnia', 'lazienka', 'salon', 'sypialnia'],
  },
]

const roomOf = (photo: string) => ROOMS[photo.split('-')[0].replace(/\d+$/, '')] ?? 'interior'

const galleryOf = (seed: StyleSeedT): MediaImageT[] =>
  seed.photos.map((photo) =>
    image(`${seed.prefix}-${photo}.webp`, `${seed.title} ${roomOf(photo)}`),
  )

export const interiorStyles: InteriorStyleT[] = seeds.map((seed, index) => {
  const gallery = galleryOf(seed)

  return {
    id: index + 1,
    slug: seed.slug,
    title: seed.title,
    text: seed.text,
    body: seed.body,
    image: gallery[0],
    contentImage: gallery[1] ?? null,
    gallery,
  }
})

export const interiorStylesPlaceholder = {
  styles: interiorStyles,
}

/** The styles following this one, so every article ends on a different set of suggestions. */
export const relatedStyles = (slug: string, count = 3): InteriorStyleT[] => {
  const index = interiorStyles.findIndex((style) => style.slug === slug)
  if (index < 0) return []

  return Array.from(
    { length: Math.min(count, interiorStyles.length - 1) },
    (_, offset) => interiorStyles[(index + offset + 1) % interiorStyles.length],
  )
}
