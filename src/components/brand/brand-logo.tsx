import { cn } from '@/lib/cn'
import { buildBrandDots, DOT_RADIUS, VIEWBOX } from '@/components/brand/brand-mark-dots'

const GLOW = 0.9 // 0..1 bloom intensity

type PropsT = {
  className?: string
}

export function BrandLogo({ className }: PropsT) {
  const dots = buildBrandDots().map((dot) => (
    <circle key={`${dot.cx}-${dot.cy}`} cx={dot.cx} cy={dot.cy} r={dot.radius} fill={dot.fill} />
  ))

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      // overflow-visible: the glow blur blooms past the viewBox; the svg's default overflow:hidden
      // would clip it at the box edge.
      className={cn('overflow-visible', className)}
      aria-hidden
    >
      {/* Glow is one blur pass over a cloned dot layer behind the sharp dots — not a per-dot filter,
          which would re-rasterise every dot on each paint. */}
      <defs>
        <filter id="brand-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={GLOW * DOT_RADIUS * 1.8} />
        </filter>
      </defs>
      <g filter="url(#brand-glow)" opacity={Math.min(1, 0.55 + GLOW * 0.45)}>
        {dots}
      </g>
      <g>{dots}</g>
    </svg>
  )
}
