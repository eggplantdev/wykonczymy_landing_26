import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_home_after_services_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_version_home_after_services_position" AS ENUM('left', 'right');
  ALTER TABLE "pages" ADD COLUMN "home_after_services_position" "enum_pages_home_after_services_position" DEFAULT 'left';
  ALTER TABLE "pages_locales" ADD COLUMN "home_after_services_text" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_home_after_services_position" "enum__pages_v_version_home_after_services_position" DEFAULT 'left';
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_home_after_services_text" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP COLUMN "home_after_services_position";
  ALTER TABLE "pages_locales" DROP COLUMN "home_after_services_text";
  ALTER TABLE "_pages_v" DROP COLUMN "version_home_after_services_position";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_home_after_services_text";
  DROP TYPE "public"."enum_pages_home_after_services_position";
  DROP TYPE "public"."enum__pages_v_version_home_after_services_position";`)
}
