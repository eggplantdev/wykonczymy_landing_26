import { Autoplay, Keyboard } from 'swiper/modules'
import type { SwiperProps } from 'swiper/react'

// Every carousel on the site behaves identically — the same advance, the same pause on
// hover, the same keyboard support. Only the track geometry (slidesPerView, spacing,
// breakpoints) is a per-section decision, so that stays at the call site.
export const carouselDefaults = {
  modules: [Autoplay, Keyboard],
  loop: true,
  // `disableOnInteraction: false` so a swipe pauses the rotation rather than killing it
  // for the rest of the visit.
  autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
  speed: 200,
  grabCursor: true,
  keyboard: { enabled: true },
} satisfies SwiperProps
