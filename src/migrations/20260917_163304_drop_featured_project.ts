import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages" DROP CONSTRAINT "pages_home_featured_project_project_id_projects_id_fk";
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_home_featured_project_project_id_projects_id_fk";
  DROP INDEX "pages_home_featured_project_home_featured_project_projec_idx";
  DROP INDEX "_pages_v_version_home_featured_project_version_home_feat_idx";
  ALTER TABLE "pages" DROP COLUMN "home_featured_project_project_id";
  ALTER TABLE "pages_locales" DROP COLUMN "home_featured_project_section_title";
  ALTER TABLE "pages_locales" DROP COLUMN "home_featured_project_cta_label";
  ALTER TABLE "_pages_v" DROP COLUMN "version_home_featured_project_project_id";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_home_featured_project_section_title";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_home_featured_project_cta_label";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages" ADD COLUMN "home_featured_project_project_id" integer;
  ALTER TABLE "pages_locales" ADD COLUMN "home_featured_project_section_title" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "home_featured_project_cta_label" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_home_featured_project_project_id" integer;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_home_featured_project_section_title" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_home_featured_project_cta_label" varchar;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_home_featured_project_project_id_projects_id_fk" FOREIGN KEY ("home_featured_project_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_home_featured_project_project_id_projects_id_fk" FOREIGN KEY ("version_home_featured_project_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_home_featured_project_home_featured_project_projec_idx" ON "pages" USING btree ("home_featured_project_project_id");
  CREATE INDEX "_pages_v_version_home_featured_project_version_home_feat_idx" ON "_pages_v" USING btree ("version_home_featured_project_project_id");`)
}
