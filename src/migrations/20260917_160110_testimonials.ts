import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_home_testimonials_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"avatar_id" integer
  );
  
  CREATE TABLE "pages_home_testimonials_quotes_locales" (
  	"quote" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_version_home_testimonials_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"avatar_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_home_testimonials_quotes_locales" (
  	"quote" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_locales" ADD COLUMN "home_testimonials_section_title" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_home_testimonials_section_title" varchar;
  ALTER TABLE "pages_home_testimonials_quotes" ADD CONSTRAINT "pages_home_testimonials_quotes_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_home_testimonials_quotes" ADD CONSTRAINT "pages_home_testimonials_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_home_testimonials_quotes_locales" ADD CONSTRAINT "pages_home_testimonials_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_home_testimonials_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_home_testimonials_quotes" ADD CONSTRAINT "_pages_v_version_home_testimonials_quotes_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_home_testimonials_quotes" ADD CONSTRAINT "_pages_v_version_home_testimonials_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_home_testimonials_quotes_locales" ADD CONSTRAINT "_pages_v_version_home_testimonials_quotes_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_version_home_testimonials_quotes"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_home_testimonials_quotes_order_idx" ON "pages_home_testimonials_quotes" USING btree ("_order");
  CREATE INDEX "pages_home_testimonials_quotes_parent_id_idx" ON "pages_home_testimonials_quotes" USING btree ("_parent_id");
  CREATE INDEX "pages_home_testimonials_quotes_avatar_idx" ON "pages_home_testimonials_quotes" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "pages_home_testimonials_quotes_locales_locale_parent_id_uniq" ON "pages_home_testimonials_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_version_home_testimonials_quotes_order_idx" ON "_pages_v_version_home_testimonials_quotes" USING btree ("_order");
  CREATE INDEX "_pages_v_version_home_testimonials_quotes_parent_id_idx" ON "_pages_v_version_home_testimonials_quotes" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_home_testimonials_quotes_avatar_idx" ON "_pages_v_version_home_testimonials_quotes" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "_pages_v_version_home_testimonials_quotes_locales_locale_par" ON "_pages_v_version_home_testimonials_quotes_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_home_testimonials_quotes" CASCADE;
  DROP TABLE "pages_home_testimonials_quotes_locales" CASCADE;
  DROP TABLE "_pages_v_version_home_testimonials_quotes" CASCADE;
  DROP TABLE "_pages_v_version_home_testimonials_quotes_locales" CASCADE;
  ALTER TABLE "pages_locales" DROP COLUMN "home_testimonials_section_title";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_home_testimonials_section_title";`)
}
