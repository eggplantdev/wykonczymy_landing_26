import { describe, expect, it } from 'vitest'

import {
  MESSAGE_MAX_LENGTH,
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

  it('rejects a message past the maximum length', () => {
    const issues = issuesFor({ ...validValues, message: 'a'.repeat(MESSAGE_MAX_LENGTH + 1) })
    expect(issues.map((issue) => issue.message)).toContain('tooLong')
  })

  // The schema carries translation keys rather than sentences, so the contract that
  // can silently break is a key with no entry behind it — in either locale.
  it.each(i18n.locales as readonly Locale[])('emits keys that exist in %s', (locale) => {
    const messages = getTranslations(locale).form

    const emitted = [
      ...issuesFor({ ...validValues, email: '' }),
      ...issuesFor({ ...validValues, email: 'jan@' }),
      ...issuesFor({ ...validValues, acceptsTerms: false }),
      ...issuesFor({ ...validValues, message: 'a'.repeat(MESSAGE_MAX_LENGTH + 1) }),
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
