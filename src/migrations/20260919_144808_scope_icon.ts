import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_scope_icon" AS ENUM('check', 'bolt', 'fire', 'faucet', 'sink', 'bath', 'shower', 'layer-group', 'table-cells-large', 'grip-lines', 'trowel-bricks', 'paint-roller', 'brush', 'kitchen-set', 'door-open', 'window-maximize', 'lightbulb', 'fan', 'hammer', 'screwdriver-wrench', 'ruler-combined');
  CREATE TYPE "public"."enum__projects_v_version_scope_icon" AS ENUM('check', 'bolt', 'fire', 'faucet', 'sink', 'bath', 'shower', 'layer-group', 'table-cells-large', 'grip-lines', 'trowel-bricks', 'paint-roller', 'brush', 'kitchen-set', 'door-open', 'window-maximize', 'lightbulb', 'fan', 'hammer', 'screwdriver-wrench', 'ruler-combined');
  ALTER TABLE "projects_scope" ADD COLUMN "icon" "enum_projects_scope_icon" DEFAULT 'check';
  ALTER TABLE "_projects_v_version_scope" ADD COLUMN "icon" "enum__projects_v_version_scope_icon" DEFAULT 'check';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_scope" DROP COLUMN "icon";
  ALTER TABLE "_projects_v_version_scope" DROP COLUMN "icon";
  DROP TYPE "public"."enum_projects_scope_icon";
  DROP TYPE "public"."enum__projects_v_version_scope_icon";`)
}
