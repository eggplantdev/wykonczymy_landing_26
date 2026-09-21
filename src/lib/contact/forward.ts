// No `server-only` of its own: it reads `env.server`, which carries the guard, and a direct
// import here makes the module unloadable under the jsdom test environment.
import { serverEnv } from '@/lib/env.server'
import type { SubmissionEnvelopeT } from './envelope'
import { sign } from './sign'

export type ForwardResultT = { delivered: true } | { delivered: false; error: string }

/**
 * One envelope, one POST. The body is serialised **once** and both signed and sent as those exact
 * bytes — a second `JSON.stringify` on the way out would reorder nothing today and everything the
 * day a field becomes conditional, and the signature would stop matching for reasons no log
 * explains.
 *
 * Classification follows the contract's status table: `2xx` is delivered because `200` means „stop
 * retrying", and `4xx` is *also* delivered, because a refused signature or a rejected shape is a bug
 * a retry cannot fix — looping on it would bury the fault under a thousand identical attempts. Only
 * `5xx` and a transport failure leave the row for the cron.
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
