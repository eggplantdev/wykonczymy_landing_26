// Shaped after Payload's `Media` upload type so the placeholder data and a real CMS
// document are interchangeable at the call site once the home field group exists.
export type MediaImageT = {
  url: string
  alt: string
}

export type MediaVideoT = {
  url: string
}
