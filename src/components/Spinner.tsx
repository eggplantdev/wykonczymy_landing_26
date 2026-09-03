// `role="status"` + the visually-hidden label is what makes a spinner announce itself;
// a bare animated glyph is silence to a screen reader.
export function Spinner({ label }: { label: string }) {
  return (
    <div role="status" aria-live="polite">
      <span aria-hidden="true">◌</span>
      <span className="sr-only">{label}</span>
    </div>
  )
}
