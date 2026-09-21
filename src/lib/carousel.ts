import { useEffect, useState } from 'react'
import { Autoplay, Keyboard } from 'swiper/modules'
import type { SwiperClass, SwiperProps } from 'swiper/react'

import { useIsOverlayOpen } from '@/lib/overlay'

// Every carousel on the site behaves identically — the same advance, the same pause on
// hover, the same keyboard support. Only the track geometry (slidesPerView, spacing,
// breakpoints) is a per-section decision, so that stays at the call site.
export const carouselDefaults = {
  modules: [Autoplay, Keyboard],
  loop: true,
  // `disableOnInteraction: false` so a swipe pauses the rotation rather than killing it
  // for the rest of the visit.
  autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
  // A slide clipped by the track never intersects, so native lazy loading never fires on it.
  // Ships at 0; slide 0 is `firstSlideLoading`'s job.
  lazyPreloadPrevNext: 1,
  speed: 200,
  grabCursor: true,
  keyboard: { enabled: true },
} satisfies SwiperProps

// Swiper lays the track out on the client, so the first paint is a stack of full-width
// slides. Every carousel hides itself until Swiper reports ready; the gate lives here so
// the trade — an SSR-invisible section in exchange for no layout flash — is decided once.
//
// It also holds the instance, which is what lets a covered carousel stand down: Swiper's
// keyboard handler is on `document` and its `onlyInViewport` guard asks only whether the
// track is on screen, never whether a dialog is painted over it. Every carousel goes
// through this hook, so the rule lands once rather than per section.
//
// `keyboard.disable()` and not the instance-wide `disable()`: the latter also stops touch,
// and a resize while it is off — which Radix's scroll lock fires on opening a dialog —
// leaves the track's active slide unset, because the realignment that would normally
// follow is exactly what being disabled suppresses. Autoplay is stopped alongside for the
// same reason the keys are: whatever moves the track while it is covered, the visitor
// finds it somewhere else on closing with nothing to connect that to.
export function useCarousel() {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null)
  const isOverlayOpen = useIsOverlayOpen()

  useEffect(() => {
    if (!swiper || swiper.destroyed || !isOverlayOpen) return

    // Only restart what this hook stopped — a section may have paused its own rotation for
    // reasons of its own, and an overlay closing is no licence to override that.
    const wasAutoplaying = swiper.autoplay.running

    swiper.keyboard.disable()
    if (wasAutoplaying) swiper.autoplay.stop()

    return () => {
      if (swiper.destroyed) return

      swiper.keyboard.enable()
      if (wasAutoplaying) swiper.autoplay.start()
    }
  }, [swiper, isOverlayOpen])

  return {
    className: swiper ? undefined : 'opacity-0',
    onSwiper: setSwiper,
    swiper,
  }
}
