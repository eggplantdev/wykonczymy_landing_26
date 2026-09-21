import { SERVER_URL } from '@/lib/env'

// Metadata gets absolutization free from `metadataBase`; the surfaces outside the metadata API
// — robots, sitemap, JSON-LD — do not, and had five spellings of this between them.
export const absoluteUrl = (path: string): string => new URL(path, SERVER_URL).href
