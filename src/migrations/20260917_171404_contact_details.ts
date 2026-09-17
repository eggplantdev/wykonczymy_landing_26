import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages" ADD COLUMN "contact_nip" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "contact_address" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_contact_nip" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_contact_address" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages" DROP COLUMN "contact_nip";
  ALTER TABLE "pages_locales" DROP COLUMN "contact_address";
  ALTER TABLE "_pages_v" DROP COLUMN "version_contact_nip";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_contact_address";`)
}
