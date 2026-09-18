// The mappers in lib/content narrow to this, so an unpopulated upload is `null` at the
// call site rather than an id.
export type MediaImageT = {
  url: string
  alt: string
  /** The stored file's own proportions — the gallery sizes a tile by the shot's orientation. */
  width?: number
  height?: number
  /** Percentages, as Payload stores them. Absent means dead centre. */
  focalPoint?: { x: number; y: number }
}

export type MediaVideoT = {
  url: string
}
