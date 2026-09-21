// No `server-only` here: `env.server` carries the guard, and a direct import breaks the jsdom specs.
import { serverEnv } from '@/lib/env.server'
import type { SubmissionEnvelopeT } from './envelope'
import { sign } from './sign'

export type ForwardResultT = { delivered: true } | { delivered: false; error: string }

// One hung connection would otherwise hold the `after()` callback, or a cron batch, until the
// platform kills the invocation mid-row — leaving a row with neither a delete nor a recorded failure.
const FORWARD_TIMEOUT_MS = 10_000

/**
 * Serialised once, then both signed and sent as those exact bytes — a second `JSON.stringify` and
 * the signature stops matching. Only `2xx` is delivered: a `4xx` means the leads app refused this
 * envelope, and deleting the row on a refusal would destroy the lead the queue exists to hold. The
 * row stays and carries the status, so a rotated secret or a typo'd URL surfaces as a growing queue
 * instead of silence.
 */
export async function forward(envelope: SubmissionEnvelopeT): Promise<ForwardResultT> {
  const body = JSON.stringify(envelope)

  let response: Response
  try {
    response = await fetch(serverEnv.WYKONCZYMY_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-landing-signature': sign(body, serverEnv.LANDING_WEBHOOK_SECRET, 'landing-submission'),
      },
      body,
      signal: AbortSignal.timeout(FORWARD_TIMEOUT_MS),
    })
  } catch (error) {
    return { delivered: false, error: `Transport failure: ${(error as Error).message}` }
  }

  if (!response.ok) {
    return { delivered: false, error: `Leads app answered ${response.status}` }
  }

  return { delivered: true }
}
