// Splits `250+` into `''`, `250`, `'+'` so only the digits climb and the admin keeps control of the
// decoration. A thousands separator stays inside the digit run — `1 000+` counts — but both ends
// are digit-free on purpose: a range like `2-3` holds a second digit run that one counter cannot
// animate, so it falls through to plain text rather than counting to 2.
const PARTS = /^(\D*)(\d{1,3}(?:[   ]\d{3})+|\d+)(\D*)$/
const SEPARATORS = /[   ]/g

export type FigureT = {
  prefix: string
  suffix: string
  target: number
  /** Digits the admin typed, so a zero-padded figure rests on the width they wrote. */
  width: number
  /** The separator the admin used, re-inserted every frame so the grouping does not appear at 1000. */
  separator?: string
}

export function parseFigure(value: string): FigureT | null {
  const parts = PARTS.exec(value)
  if (!parts) return null

  const separator = parts[2].match(SEPARATORS)?.[0]
  const digits = parts[2].replace(SEPARATORS, '')

  return {
    prefix: parts[1],
    suffix: parts[3],
    target: Number(digits),
    width: digits.length,
    separator,
  }
}

// Counts the groups from the right, so a figure mid-climb is grouped the way its target is rather
// than gaining a separator only once it reaches four digits.
function group(digits: string, separator: string) {
  return digits.replace(/\B(?=(\d{3})+$)/g, separator)
}

export function formatFigure(figure: FigureT, n: number) {
  const digits = String(Math.round(n)).padStart(figure.width, '0')
  const grouped = figure.separator ? group(digits, figure.separator) : digits

  return `${figure.prefix}${grouped}${figure.suffix}`
}
