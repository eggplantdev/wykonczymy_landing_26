import { z } from 'zod'

// Pure schemas — no side effects and no `server-only`, so payload.config.ts can parse
// serverSchema when the Payload CLI runs it outside Next (`payload migrate`).

// dotenv sets an unfilled var to '' rather than leaving it absent, so a bare .optional()
// still fails validation. Treat empty as "not set".
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (value === '' ? undefined : value), schema.optional())

export const clientSchema = z.object({
  NEXT_PUBLIC_SERVER_URL: z.url(),
})

export const serverSchema = z.object({
  POSTGRES_URL: z.string().min(1),
  PAYLOAD_SECRET: z.string().min(32),
  BLOB_READ_WRITE_TOKEN: z.string().min(1),

  // Optional by design: without SMTP_HOST the config omits the nodemailer adapter and
  // Payload logs mail to the console. Attaching it unconditionally makes the build fail
  // verifying a transport that isn't there.
  SMTP_HOST: optional(z.string().min(1)),
  SMTP_PORT: optional(z.coerce.number().int().positive()),
  SMTP_USER: optional(z.string().min(1)),
  SMTP_PASS: optional(z.string().min(1)),
})
