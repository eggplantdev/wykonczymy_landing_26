import * as migration_20260902_120907_initial from './20260902_120907_initial'
import * as migration_20260903_121437_pages from './20260903_121437_pages'
import * as migration_20260903_131719_drop_is_home from './20260903_131719_drop_is_home'
import * as migration_20260904_143242_drop_offer_page_type from './20260904_143242_drop_offer_page_type'

export const migrations = [
  {
    up: migration_20260902_120907_initial.up,
    down: migration_20260902_120907_initial.down,
    name: '20260902_120907_initial',
  },
  {
    up: migration_20260903_121437_pages.up,
    down: migration_20260903_121437_pages.down,
    name: '20260903_121437_pages',
  },
  {
    up: migration_20260903_131719_drop_is_home.up,
    down: migration_20260903_131719_drop_is_home.down,
    name: '20260903_131719_drop_is_home',
  },
  {
    up: migration_20260904_143242_drop_offer_page_type.up,
    down: migration_20260904_143242_drop_offer_page_type.down,
    name: '20260904_143242_drop_offer_page_type',
  },
]
