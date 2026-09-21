import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

// The postcode is matched by shape rather than by position, because the two locales store the
// same address in different orders — "Warszawa 03-813" against "03-813 Warsaw". Lifting it out
// by pattern and treating whatever is left as the town is what makes one pass serve both.
// `[0-9]` rather than `\d`: this SQL travels through a JS template literal, where `\d` collapses
// to a bare `d` and would silently match nothing.
const POSTAL_CODE = '[0-9]{2}-[0-9]{3}'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" ADD COLUMN "contact_address_postal_code" varchar;
  ALTER TABLE "pages" ADD COLUMN "contact_address_country" varchar DEFAULT 'PL';
  ALTER TABLE "pages_locales" ADD COLUMN "contact_address_street" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "contact_address_locality" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_contact_address_postal_code" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_contact_address_country" varchar DEFAULT 'PL';
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_contact_address_street" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_contact_address_locality" varchar;`)

  // A column DEFAULT only fires for rows inserted afterwards, so 'PL' has to be written onto the
  // existing rows explicitly or every address migrates without a country.
  await db.execute(sql`
    UPDATE "pages_locales" SET
      "contact_address_street" = btrim(split_part("contact_address", ',', 1)),
      "contact_address_locality" = btrim(regexp_replace(
        btrim(split_part("contact_address", ',', 2)), ${sql.raw(`'${POSTAL_CODE}'`)}, ''))
    WHERE "contact_address" IS NOT NULL;

    UPDATE "pages" SET
      "contact_address_postal_code" = source."code",
      "contact_address_country" = 'PL'
    FROM (
      SELECT "_parent_id" AS "id",
             (regexp_match("contact_address", ${sql.raw(`'${POSTAL_CODE}'`)}))[1] AS "code"
      FROM "pages_locales" WHERE "_locale" = 'pl'
    ) AS source
    WHERE "pages"."id" = source."id" AND source."code" IS NOT NULL;

    UPDATE "_pages_v_locales" SET
      "version_contact_address_street" = btrim(split_part("version_contact_address", ',', 1)),
      "version_contact_address_locality" = btrim(regexp_replace(
        btrim(split_part("version_contact_address", ',', 2)), ${sql.raw(`'${POSTAL_CODE}'`)}, ''))
    WHERE "version_contact_address" IS NOT NULL;

    UPDATE "_pages_v" SET
      "version_contact_address_postal_code" = source."code",
      "version_contact_address_country" = 'PL'
    FROM (
      SELECT "_parent_id" AS "id",
             (regexp_match("version_contact_address", ${sql.raw(`'${POSTAL_CODE}'`)}))[1] AS "code"
      FROM "_pages_v_locales" WHERE "_locale" = 'pl'
    ) AS source
    WHERE "_pages_v"."id" = source."id" AND source."code" IS NOT NULL;`)

  await db.execute(sql`
   ALTER TABLE "pages_locales" DROP COLUMN "contact_address";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_contact_address";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_locales" ADD COLUMN "contact_address" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_contact_address" varchar;`)

  // Recomposed rather than left empty, so a rollback returns the address the page was rendering
  // instead of a blank field. The join order is the same convention `formatPostalAddress` applies.
  await db.execute(sql`
    UPDATE "pages_locales" SET "contact_address" = concat_ws(', ',
      nullif("contact_address_street", ''),
      CASE WHEN "_locale" = 'en'
        THEN concat_ws(' ', nullif(parent."contact_address_postal_code", ''), nullif("contact_address_locality", ''))
        ELSE concat_ws(' ', nullif("contact_address_locality", ''), nullif(parent."contact_address_postal_code", ''))
      END)
    FROM "pages" AS parent
    WHERE "pages_locales"."_parent_id" = parent."id";

    UPDATE "_pages_v_locales" SET "version_contact_address" = concat_ws(', ',
      nullif("version_contact_address_street", ''),
      CASE WHEN "_locale" = 'en'
        THEN concat_ws(' ', nullif(parent."version_contact_address_postal_code", ''), nullif("version_contact_address_locality", ''))
        ELSE concat_ws(' ', nullif("version_contact_address_locality", ''), nullif(parent."version_contact_address_postal_code", ''))
      END)
    FROM "_pages_v" AS parent
    WHERE "_pages_v_locales"."_parent_id" = parent."id";

    UPDATE "pages_locales" SET "contact_address" = NULL WHERE "contact_address" = '';
    UPDATE "_pages_v_locales" SET "version_contact_address" = NULL WHERE "version_contact_address" = '';`)

  await db.execute(sql`
   ALTER TABLE "pages" DROP COLUMN "contact_address_postal_code";
  ALTER TABLE "pages" DROP COLUMN "contact_address_country";
  ALTER TABLE "pages_locales" DROP COLUMN "contact_address_street";
  ALTER TABLE "pages_locales" DROP COLUMN "contact_address_locality";
  ALTER TABLE "_pages_v" DROP COLUMN "version_contact_address_postal_code";
  ALTER TABLE "_pages_v" DROP COLUMN "version_contact_address_country";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_contact_address_street";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_contact_address_locality";`)
}
