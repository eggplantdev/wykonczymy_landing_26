export type NumberCardT = {
  id: number
  value: string
  unit?: string
  description?: string
}

type PropsT = {
  card: NumberCardT
}

export function NumberCard({ card }: PropsT) {
  return (
    <li className="border-grau_300 pb-6 last:pb-0 md:pr-10 md:odd:border-r md:even:pl-15">
      <div className="flex items-end pb-4 md:pb-6 lg:pb-10">
        {/* TRIAL: graphite instead of grau_200 — revert this one class to undo. */}
        <p className="text-52 text-grau_100 md:text-60 lg:text-72 mt-3 mr-2 block h-12 min-w-24 shrink-0 leading-none md:mt-4 md:h-14 md:min-w-30 lg:mt-3.5 lg:h-16">
          {card.value}
        </p>
        <div className="text-16 leading-130 md:text-18 max-w-50.5">{card.unit}</div>
      </div>
      <div className="text-12 leading-130 md:text-14 max-w-50.5 md:max-w-57.5">
        {card.description}
      </div>
    </li>
  )
}
