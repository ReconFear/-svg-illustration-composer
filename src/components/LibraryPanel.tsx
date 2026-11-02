import { LibraryBig, Search } from 'lucide-react'
import { EmptyState, PanelHeader } from './Panel'

export function LibraryPanel() {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-zinc-200 bg-white xl:w-[260px]">
      <PanelHeader title="Библиотека" />

      <div className="px-3 pb-3">
        {/* Поиск подключается вместе с библиотекой компонентов на следующем этапе */}
        <label className="relative block">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            disabled
            placeholder="Поиск компонентов"
            className="h-8 w-full rounded-md border border-zinc-200 bg-zinc-50 pr-2.5 pl-8 text-sm placeholder:text-zinc-400 disabled:cursor-not-allowed"
          />
        </label>
      </div>

      <div className="h-px bg-zinc-100" />

      <EmptyState icon={LibraryBig} title="Библиотека пуста">
        SVG-компоненты появятся здесь на следующем этапе.
      </EmptyState>
    </aside>
  )
}
