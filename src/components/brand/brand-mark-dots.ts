// Geometry for the eggplantdev brand mark — the hand-drawn aubergine dot grid, coloured top→bottom

// along the neon brand ramp. Ported from Chaos Kitchen so the credit mark in the footer renders the
// real brand logo rather than a flat image.

// '1' = a lit dot. Edit here to reshape the mark.
const GRID = [
  '0001000',
  '0011000',
  '0011100',
  '0111100',
  '0111110',
  '1111110',
  '1111111',
  '1111111',
  '0111110',
  '0011100',
]

// Neon brand ramp, head→tail (top→bottom of the mark): green → cyan → violet → fuchsia.
const RAMP = ['#10ffaa', '#00e5ff', '#a855f7', '#d946ef']

export const DOT_RADIUS = 2.9
const CELL_PITCH = 8

function hexToRgb(hex: string) {
  const packed = parseInt(hex.slice(1), 16)
  return { red: (packed >> 16) & 255, green: (packed >> 8) & 255, blue: packed & 255 }
}

// Piecewise-linear RGB sample of the ramp at position ∈ [0,1].
function sampleRamp(position: number) {
  const scaled = Math.min(1, Math.max(0, position)) * (RAMP.length - 1)
  const index = Math.min(RAMP.length - 2, Math.floor(scaled))
  const weight = scaled - index
  const from = hexToRgb(RAMP[index])
  const to = hexToRgb(RAMP[index + 1])
  const mix = (start: number, end: number) => Math.round(start + (end - start) * weight)

  return `rgb(${mix(from.red, to.red)}, ${mix(from.green, to.green)}, ${mix(from.blue, to.blue)})`
}

export type BrandDotT = { cx: number; cy: number; radius: number; fill: string }

const rows = GRID.length
const columns = GRID[0].length

export const VIEWBOX = { width: (columns + 1) * CELL_PITCH, height: (rows + 1) * CELL_PITCH }

export function buildBrandDots(): BrandDotT[] {
  const dots: BrandDotT[] = []

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      if (GRID[row][column] !== '1') continue
      dots.push({
        cx: CELL_PITCH * (column + 1),
        cy: CELL_PITCH * (row + 1),
        radius: DOT_RADIUS,
        fill: sampleRamp(row / (rows - 1)),
      })
    }
  }

  return dots
}
