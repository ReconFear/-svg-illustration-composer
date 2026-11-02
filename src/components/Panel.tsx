import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export function PanelHeader({ title }: { title: string }) {
  return (
    <div className="flex h-11 shrink-0 items-center px-4">
      <h2 className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">{title}</h2>
    </div>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon
  title: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 pb-12 text-center">
      <div className="mb-3 flex size-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-400">
        <Icon className="size-5" strokeWidth={1.75} />
      </div>
      <p className="text-sm font-medium text-zinc-700">{title}</p>
      {children && <p className="mt-1 text-xs leading-relaxed text-zinc-500">{children}</p>}
    </div>
  )
}
