import { clientSchema } from './env-schema'

// Each NEXT_PUBLIC_* is keyed statically so the bundler can inline it; parsing
// `process.env` wholesale leaves public vars undefined in the browser bundle.
const env = clientSchema.parse({
  NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
})

export const SERVER_URL = env.NEXT_PUBLIC_SERVER_URL
