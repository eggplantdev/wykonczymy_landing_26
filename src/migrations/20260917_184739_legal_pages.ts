import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_page_type" ADD VALUE 'privacy-policy';
  ALTER TYPE "public"."enum_pages_home_hero_cta_link" ADD VALUE 'privacy-policy';
  ALTER TYPE "public"."enum_pages_home_projects_cta_link" ADD VALUE 'privacy-policy';
  ALTER TYPE "public"."enum_pages_home_interior_styles_cta_link" ADD VALUE 'privacy-policy';
  ALTER TYPE "public"."enum__pages_v_version_page_type" ADD VALUE 'privacy-policy';
  ALTER TYPE "public"."enum__pages_v_version_home_hero_cta_link" ADD VALUE 'privacy-policy';
  ALTER TYPE "public"."enum__pages_v_version_home_projects_cta_link" ADD VALUE 'privacy-policy';
  ALTER TYPE "public"."enum__pages_v_version_home_interior_styles_cta_link" ADD VALUE 'privacy-policy';
  ALTER TABLE "pages_home_testimonials_quotes" DROP CONSTRAINT "pages_home_testimonials_quotes_avatar_id_media_id_fk";
  
  ALTER TABLE "_pages_v_version_home_testimonials_quotes" DROP CONSTRAINT "_pages_v_version_home_testimonials_quotes_avatar_id_media_id_fk";
  
  DROP INDEX "pages_home_testimonials_quotes_avatar_idx";
  DROP INDEX "_pages_v_version_home_testimonials_quotes_avatar_idx";
  ALTER TABLE "pages_locales" ADD COLUMN "legal_body" jsonb;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_legal_body" jsonb;
  ALTER TABLE "pages_home_testimonials_quotes" DROP COLUMN "avatar_id";
  ALTER TABLE "_pages_v_version_home_testimonials_quotes" DROP COLUMN "avatar_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" ALTER COLUMN "page_type" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_page_type";
  CREATE TYPE "public"."enum_pages_page_type" AS ENUM('home', 'completed-works', 'interior-styles', 'contact', 'price-list');
  ALTER TABLE "pages" ALTER COLUMN "page_type" SET DATA TYPE "public"."enum_pages_page_type" USING "page_type"::"public"."enum_pages_page_type";
  ALTER TABLE "pages" ALTER COLUMN "home_hero_cta_link" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_home_hero_cta_link";
  CREATE TYPE "public"."enum_pages_home_hero_cta_link" AS ENUM('home', 'completed-works', 'interior-styles', 'contact', 'price-list');
  ALTER TABLE "pages" ALTER COLUMN "home_hero_cta_link" SET DATA TYPE "public"."enum_pages_home_hero_cta_link" USING "home_hero_cta_link"::"public"."enum_pages_home_hero_cta_link";
  ALTER TABLE "pages" ALTER COLUMN "home_projects_cta_link" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_home_projects_cta_link";
  CREATE TYPE "public"."enum_pages_home_projects_cta_link" AS ENUM('home', 'completed-works', 'interior-styles', 'contact', 'price-list');
  ALTER TABLE "pages" ALTER COLUMN "home_projects_cta_link" SET DATA TYPE "public"."enum_pages_home_projects_cta_link" USING "home_projects_cta_link"::"public"."enum_pages_home_projects_cta_link";
  ALTER TABLE "pages" ALTER COLUMN "home_interior_styles_cta_link" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_home_interior_styles_cta_link";
  CREATE TYPE "public"."enum_pages_home_interior_styles_cta_link" AS ENUM('home', 'completed-works', 'interior-styles', 'contact', 'price-list');
  ALTER TABLE "pages" ALTER COLUMN "home_interior_styles_cta_link" SET DATA TYPE "public"."enum_pages_home_interior_styles_cta_link" USING "home_interior_styles_cta_link"::"public"."enum_pages_home_interior_styles_cta_link";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_page_type" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_version_page_type";
  CREATE TYPE "public"."enum__pages_v_version_page_type" AS ENUM('home', 'completed-works', 'interior-styles', 'contact', 'price-list');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_page_type" SET DATA TYPE "public"."enum__pages_v_version_page_type" USING "version_page_type"::"public"."enum__pages_v_version_page_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_home_hero_cta_link" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_version_home_hero_cta_link";
  CREATE TYPE "public"."enum__pages_v_version_home_hero_cta_link" AS ENUM('home', 'completed-works', 'interior-styles', 'contact', 'price-list');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_home_hero_cta_link" SET DATA TYPE "public"."enum__pages_v_version_home_hero_cta_link" USING "version_home_hero_cta_link"::"public"."enum__pages_v_version_home_hero_cta_link";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_home_projects_cta_link" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_version_home_projects_cta_link";
  CREATE TYPE "public"."enum__pages_v_version_home_projects_cta_link" AS ENUM('home', 'completed-works', 'interior-styles', 'contact', 'price-list');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_home_projects_cta_link" SET DATA TYPE "public"."enum__pages_v_version_home_projects_cta_link" USING "version_home_projects_cta_link"::"public"."enum__pages_v_version_home_projects_cta_link";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_home_interior_styles_cta_link" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_version_home_interior_styles_cta_link";
  CREATE TYPE "public"."enum__pages_v_version_home_interior_styles_cta_link" AS ENUM('home', 'completed-works', 'interior-styles', 'contact', 'price-list');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_home_interior_styles_cta_link" SET DATA TYPE "public"."enum__pages_v_version_home_interior_styles_cta_link" USING "version_home_interior_styles_cta_link"::"public"."enum__pages_v_version_home_interior_styles_cta_link";
  ALTER TABLE "pages_home_testimonials_quotes" ADD COLUMN "avatar_id" integer;
  ALTER TABLE "_pages_v_version_home_testimonials_quotes" ADD COLUMN "avatar_id" integer;
  ALTER TABLE "pages_home_testimonials_quotes" ADD CONSTRAINT "pages_home_testimonials_quotes_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_home_testimonials_quotes" ADD CONSTRAINT "_pages_v_version_home_testimonials_quotes_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_home_testimonials_quotes_avatar_idx" ON "pages_home_testimonials_quotes" USING btree ("avatar_id");
  CREATE INDEX "_pages_v_version_home_testimonials_quotes_avatar_idx" ON "_pages_v_version_home_testimonials_quotes" USING btree ("avatar_id");
  ALTER TABLE "pages_locales" DROP COLUMN "legal_body";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_legal_body";`)
}
