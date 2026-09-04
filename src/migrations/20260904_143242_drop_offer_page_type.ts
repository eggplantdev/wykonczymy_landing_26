import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Recreating the enum recasts every row, so a surviving 'offer' row would abort the
  // migration. Production still holds the Oferta page this change retires.
  await db.execute(sql`
  DELETE FROM "_pages_v" WHERE "version_page_type" = 'offer';
  DELETE FROM "pages" WHERE "page_type" = 'offer';
  ALTER TABLE "pages" ALTER COLUMN "page_type" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_page_type";
  CREATE TYPE "public"."enum_pages_page_type" AS ENUM('home', 'completed-works', 'interior-styles', 'contact', 'price-list');
  ALTER TABLE "pages" ALTER COLUMN "page_type" SET DATA TYPE "public"."enum_pages_page_type" USING "page_type"::"public"."enum_pages_page_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_page_type" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_version_page_type";
  CREATE TYPE "public"."enum__pages_v_version_page_type" AS ENUM('home', 'completed-works', 'interior-styles', 'contact', 'price-list');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_page_type" SET DATA TYPE "public"."enum__pages_v_version_page_type" USING "version_page_type"::"public"."enum__pages_v_version_page_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_page_type" ADD VALUE 'offer' BEFORE 'completed-works';
  ALTER TYPE "public"."enum__pages_v_version_page_type" ADD VALUE 'offer' BEFORE 'completed-works';`)
}
