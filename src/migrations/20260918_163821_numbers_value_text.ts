import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_home_numbers_cards" ALTER COLUMN "value" SET DATA TYPE varchar;
  ALTER TABLE "_pages_v_version_home_numbers_cards" ALTER COLUMN "value" SET DATA TYPE varchar;`)
}

// The generator omits the USING clauses: numeric -> varchar casts itself, the way back does
// not, and Postgres aborts the whole migration on the missing cast. Reverting also only
// succeeds while every figure still parses as a number.
export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_home_numbers_cards" ALTER COLUMN "value" SET DATA TYPE numeric USING "value"::numeric;
  ALTER TABLE "_pages_v_version_home_numbers_cards" ALTER COLUMN "value" SET DATA TYPE numeric USING "value"::numeric;`)
}
