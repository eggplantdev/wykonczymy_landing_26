import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_home_process_steps_icon" AS ENUM('hammer', 'arrow-up-right-dots', 'paint-roller', 'screwdriver-wrench', 'lightbulb', 'faucet-drip', 'fan', 'ruler-combined', 'door-open', 'house-chimney', 'brush', 'compass-drafting');
  CREATE TYPE "public"."enum__pages_v_version_home_process_steps_icon" AS ENUM('hammer', 'arrow-up-right-dots', 'paint-roller', 'screwdriver-wrench', 'lightbulb', 'faucet-drip', 'fan', 'ruler-combined', 'door-open', 'house-chimney', 'brush', 'compass-drafting');
  CREATE TABLE "pages_home_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_home_process_steps_icon"
  );
  
  CREATE TABLE "pages_home_process_steps_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_version_home_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_version_home_process_steps_icon",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_home_process_steps_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_locales" ADD COLUMN "home_process_section_title" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_home_process_section_title" varchar;
  ALTER TABLE "pages_home_process_steps" ADD CONSTRAINT "pages_home_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_home_process_steps_locales" ADD CONSTRAINT "pages_home_process_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_home_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_home_process_steps" ADD CONSTRAINT "_pages_v_version_home_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_home_process_steps_locales" ADD CONSTRAINT "_pages_v_version_home_process_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_version_home_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_home_process_steps_order_idx" ON "pages_home_process_steps" USING btree ("_order");
  CREATE INDEX "pages_home_process_steps_parent_id_idx" ON "pages_home_process_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_home_process_steps_locales_locale_parent_id_unique" ON "pages_home_process_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_version_home_process_steps_order_idx" ON "_pages_v_version_home_process_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_version_home_process_steps_parent_id_idx" ON "_pages_v_version_home_process_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_version_home_process_steps_locales_locale_parent_id" ON "_pages_v_version_home_process_steps_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_home_process_steps" CASCADE;
  DROP TABLE "pages_home_process_steps_locales" CASCADE;
  DROP TABLE "_pages_v_version_home_process_steps" CASCADE;
  DROP TABLE "_pages_v_version_home_process_steps_locales" CASCADE;
  ALTER TABLE "pages_locales" DROP COLUMN "home_process_section_title";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_home_process_section_title";
  DROP TYPE "public"."enum_pages_home_process_steps_icon";
  DROP TYPE "public"."enum__pages_v_version_home_process_steps_icon";`)
}
