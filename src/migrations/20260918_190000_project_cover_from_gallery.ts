import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

/**
 * Folds the standalone `image` field into the gallery, whose first photo is now the cover.
 * The data moves before the column goes, so the covers survive as gallery rows rather than
 * being dropped with the field.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   UPDATE "projects_rels" SET "order" = "order" + 1 WHERE "path" = 'gallery';

  DELETE FROM "projects_rels" r
   USING "projects" p
   WHERE r."parent_id" = p."id"
     AND r."path" = 'gallery'
     AND r."media_id" = p."image_id";

  INSERT INTO "projects_rels" ("parent_id", "order", "path", "media_id")
   SELECT "id", 1, 'gallery', "image_id" FROM "projects" WHERE "image_id" IS NOT NULL;

  UPDATE "projects_rels" r SET "order" = ranked."position"
   FROM (
     SELECT "id", row_number() OVER (PARTITION BY "parent_id" ORDER BY "order") AS "position"
     FROM "projects_rels" WHERE "path" = 'gallery'
   ) ranked
   WHERE r."id" = ranked."id";

  ALTER TABLE "projects" DROP CONSTRAINT "projects_image_id_media_id_fk";

  ALTER TABLE "_projects_v" DROP CONSTRAINT "_projects_v_version_image_id_media_id_fk";

  DROP INDEX "projects_image_idx";
  DROP INDEX "_projects_v_version_version_image_idx";
  ALTER TABLE "projects" DROP COLUMN "image_id";
  ALTER TABLE "_projects_v" DROP COLUMN "version_image_id";`)
}

/**
 * Lifts each project's first gallery photo back out into `image`. A cover that was only ever
 * a gallery photo stays in the gallery too, which the old fallback rendered identically.
 */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" ADD COLUMN "image_id" integer;
  ALTER TABLE "_projects_v" ADD COLUMN "version_image_id" integer;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_image_idx" ON "projects" USING btree ("image_id");
  CREATE INDEX "_projects_v_version_version_image_idx" ON "_projects_v" USING btree ("version_image_id");

  UPDATE "projects" p SET "image_id" = first."media_id"
   FROM (
     SELECT DISTINCT ON ("parent_id") "parent_id", "media_id"
     FROM "projects_rels" WHERE "path" = 'gallery' ORDER BY "parent_id", "order"
   ) first
   WHERE p."id" = first."parent_id";`)
}
