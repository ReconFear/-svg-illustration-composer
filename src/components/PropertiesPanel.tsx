import type { ReactNode } from 'react'
import { ChevronDown, ChevronUp, Copy, MousePointerClick, Trash2, type LucideIcon } from 'lucide-react'
import { useEditorStore } from '../store/editorStore'
import { getComponentById } from '../library'
import { getPalette } from '../palettes'
import { ComponentPreview } from '../editor/SvgNodes'
import { EmptyState, PanelHeader } from './Panel'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-zinc-100 px-4 py-4">
      <h3 className="mb-2.5 text-xs font-medium text-zinc-500">{title}</h3>
      {children}
    </section>
  )
}

function ReadonlyField({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex h-8 items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-2.5">
      <span className="text-xs font-medium text-zinc-400">{label}</span>
      <span className="text-sm text-zinc-800 tabular-nums">{Math.round(value)}</span>
    </div>
  )
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  danger,
  hint,
}: {
  icon: LucideIcon
  label: string
  onClick: () => void
  disabled?: boolean
  danger?: boolean
  hint?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={hint}
      className={`flex h-8 items-center justify-center gap-1.5 rounded-md border px-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        danger
          ? 'border-zinc-200 text-red-600 hover:border-red-200 hover:bg-red-50 disabled:hover:border-zinc-200 disabled:hover:bg-transparent'
          : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50 disabled:hover:bg-transparent'
      }`}
    >
      <Icon className="size-4" strokeWidth={1.75} />
      {label}
    </button>
  )
}

export function PropertiesPanel() {
  const items = useEditorStore((s) => s.composition.items)
  const selectedItemId = useEditorStore((s) => s.selectedItemId)
  const paletteId = useEditorStore((s) => s.composition.paletteId)
  const { duplicateItem, removeItem, moveLayerUp, moveLayerDown } = useEditorStore.getState()

  const layerIndex = items.findIndex((item) => item.id === selectedItemId)
  const selectedItem = layerIndex === -1 ? undefined : items[layerIndex]
  const component = selectedItem && getComponentById(selectedItem.componentId)

  return (
    <aside className="flex w-64 shrink-0 flex-col border-l border-zinc-200 bg-white xl:w-[280px]">
      <PanelHeader title="Свойства" />
      <div className="h-px bg-zinc-100" />

      {selectedItem && component ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex items-center gap-3 border-b border-zinc-100 px-4 py-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50">
              <ComponentPreview component={component} colors={getPalette(paletteId).colors} className="size-9" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-zinc-900">{component.name}</p>
              <p className="truncate text-xs text-zinc-500">{component.id}</p>
            </div>
          </div>

          <Section title="Позиция центра">
            <div className="grid grid-cols-2 gap-2">
              <ReadonlyField label="X" value={selectedItem.x} />
              <ReadonlyField label="Y" value={selectedItem.y} />
            </div>
          </Section>

          <Section title={`Слой ${layerIndex + 1} из ${items.length}`}>
            <div className="grid grid-cols-2 gap-2">
              <ActionButton
                icon={ChevronUp}
                label="Выше"
                onClick={() => moveLayerUp(selectedItem.id)}
                disabled={layerIndex === items.length - 1}
              />
              <ActionButton
                icon={ChevronDown}
                label="Ниже"
                onClick={() => moveLayerDown(selectedItem.id)}
                disabled={layerIndex === 0}
              />
            </div>
          </Section>

          <Section title="Действия">
            <div className="flex flex-col gap-2">
              <ActionButton icon={Copy} label="Дублировать" onClick={() => duplicateItem(selectedItem.id)} />
              <ActionButton icon={Trash2} label="Удалить" hint="Удалить (Delete)" danger onClick={() => removeItem(selectedItem.id)} />
            </div>
          </Section>
        </div>
      ) : (
        <EmptyState icon={MousePointerClick} title="Объект не выбран">
          Выберите объект на холсте для редактирования.
        </EmptyState>
      )}
    </aside>
  )
}
