// Splits `250+` into `''`, `250`, `'+'` so only the digits climb and the admin keeps control of
// the decoration. Both ends are digit-free on purpose: `1 000` or `4,5` holds a second digit run
// that the count cannot animate, so it falls through to plain text rather than counting to 1.
const PARTS = /^(\D*)(\d+)(\D*)$/

export type FigureT = {
  prefix: string
  suffix: string
  target: number
  /** Digits the admin typed, so a zero-padded figure rests on the width they wrote. */
  width: number
}

export function parseFigure(value: string): FigureT | null {
  const parts = PARTS.exec(value)
  if (!parts) return null

  return { prefix: parts[1], suffix: parts[3], target: Number(parts[2]), width: parts[2].length }
}

export function formatFigure(figure: FigureT, n: number) {
  return `${figure.prefix}${String(Math.round(n)).padStart(figure.width, '0')}${figure.suffix}`
}
