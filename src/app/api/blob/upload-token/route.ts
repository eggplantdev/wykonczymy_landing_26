import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'

import { leadPrefix } from '@/lib/blob/prefix'
import { ACCEPTED_CONTENT_TYPES, MAX_FILE_BYTES } from '@/lib/contact/attachments'
import { contactSchema } from '@/lib/contact/contact-schema'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * A public marketing form has no visitor to authenticate, so form validity is the gate: the same
 * schema the action runs, re-run here, is what separates an enquiry from an open file drop.
 *
 * The pathname is checked rather than assigned — `onBeforeGenerateToken` cannot return one, and the
 * issued token is bound to exactly the path that was asked for. So the check IS the pin: refuse
 * anything outside `leads/<submissionId>/` and the token cannot address the store root, where this
 * site's CMS media sits under exact filenames that `allowOverwrite: true` would replace.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    return NextResponse.json(
      await handleUpload({
        request,
        body,
        onBeforeGenerateToken: async (pathname, clientPayload) => {
          const { submissionId } = authorize(pathname, clientPayload)

          return {
            allowedContentTypes: [...ACCEPTED_CONTENT_TYPES],
            maximumSizeInBytes: MAX_FILE_BYTES,
            // The filename is the visitor's; the prefix is ours. A random suffix would break the
            // envelope's `filename`, which is what the salesperson sees beside the photo.
            addRandomSuffix: false,
            tokenPayload: submissionId,
          }
        },
      }),
    )
  } catch (error) {
    // Everything that reaches here is a refused request, not a fault: a malformed body, an enquiry
    // that does not validate, a pathname outside the prefix.
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}

function authorize(pathname: string, clientPayload: string | null): { submissionId: string } {
  const payload: unknown = JSON.parse(clientPayload ?? 'null')

  if (typeof payload !== 'object' || payload === null) throw new Error('Missing client payload')

  const { submissionId, values } = payload as { submissionId?: unknown; values?: unknown }

  if (typeof submissionId !== 'string' || !UUID_PATTERN.test(submissionId)) {
    throw new Error('Malformed submissionId')
  }

  if (!contactSchema.safeParse(values).success) throw new Error('Invalid enquiry')

  const prefix = leadPrefix(submissionId)
  const filename = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : ''

  // A nested path would still sit under the prefix, but the cleanup and the sweep both list one
  // level, so anything deeper is an object neither of them would ever reclaim.
  if (!filename || filename.includes('/')) throw new Error('Pathname outside the submission prefix')

  return { submissionId }
}
