import type { CollectionConfig } from 'payload'

// The outbox. A submission lives here from the moment the visitor is thanked until the leads
// app confirms it, then the row is deleted — that rule is what stops the queue becoming a
// second, drifting copy of the leads archive.
export const Submissions: CollectionConfig = {
  slug: 'submissions',
  // Visible so a row stuck retrying has a surface, but never writable: hand-editing an
  // envelope could produce a delivery the leads app does not dedupe, and the row's death
  // belongs to the delete-on-delivery lifecycle. Server writes pass `overrideAccess`.
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  admin: {
    useAsTitle: 'submissionId',
    defaultColumns: ['submissionId', 'attempts', 'lastAttemptAt', 'lastError'],
    group: 'System',
  },
  fields: [
    // The uuid the browser minted before uploading: the blob prefix, the wire `submissionId`
    // and this row all agree on it, and the unique index is what makes a redelivery idempotent.
    { name: 'submissionId', type: 'text', required: true, unique: true, index: true },
    // The exact object that gets signed and sent. Stored whole so a retry re-sends what the
    // visitor submitted rather than something rebuilt from columns.
    { name: 'envelope', type: 'json', required: true },
    { name: 'attempts', type: 'number', defaultValue: 0 },
    { name: 'lastAttemptAt', type: 'date' },
    { name: 'lastError', type: 'text' },
  ],
}
