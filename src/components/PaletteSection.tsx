import { useRef, useState, type ChangeEvent } from 'react'
import { CircleAlert, CircleCheck, Upload } from 'lucide-react'
import { selectActiveColors, useEditorStore } from '../store/editorStore'
import { COLOR_ROLES, COLOR_ROLE_LABELS, CUSTOM_PALETTE_ID, getPalette, palettes } from '../palettes'
import { MAX_PALETTE_COLORS, MIN_PALETTE_COLORS, readPaletteFile } from '../palettes/import'
import type { PaletteColors } from '../types'

function Swatches({ colors }: { colors: PaletteColors }) {
  return (
    <span className="flex shrink-0 -space-x-1">
      {COLOR_ROLES.map((role) => (
        <span
          key={role}
          className="size-3.5 rounded-full ring-2 ring-white"
          style={{ backgroundColor: colors[role] }}
        />
      ))}
    </span>
  )
}

function PaletteOption({
  name,
  colors,
  active,
  onSelect,
}: {
  name: string
  colors: PaletteColors
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      title={name}
      className="flex min-w-0 items-center gap-2 rounded-md border border-zinc-200 px-2 py-1.5 text-left text-xs text-zinc-700 transition-colors hover:bg-zinc-50 aria-pressed:border-indigo-400 aria-pressed:bg-indigo-50/60 aria-pressed:text-indigo-800"
    >
      <Swatches colors={colors} />
      <span className="truncate">{name}</span>
    </button>
  )
}

type ImportStatus = { kind: 'error' | 'success'; text: string } | null

export function PaletteSection() {
  const { paletteId, customColors, customPaletteName } = useEditorStore((s) => s.composition)
  const colors = useEditorStore(selectActiveColors)
  const { setPalette, setCustomPalette, setPaletteColor } = useEditorStore.getState()
  const fileRef = useRef<HTMLInputElement>(null)
  const [importStatus, setImportStatus] = useState<ImportStatus>(null)

  const isCustom = paletteId === CUSTOM_PALETTE_ID

  /** Сообщение об импорте относится к загруженной палитре — при выборе другой оно больше не актуально. */
  function selectPalette(id: string) {
    setPalette(id)
    setImportStatus(null)
  }
  const activeName = isCustom ? (customPaletteName ?? 'Своя палитра') : getPalette(paletteId).name

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // повторный выбор того же файла тоже должен срабатывать
    if (!file) return
    const result = await readPaletteFile(file)
    if (!result.ok) {
      setImportStatus({ kind: 'error', text: result.error })
      return
    }
    setCustomPalette(result.name, result.colors)
    const derived = result.sourceCount < 5 ? ' Недостающие роли выведены из основного цвета.' : ''
    const ignored = result.sourceCount > 5 ? ` Использованы первые 5 из ${result.sourceCount}.` : ''
    setImportStatus({ kind: 'success', text: `Палитра «${result.name}» применена.${derived}${ignored}` })
  }

  return (
    <section className="px-4 py-4">
      <div className="mb-2.5 flex items-baseline justify-between gap-2">
        <h3 className="text-xs font-medium text-zinc-500">Цветовая палитра</h3>
        <span className="truncate text-xs font-medium text-zinc-800" title={activeName}>
          {activeName}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {palettes.map((palette) => (
          <PaletteOption
            key={palette.id}
            name={palette.name}
            colors={palette.colors}
            active={paletteId === palette.id}
            onSelect={() => selectPalette(palette.id)}
          />
        ))}
        {customColors && (
          <PaletteOption
            name={customPaletteName ?? 'Своя палитра'}
            colors={customColors}
            active={isCustom}
            onSelect={() => selectPalette(CUSTOM_PALETTE_ID)}
          />
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1">
        {COLOR_ROLES.map((role) => (
          <label
            key={role}
            className="flex h-8 cursor-pointer items-center gap-2.5 rounded-md px-1 transition-colors hover:bg-zinc-50"
          >
            <input
              type="color"
              value={colors[role].toLowerCase()}
              onChange={(e) => setPaletteColor(role, e.target.value.toUpperCase())}
              aria-label={`Цвет: ${COLOR_ROLE_LABELS[role]}`}
              className="size-6 shrink-0 cursor-pointer rounded border border-zinc-200 bg-transparent p-0 [&::-webkit-color-swatch]:rounded-[3px] [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch-wrapper]:p-0"
            />
            <span className="min-w-0 flex-1 truncate text-xs text-zinc-700">{COLOR_ROLE_LABELS[role]}</span>
            <span className="font-mono text-[11px] text-zinc-400 uppercase">{colors[role]}</span>
          </label>
        ))}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".json,.txt,application/json,text/plain"
        onChange={handleFile}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="mt-3 flex h-8 w-full items-center justify-center gap-1.5 rounded-md border border-zinc-200 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
      >
        <Upload className="size-4" strokeWidth={1.75} />
        Загрузить палитру
      </button>

      {importStatus ? (
        <p
          role={importStatus.kind === 'error' ? 'alert' : 'status'}
          className={`mt-2 flex gap-1 text-xs leading-snug ${importStatus.kind === 'error' ? 'text-red-600' : 'text-zinc-500'}`}
        >
          {importStatus.kind === 'error' ? (
            <CircleAlert className="mt-px size-3.5 shrink-0" />
          ) : (
            <CircleCheck className="mt-px size-3.5 shrink-0 text-emerald-500" />
          )}
          {importStatus.text}
        </p>
      ) : (
        <p className="mt-2 text-xs leading-snug text-zinc-400">
          JSON или TXT, {MIN_PALETTE_COLORS}–{MAX_PALETTE_COLORS} HEX-цветов, до 50 КБ
        </p>
      )}
    </section>
  )
}
