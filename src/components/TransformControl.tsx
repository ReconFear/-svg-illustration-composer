import { useId, useState, type KeyboardEvent } from 'react'
import { RotateCcw } from 'lucide-react'

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

function parseNumber(raw: string): number | null {
  if (raw.trim() === '') return null
  const value = Number(raw.replace(',', '.'))
  return Number.isFinite(value) ? value : null
}

/**
 * Числовое поле с черновиком: пока пользователь печатает, значение применяется
 * только если оно уже в допустимом диапазоне (иначе «1» по пути к «150» сбрасывало бы масштаб).
 * На blur/Enter значение ограничивается диапазоном.
 */
function NumberField({
  id,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  id: string
  value: number
  min: number
  max: number
  suffix: string
  onChange: (value: number) => void
}) {
  const [draft, setDraft] = useState<string | null>(null)

  function commit(raw: string) {
    const parsed = parseNumber(raw)
    if (parsed !== null) onChange(clamp(parsed, min, max))
    setDraft(null)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') e.currentTarget.blur()
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const step = (e.shiftKey ? 10 : 1) * (e.key === 'ArrowUp' ? 1 : -1)
      const next = clamp(Math.round(value) + step, min, max)
      onChange(next)
      setDraft(String(next))
    }
  }

  return (
    <div className="flex h-8 w-[76px] shrink-0 items-center rounded-md border border-zinc-200 bg-white pr-2 transition-colors focus-within:border-indigo-400">
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={draft ?? String(Math.round(value))}
        onFocus={(e) => {
          setDraft(String(Math.round(value)))
          e.currentTarget.select()
        }}
        onChange={(e) => {
          setDraft(e.target.value)
          const parsed = parseNumber(e.target.value)
          if (parsed !== null && parsed >= min && parsed <= max) onChange(parsed)
        }}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={handleKeyDown}
        className="h-full w-full min-w-0 bg-transparent pl-2.5 text-right text-sm text-zinc-800 tabular-nums outline-none"
      />
      <span className="pl-0.5 text-xs text-zinc-400">{suffix}</span>
    </div>
  )
}

/** Строка «ползунок + числовое поле + сброс» для одного параметра трансформации. */
export function TransformControl({
  label,
  value,
  min,
  max,
  defaultValue,
  suffix,
  resetLabel,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  defaultValue: number
  suffix: string
  resetLabel: string
  onChange: (value: number) => void
}) {
  const id = useId()
  const isDefault = Math.round(value) === defaultValue

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="text-xs text-zinc-600">
          {label}
        </label>
        <button
          type="button"
          onClick={() => onChange(defaultValue)}
          disabled={isDefault}
          title={resetLabel}
          aria-label={resetLabel}
          className="flex size-6 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:pointer-events-none disabled:opacity-30"
        >
          <RotateCcw className="size-3.5" />
        </button>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(e.target.valueAsNumber)}
          aria-label={label}
          className="h-1.5 min-w-0 flex-1 cursor-pointer accent-indigo-600"
        />
        <NumberField id={id} value={value} min={min} max={max} suffix={suffix} onChange={onChange} />
      </div>
    </div>
  )
}
