// Named imports, not the `z` barrel. This is the only module that puts Zod in the client
// bundle and the footer renders on every route, so the barrel's ~30 locale error maps and
// unused schema classes ship everywhere: Turbopack does not shake them out, and swapping
// the import form cut the gzipped client chunks from 970,660 to 913,397 bytes.
import { boolean, email, object, string } from 'zod'
import type { z } from 'zod'

import { getTranslations, i18n, type TranslationKeyT } from '@/lib/i18n/i18n'

export type FormMessageKeyT = TranslationKeyT<'form'>

// The default locale is the source of truth for the key set — `TranslationsT` is
// `typeof pl`, so every other locale is forced to match it structurally.
const MESSAGE_KEYS = getTranslations(i18n.defaultLocale).form

// The schema travels between a client component and a server action, so it carries
// translation keys rather than sentences: each side resolves them with its own
// accessor. Narrowing through this helper turns a mistyped key into a compile error
// instead of a raw key rendered at the visitor.
const messageKey = (key: FormMessageKeyT): string => key

export const MESSAGE_MAX_LENGTH = 5000

export const contactSchema = object({
  name: string().trim(),
  email: string()
    .trim()
    .min(1, { error: messageKey('required') })
    .pipe(email({ error: messageKey('invalidEmail') })),
  phone: string().trim(),
  scope: string().trim(),
  area: string().trim(),
  message: string()
    .trim()
    .max(MESSAGE_MAX_LENGTH, { error: messageKey('tooLong') }),
  // `.refine` rather than `literal(true)` so the schema's input type stays `boolean`:
  // the form holds an unticked box as `false`, and a schema that only accepts `true`
  // would not type-check against those values.
  acceptsTerms: boolean().refine((value) => value, { error: messageKey('required') }),
})

export type ContactFormValuesT = z.infer<typeof contactSchema>

// The other half of `messageKey`. Both callers hand it issues that satisfy Standard
// Schema's `{ message }` — TanStack's field meta on the client, Zod's own on the server —
// so the parameter is spelled structurally rather than importing either library's type.
export function firstIssueKey(
  issues: readonly ({ message: string } | undefined)[],
): FormMessageKeyT | undefined {
  const message = issues[0]?.message
  if (message === undefined) return undefined

  // A rule without an explicit `error` emits Zod's own English sentence. Returning it
  // would put "Invalid input: expected string" in front of a Polish visitor, so
  // anything that isn't one of our keys is reported as no key at all.
  return isMessageKey(message) ? message : undefined
}

function isMessageKey(value: string): value is FormMessageKeyT {
  return Object.hasOwn(MESSAGE_KEYS, value)
}

export function emptyContactValues(): ContactFormValuesT {
  return { name: '', email: '', phone: '', scope: '', area: '', message: '', acceptsTerms: false }
}
