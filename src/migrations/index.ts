import * as migration_20260902_120907_initial from './20260902_120907_initial';

export const migrations = [
  {
    up: migration_20260902_120907_initial.up,
    down: migration_20260902_120907_initial.down,
    name: '20260902_120907_initial'
  },
];
