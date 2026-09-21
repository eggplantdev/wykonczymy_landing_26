/**
 * Whether the upload-token route is currently rate-limited for this visitor.
 *
 * The blob client throws a bare `BlobError` with the status discarded, so a throttled upload is
 * indistinguishable from a dropped connection at the point it fails. This asks the route directly:
 * the Firewall denies at the edge with `403`, while the route itself answers `400` to a body it
 * refuses — so the status separates „wait a minute" from „try again" without the SDK's help.
 */
export async function isThrottled(): Promise<boolean> {
  try {
    const response = await fetch('/api/blob/upload-token', { method: 'POST', body: '{}' })
    return response.status === 403
  } catch {
    // A probe that cannot reach the network says nothing about throttling.
    return false
  }
}
