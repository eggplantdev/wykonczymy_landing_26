// Regular five-pointed star: points on an outer circle, valleys on an inner one whose radius
// is outer × cos72°/cos36°. Computed from that ratio rather than lifted off an icon set, so
// the ten vertices are exactly regular.
type PropsT = {
  color?: string
}

export function Star({ color = 'currentColor' }: PropsT) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="size-6" viewBox="0 0 24 24">
      <path
        d="M12.000 1.000 L14.470 8.601 L22.462 8.601 L15.996 13.298 L18.466 20.899 L12.000 16.202 L5.534 20.899 L8.004 13.298 L1.538 8.601 L9.530 8.601 Z"
        fill={color}
      />
    </svg>
  )
}
