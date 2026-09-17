// Shared with the Payload config, which turns these into the platform select's options — the
// same arrangement as `pageTypes` in `routing.ts`.
export const RATING_PLATFORMS = ['fixly', 'google'] as const

export type RatingPlatformT = (typeof RATING_PLATFORMS)[number]
