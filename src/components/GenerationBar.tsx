import { useRef, useState, type FormEvent } from 'react'
import { CircleAlert, CircleCheck, Columns3, Crown, Info, Scale, Sparkles, Wand2, type LucideIcon } from 'lucide-react'
import { useEditorStore } from '../store/editorStore'
import { builtinComponents } from '../library'
import { composeFromComponentQuery, composeFromMetaphor } from '../composition/generate'
import type { LayoutType } from '../composition/layouts'

type Mode = 'metaphor' | 'components'

const MODES: { id: Mode; label: string }[] = [
  { id: 'metaphor', label: 'По метафоре' },
  { id: 'components', label: 'По компонентам' },
]

const LAYOUTS: { id: LayoutType; label: string; hint: string; icon: LucideIcon }[] = [
  { id: 'hero', label: 'Главный', hint: 'Первый объект крупно в центре, остальные вокруг', icon: Crown },
  { id: 'horizontal', label: 'Ряд', hint: 'Объекты в ряд с равными интервалами', icon: Columns3 },
  { id: 'balanced', label: 'Баланс', hint: 'Свободная уравновешенная композиция по всему холсту', icon: Scale },
]

const METAPHOR_EXAMPLES = ['Развитие бизнеса', 'Защита данных', 'Новые идеи', 'Работа с документами']

type Status =
  | { kind: 'idle' }
  | { kind: 'error'; text: string }
  | { kind: 'success' | 'info'; text: string; details?: string }

export function GenerationBar() {
  const [mode, setMode] = useState<Mode>('metaphor')
  const [queries, setQueries] = useState<Record<Mode, string>>({ metaphor: '', components: '' })
  const [layout, setLayout] = useState<LayoutType>('hero')
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const inputRef = useRef<HTMLInputElement>(null)

  const query = queries[mode]
  const setQuery = (value: string) => {
    setQueries((prev) => ({ ...prev, [mode]: value }))
    setStatus({ kind: 'idle' })
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const { composition, replaceItems } = useEditorStore.getState()
    const result =
      mode === 'metaphor'
        ? composeFromMetaphor(query, builtinComponents, composition)
        : composeFromComponentQuery(query, layout, builtinComponents, composition)
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
    setStatus(result.notice)
  }

  return (
    <form onSubmit={handleSubmit} className="shrink-0 border-b border-zinc-200 bg-white px-4 pt-2.5 pb-2">
      <div className="flex flex-wrap items-center gap-2">
        <div role="tablist" aria-label="Режим генерации" className="flex h-8 shrink-0 rounded-md bg-zinc-100 p-0.5">
          {MODES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={mode === id}
              onClick={() => {
                setMode(id)
                setStatus({ kind: 'idle' })
              }}
              className="rounded px-2.5 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-800 aria-selected:bg-white aria-selected:text-zinc-900 aria-selected:shadow-sm"
            >
              {label}
            </button>
          ))}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={mode === 'metaphor' ? 'Например: развитие бизнеса' : 'ракета, облако, звезда'}
          aria-label={mode === 'metaphor' ? 'Идея, метафора или заголовок' : 'Названия компонентов через запятую'}
          aria-invalid={status.kind === 'error'}
          className="h-8 min-w-[180px] flex-1 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 text-sm transition-colors outline-none placeholder:text-zinc-400 focus:border-indigo-400 focus:bg-white aria-invalid:border-red-300"
        />

        {mode === 'components' && (
          <div role="group" aria-label="Шаблон расположения" className="flex h-8 shrink-0 rounded-md border border-zinc-200 p-0.5">
            {LAYOUTS.map(({ id, label, hint, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setLayout(id)}
                aria-pressed={layout === id}
                aria-label={label}
                title={hint}
                className="flex items-center gap-1.5 rounded px-2 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-800 aria-pressed:bg-indigo-50 aria-pressed:text-indigo-700"
              >
                <Icon className="size-3.5" strokeWidth={2} />
                <span className="hidden 2xl:inline">{label}</span>
              </button>
            ))}
          </div>
        )}

        <button
          type="submit"
          aria-label={mode === 'metaphor' ? 'Сгенерировать' : 'Собрать композицию'}
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          {mode === 'metaphor' ? (
            <>
              <Sparkles className="size-4" strokeWidth={2} />
              Сгенерировать
            </>
          ) : (
            <>
              <Wand2 className="size-4" strokeWidth={2} />
              <span className="hidden 2xl:inline">Собрать композицию</span>
              <span className="2xl:hidden">Собрать</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-1.5 flex h-5 items-center text-xs">
        {status.kind === 'idle' ? (
          mode === 'metaphor' ? (
            <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
              <span className="shrink-0 text-zinc-400">Примеры:</span>
              {METAPHOR_EXAMPLES.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => {
                    setQuery(example)
                    inputRef.current?.focus()
                  }}
                  className="shrink-0 rounded-full border border-zinc-200 px-2 py-px text-zinc-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {example}
                </button>
              ))}
            </div>
          ) : (
            <span className="truncate text-zinc-400">
              Перечислите 1–6 объектов через запятую — на русском или английском
            </span>
          )
        ) : (
          <p
            role={status.kind === 'error' ? 'alert' : 'status'}
            title={status.kind !== 'error' ? status.details : undefined}
            className={`flex min-w-0 items-center gap-1 ${status.kind === 'error' ? 'text-red-600' : 'text-zinc-500'}`}
          >
            {status.kind === 'error' && <CircleAlert className="size-3.5 shrink-0" />}
            {status.kind === 'success' && <CircleCheck className="size-3.5 shrink-0 text-emerald-500" />}
            {status.kind === 'info' && <Info className="size-3.5 shrink-0 text-amber-500" />}
            <span className="truncate">{status.text}</span>
          </p>
        )}
      </div>
    </form>
  )
}
