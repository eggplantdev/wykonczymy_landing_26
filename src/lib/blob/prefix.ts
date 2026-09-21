/** Everything a submission stages lives under this root, and nothing else does. */
export const LEADS_PREFIX = 'leads/'

// The one place a submission maps to a blob path — the token route pins to it, the cleanup lists
// it, the sweep walks its root. Nothing else may build this path by hand.
export function leadPrefix(submissionId: string): string {
  return `${LEADS_PREFIX}${submissionId}/`
}
