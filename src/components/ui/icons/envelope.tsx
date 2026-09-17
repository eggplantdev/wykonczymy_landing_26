type PropsT = {
  color?: string
}

export function Envelope({ color = 'currentColor' }: PropsT) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="4.5" width="15" height="11" rx="1.5" stroke={color} />
      <path
        d="M2.5 6L9.11 10.41a1.6 1.6 0 0 0 1.78 0L17.5 6"
        stroke={color}
        strokeLinejoin="round"
      />
    </svg>
  )
}
