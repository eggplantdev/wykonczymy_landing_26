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

export const serverSchema = z
  .object({
    POSTGRES_URL: z.string().min(1),
    PAYLOAD_SECRET: z.string().min(32),
    // Optional only so the schema parses in a checkout that has no credentials yet; the
    // superRefine below makes it mandatory on Vercel. Left empty, the blob adapter stays off
    // and Payload writes uploads to disk, where the deployed site cannot read them — dev and
    // production share the one store.
    BLOB_READ_WRITE_TOKEN: optional(z.string().min(1)),
    VERCEL: optional(z.string().min(1)),

    // Lead delivery. Required outright rather than Vercel-gated like the blob token above:
    // a checkout that cannot forward a submission cannot run the form at all, and the form
    // is the site's only conversion path — a missing secret has to fail loudly at boot, not
    // silently degrade into a lead that goes nowhere.
    // Same value as the leads app's own LANDING_WEBHOOK_SECRET; both directions are signed with it.
    LANDING_WEBHOOK_SECRET: z.string().min(1),
    WYKONCZYMY_WEBHOOK_URL: z.url(),
    CRON_SECRET: z.string().min(1),
    // Preview shares production's blob store, so the sweep has to know which one it is running in.
    VERCEL_ENV: optional(z.enum(['development', 'preview', 'production'])),

    // Optional by design: without SMTP_HOST the config omits the nodemailer adapter and
    // Payload logs mail to the console. Attaching it unconditionally makes the build fail
    // verifying a transport that isn't there.
    SMTP_HOST: optional(z.string().min(1)),
    SMTP_PORT: optional(z.coerce.number().int().positive()),
    SMTP_USER: optional(z.string().min(1)),
    SMTP_PASS: optional(z.string().min(1)),
  })
  .superRefine((env, ctx) => {
    if (env.VERCEL && !env.BLOB_READ_WRITE_TOKEN) {
      ctx.addIssue({
        code: 'custom',
        path: ['BLOB_READ_WRITE_TOKEN'],
        message: 'Required on Vercel — media uploads have nowhere to go without it.',
      })
    }
  })
