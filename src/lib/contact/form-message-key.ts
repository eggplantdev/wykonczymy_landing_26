import { getTranslations, i18n, type TranslationKeyT } from '@/lib/i18n/i18n'

export type FormMessageKeyT = TranslationKeyT<'form'>

// The default locale is the source of truth for the key set — `TranslationsT` is
// `typeof pl`, so every other locale is forced to match it structurally.
const MESSAGE_KEYS = getTranslations(i18n.defaultLocale).form

// The schema travels between a client component and a server action, so it carries
// translation keys rather than sentences: each side resolves them with its own
// accessor. Narrowing through this helper turns a mistyped key into a compile error
// instead of a raw key rendered at the visitor.
export const messageKey = (key: FormMessageKeyT): string => key

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
