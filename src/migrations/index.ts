import * as migration_20260902_120907_initial from './20260902_120907_initial'
import * as migration_20260903_121437_pages from './20260903_121437_pages'
import * as migration_20260903_131719_drop_is_home from './20260903_131719_drop_is_home'

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
]
