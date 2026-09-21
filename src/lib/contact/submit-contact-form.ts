'use server'

import { after } from 'next/server'
import { array, number, object, string, url, uuid } from 'zod'

import { deleteRow, enqueue, recordFailure } from '@/lib/content/submissions'
import { isAcceptedType, MAX_FILE_BYTES, MAX_FILES } from './attachments'
import {
  contactSchema,
  firstIssueKey,
  SHORT_FIELD_MAX_LENGTH,
  type FormMessageKeyT,
} from './contact-schema'
import { buildEnvelope, type SubmissionEnvelopeT } from './envelope'
import { forward } from './forward'

export type ContactSubmitResultT = { ok: true } | { ok: false; errorKey: FormMessageKeyT }

// Every descriptor is the client's word, and the leads app fetches these urls — so re-check them.
const assetSchema = object({
  url: string().pipe(url()),
  filename: string().min(1),
  contentType: string().refine(isAcceptedType),
  size: number().int().positive().max(MAX_FILE_BYTES),
})

const submissionSchema = object({
  submissionId: string().pipe(uuid()),
  values: contactSchema,
  assets: array(assetSchema).max(MAX_FILES),
  // The honeypot, capped rather than rejected on length so an overlong one is still *answered*.
  trap: string().max(SHORT_FIELD_MAX_LENGTH).optional().catch(''),
})

export async function submitContactForm(input: unknown): Promise<ContactSubmitResultT> {
  // The client already ran this schema, which is exactly why it is re-run here: a
  // server action is a public endpoint and the browser's types prove nothing.
  const parsed = submissionSchema.safeParse(input)

  if (!parsed.success) {
    // A key, not a sentence: the action has no locale of its own, and answering in one
    // would make it a second owner of key-to-sentence that could drift from the form's.
    return { ok: false, errorKey: firstIssueKey(parsed.error.issues) ?? 'error' }
  }

  // Answered as if sent, and nothing is stored: telling a form-filler which field gave it away
  // is all a spammer needs to stop filling that one.
  if (parsed.data.trap) return { ok: true }

  const envelope = buildEnvelope(parsed.data)

  // Store, answer, then forward: the thank-you rests on a write this app controls, never on the
  // leads app being up.
  let row
  try {
    row = await enqueue(envelope)
  } catch {
    return { ok: false, errorKey: 'error' }
  }

  after(() => deliver(envelope, row.id))

  return { ok: true }
}

async function deliver(envelope: SubmissionEnvelopeT, rowId: number): Promise<void> {
  const result = await forward(envelope)

  if (result.delivered) {
    await deleteRow(envelope.submissionId)
    return
  }

  // The row stays, carrying why — the cron retries it and `attempts` makes a stuck one visible.
  await recordFailure(rowId, result.error)
}
