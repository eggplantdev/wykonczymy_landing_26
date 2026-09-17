'use server'

import { contactSchema, firstIssueKey, type FormMessageKeyT } from './contact-schema'

export type ContactSubmitResultT = { ok: true } | { ok: false; errorKey: FormMessageKeyT }

export async function submitContactForm(input: unknown): Promise<ContactSubmitResultT> {
  // The client already ran this schema, which is exactly why it is re-run here: a
  // server action is a public endpoint and the browser's types prove nothing.
  const parsed = contactSchema.safeParse(input)

  if (!parsed.success) {
    // A key, not a sentence: the action has no locale of its own, and answering in one
    // would make it a second owner of key-to-sentence that could drift from the form's.
    return { ok: false, errorKey: firstIssueKey(parsed.error.issues) ?? 'error' }
  }

  // No sink yet — where a submission is delivered is the next change.
  return { ok: true }
}
