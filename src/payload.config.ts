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
import { Pages } from './collections/Pages'
import { Users } from './collections/Users'
// Parsed here rather than imported from env.server.ts: the Payload CLI loads this file
// outside Next, where `server-only` cannot resolve.
import { serverSchema } from './lib/env-schema'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const env = serverSchema.parse(process.env)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Pages],
  editor: lexicalEditor(),
  // Both indexed languages ship together; an English-incomplete launch is a
  // regression, so neither locale falls back to the other.
  localization: {
    locales: ['pl', 'en'],
    defaultLocale: 'pl',
    fallback: false,
  },
  secret: env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString: env.POSTGRES_URL,
    },
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  // Without SMTP credentials Payload falls back to logging mail to the console.
  // Attaching the adapter regardless makes every local build fail transport
  // verification against a host that isn't there.
  email: env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: env.SMTP_USER ?? '',
        defaultFromName: 'Wykończymy',
        transport: nodemailer.createTransport({
          host: env.SMTP_HOST,
          port: env.SMTP_PORT ?? 587,
          secure: (env.SMTP_PORT ?? 587) === 465,
          auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
          },
        }),
      })
    : undefined,
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: env.BLOB_READ_WRITE_TOKEN ?? '',
      addRandomSuffix: true,
    }),
    seoPlugin({
      uploadsCollection: 'media',
    }),
  ],
  sharp,
})
