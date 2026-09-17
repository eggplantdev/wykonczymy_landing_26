type PropsT = {
  color?: string
}

export function Pin({ color = 'currentColor' }: PropsT) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 2.5C6.96243 2.5 4.5 4.96243 4.5 8C4.5 12.125 10 17.5 10 17.5C10 17.5 15.5 12.125 15.5 8C15.5 4.96243 13.0376 2.5 10 2.5Z"
        stroke={color}
        strokeLinejoin="round"
      />
      <circle cx="10" cy="8" r="2" stroke={color} />
    </svg>
  )
}
