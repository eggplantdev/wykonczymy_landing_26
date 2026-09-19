import { describe, expect, it } from 'vitest'

import {
  LONG_FIELD_MAX_LENGTH,
  SHORT_FIELD_MAX_LENGTH,
  contactSchema,
  emptyContactValues,
  firstIssueKey,
} from '@/lib/contact/contact-schema'
import { getTranslations, i18n, type Locale } from '@/lib/i18n/i18n'

function issuesFor(values: Record<string, unknown>) {
  const result = contactSchema.safeParse(values)
  if (result.success) return []
  return result.error.issues
}

const validValues = { ...emptyContactValues(), email: 'jan@example.com', acceptsTerms: true }

const CAPS = {
  name: SHORT_FIELD_MAX_LENGTH,
  email: SHORT_FIELD_MAX_LENGTH,
  phone: SHORT_FIELD_MAX_LENGTH,
  scope: LONG_FIELD_MAX_LENGTH,
  area: SHORT_FIELD_MAX_LENGTH,
  message: LONG_FIELD_MAX_LENGTH,
} as const

describe('contactSchema', () => {
  it('accepts an e-mail address and consent with every other field empty', () => {
    expect(contactSchema.safeParse(validValues).success).toBe(true)
  })

  it('rejects an empty e-mail address as required', () => {
    const issues = issuesFor({ ...validValues, email: '' })
    expect(issues.map((issue) => issue.message)).toContain('required')
  })

  // `trim().min(1).pipe(email())` only reports `required` for whitespace because the
  // trim runs first; without it a space-only address would fail as malformed instead.
  it('treats a whitespace-only e-mail address as missing, not malformed', () => {
    const issues = issuesFor({ ...validValues, email: '   ' })
    expect(issues.map((issue) => issue.message)).toContain('required')
  })

  it('rejects a malformed e-mail address', () => {
    const issues = issuesFor({ ...validValues, email: 'jan@' })
    expect(issues.map((issue) => issue.message)).toContain('invalidEmail')
  })

  it('rejects an unticked consent box', () => {
    const issues = issuesFor({ ...validValues, acceptsTerms: false })
    expect(issues.some((issue) => issue.path[0] === 'acceptsTerms')).toBe(true)
  })

  // Nothing caps these on the way in, so the schema is the only ceiling that holds against
  // a direct POST to the server action.
  it.each(Object.entries(CAPS))('rejects an over-long %s', (field, max) => {
    const issues = issuesFor({ ...validValues, [field]: 'a'.repeat(max + 1) })
    expect(issues.map((issue) => issue.message)).toContain('tooLong')
  })

  // Enumerating the fields above is what lets each one assert its own cap, and it is also
  // how a newly added field silently ships uncapped. This walks the value shape instead, so
  // the omission is a red test rather than an unbounded public endpoint.
  it('caps every string field the schema carries', () => {
    const stringFields = Object.entries(emptyContactValues())
      .filter(([, value]) => typeof value === 'string')
      .map(([field]) => field)

    expect(Object.keys(CAPS).sort()).toEqual(stringFields.sort())
  })

  // The schema carries translation keys rather than sentences, so the contract that
  // can silently break is a key with no entry behind it — in either locale.
  it.each(i18n.locales as readonly Locale[])('emits keys that exist in %s', (locale) => {
    const messages = getTranslations(locale).form

    const emitted = [
      ...issuesFor({ ...validValues, email: '' }),
      ...issuesFor({ ...validValues, email: 'jan@' }),
      ...issuesFor({ ...validValues, acceptsTerms: false }),
      ...issuesFor({ ...validValues, message: 'a'.repeat(LONG_FIELD_MAX_LENGTH + 1) }),
    ].map((issue) => issue.message)

    expect(emitted.length).toBeGreaterThan(0)
    for (const key of emitted) {
      expect(messages).toHaveProperty(key)
    }
  })
})

describe('firstIssueKey', () => {
  it('reads the key out of a Standard Schema issue', () => {
    expect(firstIssueKey(issuesFor({ ...validValues, email: '' }))).toBe('required')
  })

  it('has no key to report when nothing failed', () => {
    expect(firstIssueKey([])).toBeUndefined()
  })

  // A rule without an explicit `error` emits Zod's own English sentence. Reporting it
  // would put "Invalid input: expected string" in front of a Polish visitor.
  it('refuses a message that is not one of our keys', () => {
    expect(firstIssueKey([{ message: 'Invalid input: expected string' }])).toBeUndefined()
  })

  it('has no key to report when the first issue is absent', () => {
    expect(firstIssueKey([undefined])).toBeUndefined()
  })
})
