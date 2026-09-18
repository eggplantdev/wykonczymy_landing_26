import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_locales" DROP COLUMN "price";
  ALTER TABLE "_projects_v_locales" DROP COLUMN "version_price";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_locales" ADD COLUMN "price" varchar;
  ALTER TABLE "_projects_v_locales" ADD COLUMN "version_price" varchar;`)
}
