import { useMemo, useState } from 'react'
import { SearchX, Search, X } from 'lucide-react'
import { builtinComponents, searchComponents } from '../library'
import { selectActiveColors, useEditorStore } from '../store/editorStore'
import { ComponentPreview } from '../editor/SvgNodes'
import { EmptyState, PanelHeader } from './Panel'

export function LibraryPanel() {
  const [query, setQuery] = useState('')
  const addItem = useEditorStore((s) => s.addItem)

  const colors = useEditorStore(selectActiveColors)
  const results = useMemo(() => searchComponents(builtinComponents, query), [query])

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-zinc-200 bg-white xl:w-[260px]">
      <PanelHeader title="Библиотека" />

      <div className="px-3 pb-3">
        <label className="relative block">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск: ракета, idea, рост…"
            className="h-8 w-full rounded-md border border-zinc-200 bg-zinc-50 pr-8 pl-8 text-sm transition-colors outline-none placeholder:text-zinc-400 focus:border-indigo-400 focus:bg-white"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Очистить поиск"
              className="absolute top-1/2 right-1.5 flex size-5 -translate-y-1/2 items-center justify-center rounded text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
            >
              <X className="size-3.5" />
            </button>
          )}
        </label>
      </div>

      <div className="h-px bg-zinc-100" />

      {results.length === 0 ? (
        <EmptyState icon={SearchX} title="Ничего не найдено">
          По запросу «{query.trim()}» нет компонентов. Попробуйте другое слово на русском или английском.
        </EmptyState>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-2">
            {results.map((component) => (
              <button
                key={component.id}
                type="button"
                onClick={() => addItem(component.id)}
                title={`Добавить «${component.name}» на холст`}
                className="group flex flex-col items-center gap-1.5 rounded-lg border border-zinc-200 bg-white p-2 text-left transition-colors hover:border-indigo-300 hover:bg-indigo-50/40 focus-visible:border-indigo-400 focus-visible:outline-none"
              >
                <div className="flex aspect-square w-full items-center justify-center rounded-md bg-zinc-50 group-hover:bg-white">
                  <ComponentPreview component={component} colors={colors} className="size-[78%]" />
                </div>
                <span className="w-full truncate text-center text-xs font-medium text-zinc-700">{component.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
