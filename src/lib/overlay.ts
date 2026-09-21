import { useEffect } from 'react'
import { create } from 'zustand'

// Nothing in the DOM tells a component that something is painted over it. An open
// full-screen dialog leaves the page behind it laid out, in the viewport and listening —
// which is how arrow keys meant for the photo lightbox were also paging the carousel
// underneath, since Swiper's Keyboard module binds on `document` rather than on its own
// element. This store is the site's one answer to "is an overlay open right now".
//
// A count rather than a boolean: two overlays can be open at once, and the first to close
// must not report the page uncovered while the second is still up.
type OverlayStoreT = {
  openCount: number
  open: () => void
  close: () => void
}

const useOverlayStore = create<OverlayStoreT>((set) => ({
  openCount: 0,
  open: () => set((state) => ({ openCount: state.openCount + 1 })),
  close: () => set((state) => ({ openCount: Math.max(0, state.openCount - 1) })),
}))

export function useIsOverlayOpen() {
  return useOverlayStore((state) => state.openCount > 0)
}

// Call from a component that is mounted only while its overlay is open — mounting is the
// signal, so there is no open/closed prop to keep in step.
export function useOverlayLock() {
  useEffect(() => {
    const { open, close } = useOverlayStore.getState()

    open()
    return close
  }, [])
}
