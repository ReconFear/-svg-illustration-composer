import { MousePointerClick } from 'lucide-react'
import { useEditorStore } from '../store/editorStore'
import { EmptyState, PanelHeader } from './Panel'

export function PropertiesPanel() {
  const selectedItemId = useEditorStore((s) => s.selectedItemId)

  return (
    <aside className="flex w-64 shrink-0 flex-col border-l border-zinc-200 bg-white xl:w-[280px]">
      <PanelHeader title="Свойства" />
      <div className="h-px bg-zinc-100" />

      {selectedItemId === null && (
        <EmptyState icon={MousePointerClick} title="Объект не выбран">
          Выберите объект на холсте для редактирования.
        </EmptyState>
      )}
    </aside>
  )
}
