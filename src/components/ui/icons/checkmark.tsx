type PropsT = {
  color?: string
}

export function Checkmark({ color = 'currentColor' }: PropsT) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M4 8.6L8.1678 13.5104C8.37864 13.7588 8.76696 13.7424 8.95612 13.4771L15 5"
        stroke={color}
      />
    </svg>
  )
}
