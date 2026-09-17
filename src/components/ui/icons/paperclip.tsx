type PropsT = {
  color?: string
}

export function Paperclip({ color = 'currentColor' }: PropsT) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M14.5 9.5L9.75 14.25a3 3 0 0 1-4.243-4.243l5.836-5.836a2 2 0 0 1 2.829 2.829l-5.837 5.836a1 1 0 0 1-1.414-1.414L12.5 6"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
