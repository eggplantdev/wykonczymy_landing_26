import { getPayload } from 'payload'

import config from '@payload-config'
import { seedFooterAvatar } from './seed/footer-avatar'
import { seedStylePhotos } from './seed/photos'

const payload = await getPayload({ config })

await seedStylePhotos(payload)
await seedFooterAvatar(payload)
await payload.destroy()
