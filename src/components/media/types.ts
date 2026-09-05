// What a component needs off a Payload `Media` document. The mappers in lib/content
// narrow to this, so an unpopulated upload is `null` at the call site rather than an id.
export type MediaImageT = {
  url: string
  alt: string
}

export type MediaVideoT = {
  url: string
}
