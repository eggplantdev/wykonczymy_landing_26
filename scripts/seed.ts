import { getPayload } from 'payload'

import config from '@payload-config'
import { seedAll } from './seed/run'

const payload = await getPayload({ config })

await seedAll(payload)
await payload.destroy()
