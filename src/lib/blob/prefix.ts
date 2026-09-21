/** Everything a submission stages lives under this root, and nothing else does. */
export const LEADS_PREFIX = 'leads/'

/**
 * The one place a submission maps to a blob path. Three callers depend on the same answer — the
 * token route pins an upload to it, the cleanup callback lists it, the sweep walks its root — and
 * a path built by hand in any of them would be a delete or an upload aimed somewhere else.
 *
 * The store root holds this site's CMS media, written under exact filenames with
 * `allowOverwrite: true`, so the prefix is what stands between an anonymous visitor's token and a
 * published photo.
 */
export function leadPrefix(submissionId: string): string {
  return `${LEADS_PREFIX}${submissionId}/`
}
