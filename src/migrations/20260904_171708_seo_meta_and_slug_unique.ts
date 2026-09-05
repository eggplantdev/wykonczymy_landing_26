import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "pages_slug_idx";
  DROP INDEX "projects_slug_idx";
  DROP INDEX "interior_styles_slug_idx";
  ALTER TABLE "pages_locales" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "projects_locales" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "_projects_v_locales" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_projects_v_locales" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "_projects_v_locales" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "interior_styles_locales" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "interior_styles_locales" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "interior_styles_locales" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "_interior_styles_v_locales" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_interior_styles_v_locales" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "_interior_styles_v_locales" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_locales" ADD CONSTRAINT "_projects_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "interior_styles_locales" ADD CONSTRAINT "interior_styles_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_interior_styles_v_locales" ADD CONSTRAINT "_interior_styles_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE INDEX "projects_meta_meta_image_idx" ON "projects_locales" USING btree ("meta_image_id","_locale");
  CREATE INDEX "_projects_v_version_meta_version_meta_image_idx" ON "_projects_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE INDEX "interior_styles_meta_meta_image_idx" ON "interior_styles_locales" USING btree ("meta_image_id","_locale");
  CREATE INDEX "_interior_styles_v_version_meta_version_meta_image_idx" ON "_interior_styles_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "interior_styles_slug_idx" ON "interior_styles_locales" USING btree ("slug","_locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_locales" DROP CONSTRAINT "pages_locales_meta_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_locales" DROP CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk";
  
  ALTER TABLE "projects_locales" DROP CONSTRAINT "projects_locales_meta_image_id_media_id_fk";
  
  ALTER TABLE "_projects_v_locales" DROP CONSTRAINT "_projects_v_locales_version_meta_image_id_media_id_fk";
  
  ALTER TABLE "interior_styles_locales" DROP CONSTRAINT "interior_styles_locales_meta_image_id_media_id_fk";
  
  ALTER TABLE "_interior_styles_v_locales" DROP CONSTRAINT "_interior_styles_v_locales_version_meta_image_id_media_id_fk";
  
  DROP INDEX "pages_meta_meta_image_idx";
  DROP INDEX "_pages_v_version_meta_version_meta_image_idx";
  DROP INDEX "projects_meta_meta_image_idx";
  DROP INDEX "_projects_v_version_meta_version_meta_image_idx";
  DROP INDEX "interior_styles_meta_meta_image_idx";
  DROP INDEX "_interior_styles_v_version_meta_version_meta_image_idx";
  DROP INDEX "pages_slug_idx";
  DROP INDEX "projects_slug_idx";
  DROP INDEX "interior_styles_slug_idx";
  CREATE INDEX "pages_slug_idx" ON "pages_locales" USING btree ("slug","_locale");
  CREATE INDEX "projects_slug_idx" ON "projects_locales" USING btree ("slug","_locale");
  CREATE INDEX "interior_styles_slug_idx" ON "interior_styles_locales" USING btree ("slug","_locale");
  ALTER TABLE "pages_locales" DROP COLUMN "meta_title";
  ALTER TABLE "pages_locales" DROP COLUMN "meta_description";
  ALTER TABLE "pages_locales" DROP COLUMN "meta_image_id";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_meta_title";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_meta_description";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "projects_locales" DROP COLUMN "meta_title";
  ALTER TABLE "projects_locales" DROP COLUMN "meta_description";
  ALTER TABLE "projects_locales" DROP COLUMN "meta_image_id";
  ALTER TABLE "_projects_v_locales" DROP COLUMN "version_meta_title";
  ALTER TABLE "_projects_v_locales" DROP COLUMN "version_meta_description";
  ALTER TABLE "_projects_v_locales" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "interior_styles_locales" DROP COLUMN "meta_title";
  ALTER TABLE "interior_styles_locales" DROP COLUMN "meta_description";
  ALTER TABLE "interior_styles_locales" DROP COLUMN "meta_image_id";
  ALTER TABLE "_interior_styles_v_locales" DROP COLUMN "version_meta_title";
  ALTER TABLE "_interior_styles_v_locales" DROP COLUMN "version_meta_description";
  ALTER TABLE "_interior_styles_v_locales" DROP COLUMN "version_meta_image_id";`)
}
