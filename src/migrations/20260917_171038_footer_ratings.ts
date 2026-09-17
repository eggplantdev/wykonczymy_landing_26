import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_footer_ratings_platform" AS ENUM('fixly', 'google');
  CREATE TABLE "footer_ratings" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_footer_ratings_platform" NOT NULL,
  	"rating" numeric NOT NULL,
  	"review_count" numeric,
  	"profile_url" varchar
  );

  ALTER TABLE "footer_ratings" ADD CONSTRAINT "footer_ratings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "footer_ratings_order_idx" ON "footer_ratings" USING btree ("_order");
  CREATE INDEX "footer_ratings_parent_id_idx" ON "footer_ratings" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer_ratings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "footer_ratings" CASCADE;
  DROP TYPE "public"."enum_footer_ratings_platform";`)
}
