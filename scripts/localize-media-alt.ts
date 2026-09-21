import { createInterface } from 'node:readline/promises'

import { getPayload } from 'payload'

import config from '@/payload.config'

// Every Polish alt in the library is one of three shapes: a style photo, a project photo, or
// one of four strings written by hand. The translation is derived from the shape rather than
// listed row by row, so re-running after new photos are uploaded keeps working — and an alt
// that fits none of the three aborts the run instead of being guessed at.

// Style photos read `<style title> — <room>`. The titles come from the CMS, so a renamed style
// needs nothing here; the six rooms are a closed set and do not.
const ROOMS: Record<string, string> = {
  gabinet: 'home office',
  hall: 'hallway',
  kuchnia: 'kitchen',
  salon: 'living room',
  sypialnia: 'bedroom',
  łazienka: 'bathroom',
}

// Project photos read `<place> — zdjęcie N`. Place names are deliberately untranslated (a
// Warsaw district is not renamed for an English reader), so only the word `zdjęcie` moves.
const PROJECT_PHOTO = /^(.+) — zdjęcie (\d+)$/

const FREEFORM: Record<string, string> = {
  'Bartosz Antonik': 'Bartosz Antonik',
  'Beżowy salon w ciepłym świetle': 'Beige living room in warm light',
  'Jasny skandynawski salon z kominkiem': 'Bright Scandinavian living room with a fireplace',
  'Salon z ciemną ścianą z marmuru i jadalnią':
    'Living room with a dark marble wall and a dining area',
}

const isWrite = process.argv.includes('--write')
const skipPrompt = process.argv.includes('--yes')

// `POSTGRES_URL` is production in every environment including a laptop, so `--write` alone is one
// shell-history recall away from the live database. Naming the host is what makes that visible.
const confirmTarget = async () => {
  const host = process.env.POSTGRES_URL?.replace(/^.*@/, '').replace(/\?.*$/, '') ?? '(unset)'

  if (skipPrompt) {
    console.log(`writing to ${host} (--yes)\n`)
    return
  }

  const prompt = createInterface({ input: process.stdin, output: process.stdout })
  const answer = await prompt.question(`About to write to ${host}. Type "yes" to continue: `)
  prompt.close()

  if (answer.trim() !== 'yes') {
    console.log('aborted.')
    process.exit(1)
  }
}

const run = async () => {
  if (isWrite) await confirmTarget()

  const payload = await getPayload({ config: await config })

  // Both locales of every style, keyed by id, so a Polish alt prefix can be matched to its
  // style and swapped for the English title of the same document.
  const [stylesPl, stylesEn] = await Promise.all(
    (['pl', 'en'] as const).map((locale) =>
      payload.find({ collection: 'interior-styles', locale, depth: 0, limit: 100 }),
    ),
  )
  const englishByPolishTitle = new Map<string, string>()
  for (const style of stylesPl.docs) {
    const english = stylesEn.docs.find((doc) => doc.id === style.id)?.title
    if (english) englishByPolishTitle.set(style.title, english)
  }

  const translate = (polish: string) => {
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

  const { docs } = await payload.find({ collection: 'media', locale: 'pl', depth: 0, limit: 500 })
  const { docs: existing } = await payload.find({
    collection: 'media',
    locale: 'en',
    depth: 0,
    limit: 500,
  })
  // `fallback: false`, so an unwritten English alt reads as empty rather than as the Polish one
  // — which is the whole reason this script exists, and also how it knows what is left to do.
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

  console.log(
    `\n${isWrite ? 'wrote' : 'would write'} ${written}, left ${kept} alone.` +
      (isWrite ? '' : '\nRe-run with --write to apply. Take `pnpm db:dump` first.'),
  )

  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
