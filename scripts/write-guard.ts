import { createInterface } from 'node:readline/promises'

type TotalsT = { written: number; kept: number }

export const isWrite = process.argv.includes('--write')

const skipPrompt = process.argv.includes('--yes')

// `POSTGRES_URL` is production in every environment including a laptop, so `--write` alone is one
// shell-history recall away from the live database.
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

export const runWriteScript = async (task: () => Promise<TotalsT>) => {
  try {
    if (isWrite) await confirmTarget()

    const { written, kept } = await task()

    console.log(
      `\n${isWrite ? 'wrote' : 'would write'} ${written}, left ${kept} alone.` +
        (isWrite ? '' : '\nRe-run with --write to apply. Take `pnpm db:dump` first.'),
    )

    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
