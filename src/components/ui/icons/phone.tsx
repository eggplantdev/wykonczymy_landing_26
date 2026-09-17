type PropsT = {
  color?: string
}

export function Phone({ color = 'currentColor' }: PropsT) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      {/* The handset is one stroked path: the two ear-and-mouth cups plus the bar between
          them, so it scales with the row's font size instead of needing a second shape. */}
      <path
        d="M6.6 3.2 4.2 4.6a1.6 1.6 0 0 0-.7 1.9c.9 2.6 2.3 4.8 4.2 6.7 1.9 1.9 4.1 3.3 6.7 4.2a1.6 1.6 0 0 0 1.9-.7l1.4-2.4a1 1 0 0 0-.3-1.3l-2.6-1.7a1 1 0 0 0-1.3.2l-1 1.2a13.4 13.4 0 0 1-4.6-4.6l1.2-1a1 1 0 0 0 .2-1.3L7.9 3.5a1 1 0 0 0-1.3-.3Z"
        stroke={color}
        strokeLinejoin="round"
      />
    </svg>
  )
}
