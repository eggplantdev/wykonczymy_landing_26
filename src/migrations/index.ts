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
import * as migration_20260918_143125_drop_project_price from './20260918_143125_drop_project_price'
import * as migration_20260918_161801_after_services_text from './20260918_161801_after_services_text'
import * as migration_20260918_163821_numbers_value_text from './20260918_163821_numbers_value_text'
import * as migration_20260918_190000_project_cover_from_gallery from './20260918_190000_project_cover_from_gallery'
import * as migration_20260919_092650_services_card_drop_media from './20260919_092650_services_card_drop_media'
import * as migration_20260919_093410_services_card_icon from './20260919_093410_services_card_icon'
import * as migration_20260919_144808_scope_icon from './20260919_144808_scope_icon'
import * as migration_20260919_151151_scope_drop_value from './20260919_151151_scope_drop_value'
import * as migration_20260921_091755_contact_postal_address from './20260921_091755_contact_postal_address'
import * as migration_20260921_101328_media_alt_localized from './20260921_101328_media_alt_localized'
import * as migration_20260921_140715_submissions_queue from './20260921_140715_submissions_queue'

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
  {
    up: migration_20260918_143125_drop_project_price.up,
    down: migration_20260918_143125_drop_project_price.down,
    name: '20260918_143125_drop_project_price',
  },
  {
    up: migration_20260918_161801_after_services_text.up,
    down: migration_20260918_161801_after_services_text.down,
    name: '20260918_161801_after_services_text',
  },
  {
    up: migration_20260918_163821_numbers_value_text.up,
    down: migration_20260918_163821_numbers_value_text.down,
    name: '20260918_163821_numbers_value_text',
  },
  {
    up: migration_20260918_190000_project_cover_from_gallery.up,
    down: migration_20260918_190000_project_cover_from_gallery.down,
    name: '20260918_190000_project_cover_from_gallery',
  },
  {
    up: migration_20260919_092650_services_card_drop_media.up,
    down: migration_20260919_092650_services_card_drop_media.down,
    name: '20260919_092650_services_card_drop_media',
  },
  {
    up: migration_20260919_093410_services_card_icon.up,
    down: migration_20260919_093410_services_card_icon.down,
    name: '20260919_093410_services_card_icon',
  },
  {
    up: migration_20260919_144808_scope_icon.up,
    down: migration_20260919_144808_scope_icon.down,
    name: '20260919_144808_scope_icon',
  },
  {
    up: migration_20260919_151151_scope_drop_value.up,
    down: migration_20260919_151151_scope_drop_value.down,
    name: '20260919_151151_scope_drop_value',
  },
  {
    up: migration_20260921_091755_contact_postal_address.up,
    down: migration_20260921_091755_contact_postal_address.down,
    name: '20260921_091755_contact_postal_address',
  },
  {
    up: migration_20260921_101328_media_alt_localized.up,
    down: migration_20260921_101328_media_alt_localized.down,
    name: '20260921_101328_media_alt_localized',
  },
  {
    up: migration_20260921_140715_submissions_queue.up,
    down: migration_20260921_140715_submissions_queue.down,
    name: '20260921_140715_submissions_queue',
  },
]
