import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_home_hero_cta_link" AS ENUM('home', 'completed-works', 'interior-styles', 'contact', 'price-list');
  CREATE TYPE "public"."enum_pages_home_intro_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_home_projects_cta_link" AS ENUM('home', 'completed-works', 'interior-styles', 'contact', 'price-list');
  CREATE TYPE "public"."enum_pages_home_interior_styles_cta_link" AS ENUM('home', 'completed-works', 'interior-styles', 'contact', 'price-list');
  CREATE TYPE "public"."enum__pages_v_version_home_hero_cta_link" AS ENUM('home', 'completed-works', 'interior-styles', 'contact', 'price-list');
  CREATE TYPE "public"."enum__pages_v_version_home_intro_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_version_home_projects_cta_link" AS ENUM('home', 'completed-works', 'interior-styles', 'contact', 'price-list');
  CREATE TYPE "public"."enum__pages_v_version_home_interior_styles_cta_link" AS ENUM('home', 'completed-works', 'interior-styles', 'contact', 'price-list');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_published_locale" AS ENUM('pl', 'en');
  CREATE TYPE "public"."enum_interior_styles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__interior_styles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__interior_styles_v_published_locale" AS ENUM('pl', 'en');
  CREATE TABLE "pages_home_services_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"video_id" integer
  );
  
  CREATE TABLE "pages_home_services_cards_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_home_numbers_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric
  );
  
  CREATE TABLE "pages_home_numbers_cards_locales" (
  	"unit" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_version_home_services_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"video_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_home_services_cards_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_version_home_numbers_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_home_numbers_cards_locales" (
  	"unit" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_scope" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "projects_materials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"price" varchar,
  	"area" varchar,
  	"duration" varchar,
  	"address" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_projects_v_version_scope" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_materials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__projects_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_projects_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_price" varchar,
  	"version_area" varchar,
  	"version_duration" varchar,
  	"version_address" varchar,
  	"version_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "interior_styles_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"paragraph" varchar
  );
  
  CREATE TABLE "interior_styles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"content_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_interior_styles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "interior_styles_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "interior_styles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_interior_styles_v_version_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"paragraph" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_interior_styles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_image_id" integer,
  	"version_content_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__interior_styles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__interior_styles_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_interior_styles_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_interior_styles_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"mail" varchar NOT NULL,
  	"avatar_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_locales" (
  	"title" varchar NOT NULL,
  	"intro" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages" ADD COLUMN "home_hero_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "home_hero_video_id" integer;
  ALTER TABLE "pages" ADD COLUMN "home_hero_cta_link" "enum_pages_home_hero_cta_link";
  ALTER TABLE "pages" ADD COLUMN "home_intro_position" "enum_pages_home_intro_position" DEFAULT 'left';
  ALTER TABLE "pages" ADD COLUMN "home_projects_cta_link" "enum_pages_home_projects_cta_link";
  ALTER TABLE "pages" ADD COLUMN "home_interior_styles_cta_link" "enum_pages_home_interior_styles_cta_link";
  ALTER TABLE "pages" ADD COLUMN "home_featured_project_project_id" integer;
  ALTER TABLE "pages_locales" ADD COLUMN "home_hero_title" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "home_hero_cta_label" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "home_intro_text" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "home_services_section_title" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "home_projects_section_title" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "home_projects_cta_label" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "home_numbers_section_title" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "home_interior_styles_section_title" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "home_interior_styles_cta_label" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "home_featured_project_section_title" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "home_featured_project_cta_label" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_home_hero_image_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_home_hero_video_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_home_hero_cta_link" "enum__pages_v_version_home_hero_cta_link";
  ALTER TABLE "_pages_v" ADD COLUMN "version_home_intro_position" "enum__pages_v_version_home_intro_position" DEFAULT 'left';
  ALTER TABLE "_pages_v" ADD COLUMN "version_home_projects_cta_link" "enum__pages_v_version_home_projects_cta_link";
  ALTER TABLE "_pages_v" ADD COLUMN "version_home_interior_styles_cta_link" "enum__pages_v_version_home_interior_styles_cta_link";
  ALTER TABLE "_pages_v" ADD COLUMN "version_home_featured_project_project_id" integer;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_home_hero_title" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_home_hero_cta_label" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_home_intro_text" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_home_services_section_title" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_home_projects_section_title" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_home_projects_cta_label" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_home_numbers_section_title" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_home_interior_styles_section_title" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_home_interior_styles_cta_label" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_home_featured_project_section_title" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_home_featured_project_cta_label" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "interior_styles_id" integer;
  ALTER TABLE "pages_home_services_cards" ADD CONSTRAINT "pages_home_services_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_home_services_cards" ADD CONSTRAINT "pages_home_services_cards_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_home_services_cards" ADD CONSTRAINT "pages_home_services_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_home_services_cards_locales" ADD CONSTRAINT "pages_home_services_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_home_services_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_home_numbers_cards" ADD CONSTRAINT "pages_home_numbers_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_home_numbers_cards_locales" ADD CONSTRAINT "pages_home_numbers_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_home_numbers_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_home_services_cards" ADD CONSTRAINT "_pages_v_version_home_services_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_home_services_cards" ADD CONSTRAINT "_pages_v_version_home_services_cards_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_home_services_cards" ADD CONSTRAINT "_pages_v_version_home_services_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_home_services_cards_locales" ADD CONSTRAINT "_pages_v_version_home_services_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_version_home_services_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_home_numbers_cards" ADD CONSTRAINT "_pages_v_version_home_numbers_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_home_numbers_cards_locales" ADD CONSTRAINT "_pages_v_version_home_numbers_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_version_home_numbers_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_scope" ADD CONSTRAINT "projects_scope_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_materials" ADD CONSTRAINT "projects_materials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_scope" ADD CONSTRAINT "_projects_v_version_scope_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_materials" ADD CONSTRAINT "_projects_v_version_materials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_locales" ADD CONSTRAINT "_projects_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "interior_styles_body" ADD CONSTRAINT "interior_styles_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."interior_styles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "interior_styles" ADD CONSTRAINT "interior_styles_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "interior_styles" ADD CONSTRAINT "interior_styles_content_image_id_media_id_fk" FOREIGN KEY ("content_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "interior_styles_locales" ADD CONSTRAINT "interior_styles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."interior_styles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "interior_styles_rels" ADD CONSTRAINT "interior_styles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."interior_styles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "interior_styles_rels" ADD CONSTRAINT "interior_styles_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_interior_styles_v_version_body" ADD CONSTRAINT "_interior_styles_v_version_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_interior_styles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_interior_styles_v" ADD CONSTRAINT "_interior_styles_v_parent_id_interior_styles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."interior_styles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_interior_styles_v" ADD CONSTRAINT "_interior_styles_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_interior_styles_v" ADD CONSTRAINT "_interior_styles_v_version_content_image_id_media_id_fk" FOREIGN KEY ("version_content_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_interior_styles_v_locales" ADD CONSTRAINT "_interior_styles_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_interior_styles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_interior_styles_v_rels" ADD CONSTRAINT "_interior_styles_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_interior_styles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_interior_styles_v_rels" ADD CONSTRAINT "_interior_styles_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_home_services_cards_order_idx" ON "pages_home_services_cards" USING btree ("_order");
  CREATE INDEX "pages_home_services_cards_parent_id_idx" ON "pages_home_services_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_home_services_cards_image_idx" ON "pages_home_services_cards" USING btree ("image_id");
  CREATE INDEX "pages_home_services_cards_video_idx" ON "pages_home_services_cards" USING btree ("video_id");
  CREATE UNIQUE INDEX "pages_home_services_cards_locales_locale_parent_id_unique" ON "pages_home_services_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_home_numbers_cards_order_idx" ON "pages_home_numbers_cards" USING btree ("_order");
  CREATE INDEX "pages_home_numbers_cards_parent_id_idx" ON "pages_home_numbers_cards" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_home_numbers_cards_locales_locale_parent_id_unique" ON "pages_home_numbers_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_version_home_services_cards_order_idx" ON "_pages_v_version_home_services_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_version_home_services_cards_parent_id_idx" ON "_pages_v_version_home_services_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_home_services_cards_image_idx" ON "_pages_v_version_home_services_cards" USING btree ("image_id");
  CREATE INDEX "_pages_v_version_home_services_cards_video_idx" ON "_pages_v_version_home_services_cards" USING btree ("video_id");
  CREATE UNIQUE INDEX "_pages_v_version_home_services_cards_locales_locale_parent_i" ON "_pages_v_version_home_services_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_version_home_numbers_cards_order_idx" ON "_pages_v_version_home_numbers_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_version_home_numbers_cards_parent_id_idx" ON "_pages_v_version_home_numbers_cards" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_version_home_numbers_cards_locales_locale_parent_id" ON "_pages_v_version_home_numbers_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_scope_order_idx" ON "projects_scope" USING btree ("_order");
  CREATE INDEX "projects_scope_parent_id_idx" ON "projects_scope" USING btree ("_parent_id");
  CREATE INDEX "projects_scope_locale_idx" ON "projects_scope" USING btree ("_locale");
  CREATE INDEX "projects_materials_order_idx" ON "projects_materials" USING btree ("_order");
  CREATE INDEX "projects_materials_parent_id_idx" ON "projects_materials" USING btree ("_parent_id");
  CREATE INDEX "projects_materials_locale_idx" ON "projects_materials" USING btree ("_locale");
  CREATE INDEX "projects_image_idx" ON "projects" USING btree ("image_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "projects_slug_idx" ON "projects_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_media_id_idx" ON "projects_rels" USING btree ("media_id");
  CREATE INDEX "_projects_v_version_scope_order_idx" ON "_projects_v_version_scope" USING btree ("_order");
  CREATE INDEX "_projects_v_version_scope_parent_id_idx" ON "_projects_v_version_scope" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_scope_locale_idx" ON "_projects_v_version_scope" USING btree ("_locale");
  CREATE INDEX "_projects_v_version_materials_order_idx" ON "_projects_v_version_materials" USING btree ("_order");
  CREATE INDEX "_projects_v_version_materials_parent_id_idx" ON "_projects_v_version_materials" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_materials_locale_idx" ON "_projects_v_version_materials" USING btree ("_locale");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_image_idx" ON "_projects_v" USING btree ("version_image_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_snapshot_idx" ON "_projects_v" USING btree ("snapshot");
  CREATE INDEX "_projects_v_published_locale_idx" ON "_projects_v" USING btree ("published_locale");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_projects_v_locales_locale_parent_id_unique" ON "_projects_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_rels_order_idx" ON "_projects_v_rels" USING btree ("order");
  CREATE INDEX "_projects_v_rels_parent_idx" ON "_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projects_v_rels_path_idx" ON "_projects_v_rels" USING btree ("path");
  CREATE INDEX "_projects_v_rels_media_id_idx" ON "_projects_v_rels" USING btree ("media_id");
  CREATE INDEX "interior_styles_body_order_idx" ON "interior_styles_body" USING btree ("_order");
  CREATE INDEX "interior_styles_body_parent_id_idx" ON "interior_styles_body" USING btree ("_parent_id");
  CREATE INDEX "interior_styles_body_locale_idx" ON "interior_styles_body" USING btree ("_locale");
  CREATE INDEX "interior_styles_image_idx" ON "interior_styles" USING btree ("image_id");
  CREATE INDEX "interior_styles_content_image_idx" ON "interior_styles" USING btree ("content_image_id");
  CREATE INDEX "interior_styles_updated_at_idx" ON "interior_styles" USING btree ("updated_at");
  CREATE INDEX "interior_styles_created_at_idx" ON "interior_styles" USING btree ("created_at");
  CREATE INDEX "interior_styles__status_idx" ON "interior_styles" USING btree ("_status");
  CREATE INDEX "interior_styles_slug_idx" ON "interior_styles_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "interior_styles_locales_locale_parent_id_unique" ON "interior_styles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "interior_styles_rels_order_idx" ON "interior_styles_rels" USING btree ("order");
  CREATE INDEX "interior_styles_rels_parent_idx" ON "interior_styles_rels" USING btree ("parent_id");
  CREATE INDEX "interior_styles_rels_path_idx" ON "interior_styles_rels" USING btree ("path");
  CREATE INDEX "interior_styles_rels_media_id_idx" ON "interior_styles_rels" USING btree ("media_id");
  CREATE INDEX "_interior_styles_v_version_body_order_idx" ON "_interior_styles_v_version_body" USING btree ("_order");
  CREATE INDEX "_interior_styles_v_version_body_parent_id_idx" ON "_interior_styles_v_version_body" USING btree ("_parent_id");
  CREATE INDEX "_interior_styles_v_version_body_locale_idx" ON "_interior_styles_v_version_body" USING btree ("_locale");
  CREATE INDEX "_interior_styles_v_parent_idx" ON "_interior_styles_v" USING btree ("parent_id");
  CREATE INDEX "_interior_styles_v_version_version_image_idx" ON "_interior_styles_v" USING btree ("version_image_id");
  CREATE INDEX "_interior_styles_v_version_version_content_image_idx" ON "_interior_styles_v" USING btree ("version_content_image_id");
  CREATE INDEX "_interior_styles_v_version_version_updated_at_idx" ON "_interior_styles_v" USING btree ("version_updated_at");
  CREATE INDEX "_interior_styles_v_version_version_created_at_idx" ON "_interior_styles_v" USING btree ("version_created_at");
  CREATE INDEX "_interior_styles_v_version_version__status_idx" ON "_interior_styles_v" USING btree ("version__status");
  CREATE INDEX "_interior_styles_v_created_at_idx" ON "_interior_styles_v" USING btree ("created_at");
  CREATE INDEX "_interior_styles_v_updated_at_idx" ON "_interior_styles_v" USING btree ("updated_at");
  CREATE INDEX "_interior_styles_v_snapshot_idx" ON "_interior_styles_v" USING btree ("snapshot");
  CREATE INDEX "_interior_styles_v_published_locale_idx" ON "_interior_styles_v" USING btree ("published_locale");
  CREATE INDEX "_interior_styles_v_latest_idx" ON "_interior_styles_v" USING btree ("latest");
  CREATE INDEX "_interior_styles_v_version_version_slug_idx" ON "_interior_styles_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_interior_styles_v_locales_locale_parent_id_unique" ON "_interior_styles_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_interior_styles_v_rels_order_idx" ON "_interior_styles_v_rels" USING btree ("order");
  CREATE INDEX "_interior_styles_v_rels_parent_idx" ON "_interior_styles_v_rels" USING btree ("parent_id");
  CREATE INDEX "_interior_styles_v_rels_path_idx" ON "_interior_styles_v_rels" USING btree ("path");
  CREATE INDEX "_interior_styles_v_rels_media_id_idx" ON "_interior_styles_v_rels" USING btree ("media_id");
  CREATE INDEX "footer_avatar_idx" ON "footer" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_home_hero_image_id_media_id_fk" FOREIGN KEY ("home_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_home_hero_video_id_media_id_fk" FOREIGN KEY ("home_hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_home_featured_project_project_id_projects_id_fk" FOREIGN KEY ("home_featured_project_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_home_hero_image_id_media_id_fk" FOREIGN KEY ("version_home_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_home_hero_video_id_media_id_fk" FOREIGN KEY ("version_home_hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_home_featured_project_project_id_projects_id_fk" FOREIGN KEY ("version_home_featured_project_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_interior_styles_fk" FOREIGN KEY ("interior_styles_id") REFERENCES "public"."interior_styles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_home_hero_home_hero_image_idx" ON "pages" USING btree ("home_hero_image_id");
  CREATE INDEX "pages_home_hero_home_hero_video_idx" ON "pages" USING btree ("home_hero_video_id");
  CREATE INDEX "pages_home_featured_project_home_featured_project_projec_idx" ON "pages" USING btree ("home_featured_project_project_id");
  CREATE INDEX "_pages_v_version_home_hero_version_home_hero_image_idx" ON "_pages_v" USING btree ("version_home_hero_image_id");
  CREATE INDEX "_pages_v_version_home_hero_version_home_hero_video_idx" ON "_pages_v" USING btree ("version_home_hero_video_id");
  CREATE INDEX "_pages_v_version_home_featured_project_version_home_feat_idx" ON "_pages_v" USING btree ("version_home_featured_project_project_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_interior_styles_id_idx" ON "payload_locked_documents_rels" USING btree ("interior_styles_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_home_services_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_home_services_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_home_numbers_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_home_numbers_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_home_services_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_home_services_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_home_numbers_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_home_numbers_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_scope" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_materials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_scope" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_materials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "interior_styles_body" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "interior_styles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "interior_styles_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "interior_styles_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_interior_styles_v_version_body" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_interior_styles_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_interior_styles_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_interior_styles_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_home_services_cards" CASCADE;
  DROP TABLE "pages_home_services_cards_locales" CASCADE;
  DROP TABLE "pages_home_numbers_cards" CASCADE;
  DROP TABLE "pages_home_numbers_cards_locales" CASCADE;
  DROP TABLE "_pages_v_version_home_services_cards" CASCADE;
  DROP TABLE "_pages_v_version_home_services_cards_locales" CASCADE;
  DROP TABLE "_pages_v_version_home_numbers_cards" CASCADE;
  DROP TABLE "_pages_v_version_home_numbers_cards_locales" CASCADE;
  DROP TABLE "projects_scope" CASCADE;
  DROP TABLE "projects_materials" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_locales" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "_projects_v_version_scope" CASCADE;
  DROP TABLE "_projects_v_version_materials" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_locales" CASCADE;
  DROP TABLE "_projects_v_rels" CASCADE;
  DROP TABLE "interior_styles_body" CASCADE;
  DROP TABLE "interior_styles" CASCADE;
  DROP TABLE "interior_styles_locales" CASCADE;
  DROP TABLE "interior_styles_rels" CASCADE;
  DROP TABLE "_interior_styles_v_version_body" CASCADE;
  DROP TABLE "_interior_styles_v" CASCADE;
  DROP TABLE "_interior_styles_v_locales" CASCADE;
  DROP TABLE "_interior_styles_v_rels" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_home_hero_image_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_home_hero_video_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_home_featured_project_project_id_projects_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_home_hero_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_home_hero_video_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_home_featured_project_project_id_projects_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_interior_styles_fk";
  
  DROP INDEX "pages_home_hero_home_hero_image_idx";
  DROP INDEX "pages_home_hero_home_hero_video_idx";
  DROP INDEX "pages_home_featured_project_home_featured_project_projec_idx";
  DROP INDEX "_pages_v_version_home_hero_version_home_hero_image_idx";
  DROP INDEX "_pages_v_version_home_hero_version_home_hero_video_idx";
  DROP INDEX "_pages_v_version_home_featured_project_version_home_feat_idx";
  DROP INDEX "payload_locked_documents_rels_projects_id_idx";
  DROP INDEX "payload_locked_documents_rels_interior_styles_id_idx";
  ALTER TABLE "pages" DROP COLUMN "home_hero_image_id";
  ALTER TABLE "pages" DROP COLUMN "home_hero_video_id";
  ALTER TABLE "pages" DROP COLUMN "home_hero_cta_link";
  ALTER TABLE "pages" DROP COLUMN "home_intro_position";
  ALTER TABLE "pages" DROP COLUMN "home_projects_cta_link";
  ALTER TABLE "pages" DROP COLUMN "home_interior_styles_cta_link";
  ALTER TABLE "pages" DROP COLUMN "home_featured_project_project_id";
  ALTER TABLE "pages_locales" DROP COLUMN "home_hero_title";
  ALTER TABLE "pages_locales" DROP COLUMN "home_hero_cta_label";
  ALTER TABLE "pages_locales" DROP COLUMN "home_intro_text";
  ALTER TABLE "pages_locales" DROP COLUMN "home_services_section_title";
  ALTER TABLE "pages_locales" DROP COLUMN "home_projects_section_title";
  ALTER TABLE "pages_locales" DROP COLUMN "home_projects_cta_label";
  ALTER TABLE "pages_locales" DROP COLUMN "home_numbers_section_title";
  ALTER TABLE "pages_locales" DROP COLUMN "home_interior_styles_section_title";
  ALTER TABLE "pages_locales" DROP COLUMN "home_interior_styles_cta_label";
  ALTER TABLE "pages_locales" DROP COLUMN "home_featured_project_section_title";
  ALTER TABLE "pages_locales" DROP COLUMN "home_featured_project_cta_label";
  ALTER TABLE "_pages_v" DROP COLUMN "version_home_hero_image_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_home_hero_video_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_home_hero_cta_link";
  ALTER TABLE "_pages_v" DROP COLUMN "version_home_intro_position";
  ALTER TABLE "_pages_v" DROP COLUMN "version_home_projects_cta_link";
  ALTER TABLE "_pages_v" DROP COLUMN "version_home_interior_styles_cta_link";
  ALTER TABLE "_pages_v" DROP COLUMN "version_home_featured_project_project_id";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_home_hero_title";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_home_hero_cta_label";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_home_intro_text";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_home_services_section_title";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_home_projects_section_title";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_home_projects_cta_label";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_home_numbers_section_title";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_home_interior_styles_section_title";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_home_interior_styles_cta_label";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_home_featured_project_section_title";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_home_featured_project_cta_label";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "interior_styles_id";
  DROP TYPE "public"."enum_pages_home_hero_cta_link";
  DROP TYPE "public"."enum_pages_home_intro_position";
  DROP TYPE "public"."enum_pages_home_projects_cta_link";
  DROP TYPE "public"."enum_pages_home_interior_styles_cta_link";
  DROP TYPE "public"."enum__pages_v_version_home_hero_cta_link";
  DROP TYPE "public"."enum__pages_v_version_home_intro_position";
  DROP TYPE "public"."enum__pages_v_version_home_projects_cta_link";
  DROP TYPE "public"."enum__pages_v_version_home_interior_styles_cta_link";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum__projects_v_published_locale";
  DROP TYPE "public"."enum_interior_styles_status";
  DROP TYPE "public"."enum__interior_styles_v_version_status";
  DROP TYPE "public"."enum__interior_styles_v_published_locale";`)
}
