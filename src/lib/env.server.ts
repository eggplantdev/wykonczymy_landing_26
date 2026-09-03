import 'server-only'

import { serverSchema } from './env-schema'

export const serverEnv = serverSchema.parse(process.env)
