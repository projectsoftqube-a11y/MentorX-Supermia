import { ArrowUpRight, type LucideIcon } from 'lucide-react'

/**
 * Round arrow badge for `.btn`. Two stacked arrows: on hover the first flies out while the second
 * slides in behind it (CSS only, see `.btn__arrow` in globals.css). Diagonal by default (↗);
 * `down` swaps them vertically, for downloads.
 */
export function BtnArrow({ icon: Icon = ArrowUpRight, down = false }: { icon?: LucideIcon; down?: boolean }) {
  return (
    <span className={down ? 'btn__icon btn__icon--down' : 'btn__icon'} aria-hidden="true">
      <Icon className="btn__arrow" strokeWidth={2.5} />
      <Icon className="btn__arrow btn__arrow--next" strokeWidth={2.5} />
    </span>
  )
}
