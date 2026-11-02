import { MousePointerClick } from 'lucide-react'
import { useEditorStore } from '../store/editorStore'
import { getComponentById } from '../library'
import { getPalette } from '../palettes'
import { ComponentPreview } from '../editor/SvgNodes'
import { EmptyState, PanelHeader } from './Panel'

export function PropertiesPanel() {
  const selectedItem = useEditorStore((s) => s.composition.items.find((item) => item.id === s.selectedItemId))
  const paletteId = useEditorStore((s) => s.composition.paletteId)
  const component = selectedItem && getComponentById(selectedItem.componentId)

  return (
    <aside className="flex w-64 shrink-0 flex-col border-l border-zinc-200 bg-white xl:w-[280px]">
      <PanelHeader title="Свойства" />
      <div className="h-px bg-zinc-100" />

      {component ? (
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50">
              <ComponentPreview component={component} colors={getPalette(paletteId).colors} className="size-9" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-zinc-900">{component.name}</p>
              <p className="truncate text-xs text-zinc-500">{component.id}</p>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState icon={MousePointerClick} title="Объект не выбран">
          Выберите объект на холсте для редактирования.
        </EmptyState>
      )}
    </aside>
  )
}
