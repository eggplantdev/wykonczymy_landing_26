import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_home_services_cards" DROP CONSTRAINT "pages_home_services_cards_image_id_media_id_fk";
  
  ALTER TABLE "pages_home_services_cards" DROP CONSTRAINT "pages_home_services_cards_video_id_media_id_fk";
  
  ALTER TABLE "_pages_v_version_home_services_cards" DROP CONSTRAINT "_pages_v_version_home_services_cards_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_version_home_services_cards" DROP CONSTRAINT "_pages_v_version_home_services_cards_video_id_media_id_fk";
  
  DROP INDEX "pages_home_services_cards_image_idx";
  DROP INDEX "pages_home_services_cards_video_idx";
  DROP INDEX "_pages_v_version_home_services_cards_image_idx";
  DROP INDEX "_pages_v_version_home_services_cards_video_idx";
  ALTER TABLE "pages_home_services_cards" DROP COLUMN "image_id";
  ALTER TABLE "pages_home_services_cards" DROP COLUMN "video_id";
  ALTER TABLE "_pages_v_version_home_services_cards" DROP COLUMN "image_id";
  ALTER TABLE "_pages_v_version_home_services_cards" DROP COLUMN "video_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_home_services_cards" ADD COLUMN "image_id" integer;
  ALTER TABLE "pages_home_services_cards" ADD COLUMN "video_id" integer;
  ALTER TABLE "_pages_v_version_home_services_cards" ADD COLUMN "image_id" integer;
  ALTER TABLE "_pages_v_version_home_services_cards" ADD COLUMN "video_id" integer;
  ALTER TABLE "pages_home_services_cards" ADD CONSTRAINT "pages_home_services_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_home_services_cards" ADD CONSTRAINT "pages_home_services_cards_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_home_services_cards" ADD CONSTRAINT "_pages_v_version_home_services_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_home_services_cards" ADD CONSTRAINT "_pages_v_version_home_services_cards_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_home_services_cards_image_idx" ON "pages_home_services_cards" USING btree ("image_id");
  CREATE INDEX "pages_home_services_cards_video_idx" ON "pages_home_services_cards" USING btree ("video_id");
  CREATE INDEX "_pages_v_version_home_services_cards_image_idx" ON "_pages_v_version_home_services_cards" USING btree ("image_id");
  CREATE INDEX "_pages_v_version_home_services_cards_video_idx" ON "_pages_v_version_home_services_cards" USING btree ("video_id");`)
}
