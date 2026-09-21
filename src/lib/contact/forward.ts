// No `server-only` here: `env.server` carries the guard, and a direct import breaks the jsdom specs.
import { serverEnv } from '@/lib/env.server'
import type { SubmissionEnvelopeT } from './envelope'
import { sign } from './sign'

export type ForwardResultT = { delivered: true } | { delivered: false; error: string }

/**
 * Serialised once, then both signed and sent as those exact bytes — a second `JSON.stringify` and
 * the signature stops matching. `4xx` counts as delivered: a rejected shape is a bug a retry only
 * buries. Only `5xx` and a transport failure leave the row for the cron.
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
    })
  } catch (error) {
    return { delivered: false, error: `Transport failure: ${(error as Error).message}` }
  }

  if (response.status >= 500) {
    return { delivered: false, error: `Leads app answered ${response.status}` }
  }

  return { delivered: true }
}
