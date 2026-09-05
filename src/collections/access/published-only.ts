import type { Access } from 'payload'

// Payload mounts a public REST/GraphQL surface, and `drafts: true` makes an unpublished
// version readable through it. Anonymous callers get published rows only; the filter has
// to live here, not just in the route's query.
export const publishedOnly: Access = ({ req: { user } }) =>
  user ? true : { _status: { equals: 'published' } }
