import * as migration_20260902_120907_initial from './20260902_120907_initial'
import * as migration_20260903_121437_pages from './20260903_121437_pages'
import * as migration_20260903_131719_drop_is_home from './20260903_131719_drop_is_home'
import * as migration_20260904_143242_drop_offer_page_type from './20260904_143242_drop_offer_page_type'
import * as migration_20260904_161730_content_collections from './20260904_161730_content_collections'
import * as migration_20260904_171708_seo_meta_and_slug_unique from './20260904_171708_seo_meta_and_slug_unique'
import * as migration_20260917_160110_testimonials from './20260917_160110_testimonials'
import * as migration_20260917_163304_drop_featured_project from './20260917_163304_drop_featured_project'
import * as migration_20260917_171038_footer_ratings from './20260917_171038_footer_ratings'
import * as migration_20260917_171404_contact_details from './20260917_171404_contact_details'
import * as migration_20260917_173902_testimonial_rich_text from './20260917_173902_testimonial_rich_text'
import * as migration_20260917_184739_legal_pages from './20260917_184739_legal_pages'

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
  {
    up: migration_20260904_161730_content_collections.up,
    down: migration_20260904_161730_content_collections.down,
    name: '20260904_161730_content_collections',
  },
  {
    up: migration_20260904_171708_seo_meta_and_slug_unique.up,
    down: migration_20260904_171708_seo_meta_and_slug_unique.down,
    name: '20260904_171708_seo_meta_and_slug_unique',
  },
  {
    up: migration_20260917_160110_testimonials.up,
    down: migration_20260917_160110_testimonials.down,
    name: '20260917_160110_testimonials',
  },
  {
    up: migration_20260917_163304_drop_featured_project.up,
    down: migration_20260917_163304_drop_featured_project.down,
    name: '20260917_163304_drop_featured_project',
  },
  {
    up: migration_20260917_171038_footer_ratings.up,
    down: migration_20260917_171038_footer_ratings.down,
    name: '20260917_171038_footer_ratings',
  },
  {
    up: migration_20260917_171404_contact_details.up,
    down: migration_20260917_171404_contact_details.down,
    name: '20260917_171404_contact_details',
  },
  {
    up: migration_20260917_173902_testimonial_rich_text.up,
    down: migration_20260917_173902_testimonial_rich_text.down,
    name: '20260917_173902_testimonial_rich_text',
  },
  {
    up: migration_20260917_184739_legal_pages.up,
    down: migration_20260917_184739_legal_pages.down,
    name: '20260917_184739_legal_pages',
  },
]
