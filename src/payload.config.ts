import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import nodemailer from 'nodemailer'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  // Both indexed languages ship together; an English-incomplete launch is a
  // regression, so neither locale falls back to the other.
  localization: {
    locales: ['pl', 'en'],
    defaultLocale: 'pl',
    fallback: false,
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  // Without SMTP credentials Payload falls back to logging mail to the console.
  // Attaching the adapter regardless makes every local build fail transport
  // verification against a host that isn't there.
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_USER || '',
        defaultFromName: 'Wykończymy',
        transport: nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT ?? 587),
          secure: Number(process.env.SMTP_PORT ?? 587) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        }),
      })
    : undefined,
  // redirectsPlugin is installed but not wired: its `to.reference` field needs a
  // target collection, so it lands with Pages in F2. It holds the 301s for
  // retired addresses as editable rows — see context/foundation/url-map.md.
  plugins: [
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      addRandomSuffix: true,
    }),
    seoPlugin({
      uploadsCollection: 'media',
    }),
  ],
  sharp,
})
