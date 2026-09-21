'use server'

import { after } from 'next/server'
import { array, number, object, string, url, uuid } from 'zod'

import { deleteRow, enqueue, recordFailure } from '@/lib/content/submissions'
import { isAcceptedType, MAX_FILE_BYTES, MAX_FILES } from './attachments'
import { contactSchema, firstIssueKey, type FormMessageKeyT } from './contact-schema'
import { buildEnvelope, type SubmissionEnvelopeT } from './envelope'
import { forward } from './forward'

export type ContactSubmitResultT = { ok: true } | { ok: false; errorKey: FormMessageKeyT }

// The browser uploaded these itself, so every descriptor is the client's word. The url is the one
// the leads app will fetch, so it is re-checked here rather than taken on trust.
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

  const envelope = buildEnvelope(parsed.data)

  // Store, answer, then forward. The queue row is committed before the visitor is answered, so the
  // thank-you rests on a write this app controls and never on the leads app being up; everything
  // after it is recovery, which the cron can finish.
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

  // The row stays, carrying why: the cron retries it, and `attempts` is what makes a permanently
  // failing submission visible in the admin rather than silently looping.
  await recordFailure(rowId, result.error)
}
