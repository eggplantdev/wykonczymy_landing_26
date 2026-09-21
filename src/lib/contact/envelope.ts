import { getTranslations, i18n } from '@/lib/i18n/i18n'
import type { ContactFormValuesT } from './contact-schema'

// What the leads app records as the form's identity. It has no form registry of its own for
// landing submissions, so these two strings are the whole of what „which form was this" means.
export const FORM_ID = 'wycena'
export const FORM_NAME = 'Formularz wyceny'

export type SubmissionAssetT = {
  url: string
  filename: string
  contentType: string
  size: number
}

export type SubmissionEnvelopeT = {
  submissionId: string
  submittedAt: string
  formId: string
  formName: string
  name?: string
  email?: string
  phone?: string
  address?: string
  scope?: string
  area?: string
  message?: string
  /** The same answers again, in the shape `buildLeadAnswers` already renders. */
  rawData: { name: string; values: string[] }[]
  formQuestions: { key: string; label: string }[]
  assets: SubmissionAssetT[]
}

// Ordered as the form asks them, because this order is what the answers dialog renders.
// `acceptsTerms` is consent, not an answer, so it never travels.
const ANSWER_FIELDS = [
  'name',
  'email',
  'phone',
  'address',
  'scope',
  'area',
  'message',
] as const satisfies readonly (keyof ContactFormValuesT)[]

// The default dictionary, for every visitor: the Server Action has no locale of its own since
// `locale` was dropped from the wire (decision 2026-09-21), and the person reading the answers
// dialog is a Polish salesperson either way.
const LABELS = getTranslations(i18n.defaultLocale).form

type BuildArgsT = {
  values: ContactFormValuesT
  submissionId: string
  assets: SubmissionAssetT[]
  submittedAt?: string
}

/**
 * The wire shape both repos agree on (`context/reference/landing-intake-contract.md`), pinned by
 * the shared fixture. Typed answers are for filtering and promotion on the far side; `rawData` and
 * `formQuestions` are the self-describing tail that lets a new question render there with no
 * deploy. The duplication is the contract, not an oversight.
 */
export function buildEnvelope({
  values,
  submissionId,
  assets,
  submittedAt = new Date().toISOString(),
}: BuildArgsT): SubmissionEnvelopeT {
  // An empty answer is omitted rather than sent as an empty string, so the far side's answer
  // list has no blank rows in it.
  const answered = ANSWER_FIELDS.flatMap((field) => {
    const value = values[field].trim()
    return value ? [[field, value] as const] : []
  })

  return {
    submissionId,
    submittedAt,
    formId: FORM_ID,
    formName: FORM_NAME,
    ...Object.fromEntries(answered),
    rawData: answered.map(([field, value]) => ({ name: field, values: [value] })),
    // Every field, answered or not: the key→label map describes the form, not this submission.
    formQuestions: ANSWER_FIELDS.map((field) => ({ key: field, label: LABELS[field] })),
    assets,
  }
}
