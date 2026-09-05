import { SpecTable } from '@/components/ui/spec-table'
import { SpecGroupHeading } from './spec-group-heading'
import type { SpecItemT } from '@/components/ui/spec-item'

type PropsT = {
  container: string
  description: string
  detailsTitle: string
  scopeTitle: string
  details: SpecItemT[]
  scope: SpecItemT[]
}

// tdg spread these lists over two subpages either side of the gallery; here they are one
// table above it, so a reader has every fact before the photos start.
export function ProjectDescription({
  container,
  description,
  detailsTitle,
  scopeTitle,
  details,
  scope,
}: PropsT) {
  return (
    <section className={container}>
      <p className="text-18 md:text-20 lg:text-32 leading-125 col-span-full mb-20 md:col-span-6 md:mb-24 lg:col-span-8 lg:leading-normal xl:mb-40">
        {description}
      </p>

      <div className="col-span-full grid gap-x-5 gap-y-10 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SpecGroupHeading title={detailsTitle} />
          <SpecTable items={details} />
        </div>

        <div className="lg:col-span-4">
          <SpecGroupHeading title={scopeTitle} />
          <SpecTable items={scope} namesOnly />
        </div>
      </div>
    </section>
  )
}
