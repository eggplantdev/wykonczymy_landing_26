// Named imports, not the `z` barrel. This is the only module that puts Zod in the client
// bundle and the footer renders on every route, so the barrel's ~30 locale error maps and
// unused schema classes ship everywhere: Turbopack does not shake them out, and swapping
// the import form cut the gzipped client chunks from 970,660 to 913,397 bytes.
import { boolean, email, object, string } from 'zod'
import type { z } from 'zod'

import { messageKey } from './form-message-key'

// A server action is a public endpoint and no control sets `maxlength`, so these are the
// only ceiling on field length — nothing caps a direct POST on the way in.
export const LONG_FIELD_MAX_LENGTH = 5000
export const SHORT_FIELD_MAX_LENGTH = 200

// Every field is trimmed and capped and only the ceiling differs — and Prettier breaks a
// three-call chain carrying an object argument across three lines, so spelling it out per
// field costs eighteen lines to say one thing six times.
const cappedText = (max: number) =>
  string()
    .trim()
    .max(max, { error: messageKey('tooLong') })

export const contactSchema = object({
  name: cappedText(SHORT_FIELD_MAX_LENGTH),
  email: cappedText(SHORT_FIELD_MAX_LENGTH)
    .min(1, { error: messageKey('required') })
    .pipe(email({ error: messageKey('invalidEmail') })),
  phone: cappedText(SHORT_FIELD_MAX_LENGTH),
  address: cappedText(SHORT_FIELD_MAX_LENGTH),
  scope: cappedText(LONG_FIELD_MAX_LENGTH),
  area: cappedText(SHORT_FIELD_MAX_LENGTH),
  message: cappedText(LONG_FIELD_MAX_LENGTH),
  // `.refine` rather than `literal(true)` so the schema's input type stays `boolean`:
  // the form holds an unticked box as `false`, and a schema that only accepts `true`
  // would not type-check against those values.
  acceptsTerms: boolean().refine((value) => value, { error: messageKey('required') }),
})

export type ContactFormValuesT = z.infer<typeof contactSchema>

export function emptyContactValues(): ContactFormValuesT {
  return {
    name: '',
    email: '',
    phone: '',
    address: '',
    scope: '',
    area: '',
    message: '',
    acceptsTerms: false,
  }
}
