import { useState, type FormEvent } from 'react'
import { CircleAlert, CircleCheck, Columns3, Crown, Scale, Wand2, type LucideIcon } from 'lucide-react'
import { useEditorStore } from '../store/editorStore'
import { builtinComponents } from '../library'
import { composeFromComponentQuery } from '../composition/generate'
import type { LayoutType } from '../composition/layouts'

const LAYOUTS: { id: LayoutType; label: string; hint: string; icon: LucideIcon }[] = [
  { id: 'hero', label: 'Главный', hint: 'Первый объект крупно в центре, остальные вокруг', icon: Crown },
  { id: 'horizontal', label: 'Ряд', hint: 'Объекты в ряд с равными интервалами', icon: Columns3 },
  { id: 'balanced', label: 'Баланс', hint: 'Свободная уравновешенная композиция по всему холсту', icon: Scale },
]

type Status = { kind: 'idle' } | { kind: 'error'; text: string } | { kind: 'success'; text: string }

export function GenerationBar() {
  const [query, setQuery] = useState('')
  const [layout, setLayout] = useState<LayoutType>('hero')
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const { composition, replaceItems } = useEditorStore.getState()
    const result = composeFromComponentQuery(query, layout, builtinComponents, composition)
    if (!result.ok) {
      setStatus({ kind: 'error', text: result.error })
      return
    }
    if (
      composition.items.length > 0 &&
      !window.confirm('Заменить текущую композицию? Объекты на холсте и ручные правки будут удалены.')
    ) {
      return
    }
    replaceItems(result.items)
    setStatus({ kind: 'success', text: `Собрано: ${result.components.map((c) => c.name).join(', ')}` })
  }

  return (
    <form onSubmit={handleSubmit} className="shrink-0 border-b border-zinc-200 bg-white px-4 pt-2.5 pb-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="hidden h-8 shrink-0 items-center rounded-md bg-zinc-100 px-2.5 text-xs font-medium text-zinc-600 2xl:flex">
          По компонентам
        </span>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (status.kind === 'error') setStatus({ kind: 'idle' })
          }}
          placeholder="ракета, облако, звезда"
          aria-label="Названия компонентов через запятую"
          aria-invalid={status.kind === 'error'}
          className="h-8 min-w-[180px] flex-1 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 text-sm transition-colors outline-none placeholder:text-zinc-400 focus:border-indigo-400 focus:bg-white aria-invalid:border-red-300"
        />

        <div role="group" aria-label="Шаблон расположения" className="flex h-8 shrink-0 rounded-md border border-zinc-200 p-0.5">
          {LAYOUTS.map(({ id, label, hint, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setLayout(id)}
              aria-pressed={layout === id}
              title={hint}
              className="flex items-center gap-1.5 rounded px-2 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-800 aria-pressed:bg-indigo-50 aria-pressed:text-indigo-700"
            >
              <Icon className="size-3.5" strokeWidth={2} />
              <span className="hidden xl:inline">{label}</span>
            </button>
          ))}
        </div>

        <button
          type="submit"
          aria-label="Собрать композицию"
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <Wand2 className="size-4" strokeWidth={2} />
          <span className="hidden lg:inline">Собрать композицию</span>
          <span className="lg:hidden">Собрать</span>
        </button>
      </div>

      <p
        role={status.kind === 'error' ? 'alert' : undefined}
        className={`mt-1.5 flex h-4 items-center gap-1 truncate text-xs ${
          status.kind === 'error' ? 'text-red-600' : 'text-zinc-400'
        }`}
      >
        {status.kind === 'error' && <CircleAlert className="size-3.5 shrink-0" />}
        {status.kind === 'success' && <CircleCheck className="size-3.5 shrink-0 text-emerald-500" />}
        {status.kind === 'idle' ? 'Перечислите 1–6 объектов через запятую — на русском или английском' : status.text}
      </p>
    </form>
  )
}
