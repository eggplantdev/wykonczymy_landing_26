import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_home_services_cards_icon" AS ENUM('hammer', 'arrow-up-right-dots', 'paint-roller', 'screwdriver-wrench', 'lightbulb', 'faucet-drip', 'fan', 'ruler-combined', 'door-open', 'house-chimney', 'brush', 'compass-drafting');
  CREATE TYPE "public"."enum__pages_v_version_home_services_cards_icon" AS ENUM('hammer', 'arrow-up-right-dots', 'paint-roller', 'screwdriver-wrench', 'lightbulb', 'faucet-drip', 'fan', 'ruler-combined', 'door-open', 'house-chimney', 'brush', 'compass-drafting');
  ALTER TABLE "pages_home_services_cards" ADD COLUMN "icon" "enum_pages_home_services_cards_icon";
  ALTER TABLE "_pages_v_version_home_services_cards" ADD COLUMN "icon" "enum__pages_v_version_home_services_cards_icon";`)

  // The twelve cards already on the page were drawn by row order before the field existed, so
  // the same order fills it in — otherwise the first save of an untouched page fails validation
  // on a required field nobody ever left empty.
  const seeded = sql`ARRAY['hammer', 'arrow-up-right-dots', 'paint-roller', 'screwdriver-wrench', 'lightbulb', 'faucet-drip', 'fan', 'ruler-combined', 'door-open', 'house-chimney', 'brush', 'compass-drafting']`

  await db.execute(sql`
    UPDATE "pages_home_services_cards"
    SET "icon" = (${seeded})[_order]::"enum_pages_home_services_cards_icon"
    WHERE _order BETWEEN 1 AND 12;
    UPDATE "_pages_v_version_home_services_cards"
    SET "icon" = (${seeded})[_order]::"enum__pages_v_version_home_services_cards_icon"
    WHERE _order BETWEEN 1 AND 12;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_home_services_cards" DROP COLUMN "icon";
  ALTER TABLE "_pages_v_version_home_services_cards" DROP COLUMN "icon";
  DROP TYPE "public"."enum_pages_home_services_cards_icon";
  DROP TYPE "public"."enum__pages_v_version_home_services_cards_icon";`)
}
