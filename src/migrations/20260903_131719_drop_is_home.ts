import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP COLUMN "is_home";
  ALTER TABLE "_pages_v" DROP COLUMN "version_is_home";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" ADD COLUMN "is_home" boolean DEFAULT false;
  ALTER TABLE "_pages_v" ADD COLUMN "version_is_home" boolean DEFAULT false;`)
}
