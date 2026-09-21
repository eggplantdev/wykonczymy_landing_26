import { list } from '@vercel/blob'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'

import { isDirectChild, isSubmissionId, leadPrefix } from '@/lib/blob/prefix'
import { ACCEPTED_CONTENT_TYPES, MAX_FILE_BYTES, MAX_FILES } from '@/lib/contact/attachments'
import { contactSchema } from '@/lib/contact/contact-schema'

/**
 * No visitor to authenticate on a public form, so form validity is the gate. The pathname is checked
 * rather than assigned — `onBeforeGenerateToken` cannot return one and the token is bound to exactly
 * the path asked for, so refusing anything outside the prefix IS the pin.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Inside the try with everything else: a non-JSON body is a refusal like any other, and a 500
    // here would be the one path answering neither the route's 400 nor the Firewall's 403.
    const body = (await request.json()) as HandleUploadBody

    return NextResponse.json(
      await handleUpload({
        request,
        body,
        onBeforeGenerateToken: async (pathname, clientPayload) => {
          const { submissionId } = await authorize(pathname, clientPayload)

          return {
            allowedContentTypes: [...ACCEPTED_CONTENT_TYPES],
            maximumSizeInBytes: MAX_FILE_BYTES,
            // A random suffix would break the envelope's `filename`, which is what the leads app shows.
            addRandomSuffix: false,
            tokenPayload: submissionId,
          }
        },
      }),
    )
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}

async function authorize(
  pathname: string,
  clientPayload: string | null,
): Promise<{ submissionId: string }> {
  const payload: unknown = JSON.parse(clientPayload ?? 'null')

  if (typeof payload !== 'object' || payload === null) throw new Error('Missing client payload')

  const { submissionId, values } = payload as { submissionId?: unknown; values?: unknown }

  if (!isSubmissionId(submissionId)) throw new Error('Malformed submissionId')

  if (!contactSchema.safeParse(values).success) throw new Error('Invalid enquiry')

  if (!isDirectChild(pathname, submissionId)) {
    throw new Error('Pathname outside the submission prefix')
  }

  const prefix = leadPrefix(submissionId)

  // The ceiling has to be counted here, not just in the browser and the action: each file is its
  // own token request, so without this one prefix accepts unbounded 8 MB objects on a public route
  // and the 24h sweep is the only thing that ever takes them back.
  const { blobs } = await list({ prefix, limit: MAX_FILES + 1 })
  if (blobs.filter((blob) => blob.pathname !== pathname).length >= MAX_FILES) {
    throw new Error('Too many files for this submission')
  }

  return { submissionId }
}
