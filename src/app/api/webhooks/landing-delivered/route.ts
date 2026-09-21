import { NextResponse } from 'next/server'

import { deleteSubmissionFiles } from '@/lib/blob/cleanup'
import { verify } from '@/lib/contact/sign'
import { serverEnv } from '@/lib/env.server'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * The Callback section of `context/reference/landing-intake-contract.md`. The raw body is read
 * before parsing because the signature covers the exact bytes; the `landing-cleanup` scope is what
 * stops a forwarded envelope's signature doubling as a delete instruction.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const rawBody = await request.text()
  const signature = request.headers.get('x-landing-signature') ?? ''

  if (!verify(rawBody, signature, serverEnv.LANDING_WEBHOOK_SECRET, 'landing-cleanup')) {
    return NextResponse.json({ error: 'Bad signature' }, { status: 403 })
  }

  let submissionId: unknown
  try {
    submissionId = (JSON.parse(rawBody) as { submissionId?: unknown }).submissionId
  } catch {
    return NextResponse.json({ error: 'Body is not JSON' }, { status: 400 })
  }

  if (typeof submissionId !== 'string' || !UUID_PATTERN.test(submissionId)) {
    return NextResponse.json({ error: 'Malformed submissionId' }, { status: 400 })
  }

  try {
    const deleted = await deleteSubmissionFiles(submissionId)
    return NextResponse.json({ deleted })
  } catch (error) {
    // The sweep is the backstop: a failure here costs an orphan, not a lead.
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
