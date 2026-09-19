import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_scope" DROP COLUMN "value";
  ALTER TABLE "_projects_v_version_scope" DROP COLUMN "value";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_scope" ADD COLUMN "value" varchar;
  ALTER TABLE "_projects_v_version_scope" ADD COLUMN "value" varchar;`)
}
