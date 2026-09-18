import { getPayload } from 'payload'

import config from '@payload-config'
import { seedStylePhotos } from './seed/photos'

const payload = await getPayload({ config })

await seedStylePhotos(payload)
await payload.destroy()
