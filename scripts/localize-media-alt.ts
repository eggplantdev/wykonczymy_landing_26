import { getPayload } from 'payload'

import config from '@/payload.config'
import { i18n } from '@/lib/i18n/i18n'
import { isWrite, runWriteScript } from './write-guard'

// Derived from the shape of the Polish alt, not a row-by-row list, so it still works after the
// next upload. Style titles come from the CMS; the six rooms are a closed set.
const ROOMS: Record<string, string> = {
  gabinet: 'home office',
  hall: 'hallway',
  kuchnia: 'kitchen',
  salon: 'living room',
  sypialnia: 'bedroom',
  łazienka: 'bathroom',
}

// Place names stay as they are — a Warsaw district is not renamed for an English reader.
const PROJECT_PHOTO = /^(.+) — zdjęcie (\d+)$/

const FREEFORM: Record<string, string> = {
  'Bartosz Antonik': 'Bartosz Antonik',
  'Beżowy salon w ciepłym świetle': 'Beige living room in warm light',
  'Jasny skandynawski salon z kominkiem': 'Bright Scandinavian living room with a fireplace',
  'Salon z ciemną ścianą z marmuru i jadalnią':
    'Living room with a dark marble wall and a dining area',
}

const run = async () => {
  const payload = await getPayload({ config: await config })

  const [stylesPl, stylesEn] = await Promise.all(
    i18n.locales.map((locale) =>
      payload.find({ collection: 'interior-styles', locale, depth: 0, limit: 0 }),
    ),
  )
  const englishByPolishTitle = new Map<string, string>()
  for (const style of stylesPl.docs) {
    const english = stylesEn.docs.find((doc) => doc.id === style.id)?.title
    if (english) englishByPolishTitle.set(style.title, english)
  }

  // Undefined for an EN-only upload: report it below rather than throw.
  const translate = (polish: string | undefined) => {
    if (!polish) return undefined
    if (FREEFORM[polish]) return FREEFORM[polish]

    const project = PROJECT_PHOTO.exec(polish)
    if (project) return `${project[1]} — photo ${project[2]}`

    const separator = polish.lastIndexOf(' — ')
    if (separator !== -1) {
      const english = englishByPolishTitle.get(polish.slice(0, separator))
      const room = ROOMS[polish.slice(separator + 3)]
      if (english && room) return `${english} — ${room}`
    }

    return undefined
  }

  const { docs } = await payload.find({ collection: 'media', locale: 'pl', depth: 0, limit: 0 })
  const { docs: existing } = await payload.find({
    collection: 'media',
    locale: 'en',
    depth: 0,
    limit: 0,
  })
  // `fallback: false`, so an unwritten English alt reads as empty — that is what is left to do.
  const translated = new Set(existing.filter((doc) => doc.alt).map((doc) => doc.id))

  const unmatched = docs.filter((doc) => !translated.has(doc.id) && !translate(doc.alt))
  if (unmatched.length > 0) {
    console.error(`No rule matches ${unmatched.length} alt string(s); nothing was written:`)
    for (const doc of unmatched) console.error(`  #${doc.id} "${doc.alt}"`)
    process.exit(1)
  }

  let written = 0
  let kept = 0

  for (const doc of docs) {
    if (translated.has(doc.id)) {
      kept += 1
      continue
    }

    const alt = translate(doc.alt)
    console.log(`${isWrite ? 'write' : 'dry  '} #${doc.id} "${doc.alt}" → "${alt}"`)

    if (isWrite)
      await payload.update({ collection: 'media', id: doc.id, locale: 'en', data: { alt } })

    written += 1
  }

  return { written, kept }
}

runWriteScript(run)
