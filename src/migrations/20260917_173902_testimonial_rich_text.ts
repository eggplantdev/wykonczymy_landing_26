import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

// `USING NULL` rather than a cast: the stored values are prose, not Lexical trees, so there
// is nothing to convert into. `pnpm seed` rewrites every quote from `scripts/seed/data/`.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_home_testimonials_quotes_locales" ALTER COLUMN "quote" SET DATA TYPE jsonb USING NULL;
  ALTER TABLE "_pages_v_version_home_testimonials_quotes_locales" ALTER COLUMN "quote" SET DATA TYPE jsonb USING NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_home_testimonials_quotes_locales" ALTER COLUMN "quote" SET DATA TYPE varchar USING NULL;
  ALTER TABLE "_pages_v_version_home_testimonials_quotes_locales" ALTER COLUMN "quote" SET DATA TYPE varchar USING NULL;`)
}
