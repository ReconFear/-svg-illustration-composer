import { useEditorStore } from '../store/editorStore'
import { getComponentById } from '../library'
import { getPalette } from '../palettes'
import { SvgNodes } from './SvgNodes'
import { itemTransform } from './geometry'

const SELECTION_PADDING = 6

export function Canvas() {
  const composition = useEditorStore((s) => s.composition)
  const selectedItemId = useEditorStore((s) => s.selectedItemId)
  const selectItem = useEditorStore((s) => s.selectItem)
  const { width, height, items } = composition
  const colors = getPalette(composition.paletteId).colors

  const selectedItem = items.find((item) => item.id === selectedItemId)
  const selectedComponent = selectedItem && getComponentById(selectedItem.componentId)

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
        className="block size-full rounded-sm bg-white ring-1 ring-zinc-200"
        role="img"
        aria-label="Холст композиции"
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) selectItem(null)
        }}
      >
        {/* Данные композиции */}
        <g data-layer="items">
          {items.map((item) => {
            const component = getComponentById(item.componentId)
            if (!component) return null
            return (
              <g
                key={item.id}
                data-item-id={item.id}
                transform={itemTransform(item, component)}
                className="cursor-pointer"
                onPointerDown={() => selectItem(item.id)}
              >
                <SvgNodes component={component} colors={colors} />
              </g>
            )
          })}
        </g>

        {/* Вспомогательный слой редактора — не входит в композицию и экспорт */}
        {selectedItem && selectedComponent && (
          <g data-layer="overlay" pointerEvents="none">
            <rect
              transform={itemTransform(selectedItem, selectedComponent)}
              x={-SELECTION_PADDING}
              y={-SELECTION_PADDING}
              width={selectedComponent.viewBox.width + SELECTION_PADDING * 2}
              height={selectedComponent.viewBox.height + SELECTION_PADDING * 2}
              fill="none"
              stroke="#6366F1"
              strokeWidth={1.5}
              strokeDasharray="6 4"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        )}
      </svg>

      {items.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-sm text-zinc-300">Холст пуст — выберите объект в библиотеке</span>
        </div>
      )}
    </>
  )
}
