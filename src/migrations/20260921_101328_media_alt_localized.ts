import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

// Hand-edited after `migrate:create`: the generated SQL dropped `media.alt` without carrying the
// 141 existing strings across. Regenerate it and they are gone.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");

  INSERT INTO "media_locales" ("alt", "_locale", "_parent_id")
  SELECT "alt", 'pl'::"_locales", "id" FROM "media";

  ALTER TABLE "media" DROP COLUMN "alt";`)
}

// Loses every English alt — one column, nowhere to put them. Take `pnpm db:dump` first.
// Polish is preferred, not required: an EN-only photo would otherwise NULL out and abort the
// `SET NOT NULL`, taking the whole rollback with it.
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "media" ADD COLUMN "alt" varchar;

  UPDATE "media" SET "alt" = source."alt"
  FROM (
    SELECT DISTINCT ON ("_parent_id") "_parent_id", "alt"
    FROM "media_locales"
    ORDER BY "_parent_id", ("_locale" = 'pl') DESC
  ) source
  WHERE source."_parent_id" = "media"."id";

  UPDATE "media" SET "alt" = '' WHERE "alt" IS NULL;

  ALTER TABLE "media" ALTER COLUMN "alt" SET NOT NULL;

  DROP TABLE "media_locales" CASCADE;`)
}
