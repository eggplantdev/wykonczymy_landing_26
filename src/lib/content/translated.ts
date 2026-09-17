/**
 * `fallback: false`, so a document translated in one language only comes back with a null slug
 * and title in the other — it has no address in this locale and cannot be linked to.
 */
export const isTranslated = (doc: { slug?: string | null; title?: string | null }): boolean =>
  Boolean(doc.slug && doc.title)
