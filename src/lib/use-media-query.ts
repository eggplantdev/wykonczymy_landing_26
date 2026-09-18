import { useCallback, useSyncExternalStore } from 'react'

export function useMediaQuery(query: string) {
  // Stable across renders, or `useSyncExternalStore` drops and re-attaches the listener
  // every time the calling component renders.
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}
