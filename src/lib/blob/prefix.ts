export const LEADS_PREFIX = 'leads/'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Guards every interpolation into a blob path below: an unchecked id is what would let a crafted
// value widen a `list` to the store root, where the CMS media lives.
export function isSubmissionId(value: unknown): value is string {
  return typeof value === 'string' && UUID_PATTERN.test(value)
}

export function leadPrefix(submissionId: string): string {
  return `${LEADS_PREFIX}${submissionId}/`
}

/**
 * One segment directly under this submission's prefix, and nothing nested. A blob pathname arrives
 * bare (`leads/<id>/a.jpg`) and a URL's arrives rooted (`/leads/<id>/a.jpg`), so the leading slash
 * is optional — what the two callers have to agree on is the rule, not each other's spelling.
 * A nested path is one neither the cleanup nor the sweep would ever reclaim.
 */
export function isDirectChild(pathname: string, submissionId: string): boolean {
  const bare = pathname.startsWith('/') ? pathname.slice(1) : pathname
  const prefix = leadPrefix(submissionId)

  if (!bare.startsWith(prefix)) return false

  const filename = bare.slice(prefix.length)

  return filename !== '' && !filename.includes('/')
}

/** The inverse of `leadPrefix` — the sweep walks paths it never built. */
export function submissionIdFromPath(pathname: string): string | undefined {
  if (!pathname.startsWith(LEADS_PREFIX)) return undefined

  return pathname.slice(LEADS_PREFIX.length).split('/')[0] || undefined
}
