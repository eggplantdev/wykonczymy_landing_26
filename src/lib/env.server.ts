import 'server-only'

import { serverSchema } from './env-schema'

// The server-side counterpart to env.ts. `server-only` is what keeps a secret out of the
// browser bundle: an accidental import from a client component fails the build rather than
// inlining LANDING_WEBHOOK_SECRET into a chunk the visitor downloads.
export const serverEnv = serverSchema.parse(process.env)
