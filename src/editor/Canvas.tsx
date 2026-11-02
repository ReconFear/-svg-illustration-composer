import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useEditorStore } from '../store/editorStore'
import { getComponentById } from '../library'
import { getPalette } from '../palettes'
import { SvgNodes } from './SvgNodes'
import { itemTransform } from './geometry'
import type { CanvasItem } from '../types'

const SELECTION_PADDING = 6

interface DragState {
  pointerId: number
  itemId: string
  /** Смещение от курсора до центра объекта в координатах холста — убирает скачок при захвате. */
  offsetX: number
  offsetY: number
}

/** Экранные координаты указателя → координаты viewBox холста (учитывает масштаб отображения). */
function toCanvasPoint(svg: SVGSVGElement, clientX: number, clientY: number) {
  const ctm = svg.getScreenCTM()
  if (!ctm) return null
  return new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse())
}

export function Canvas() {
  const composition = useEditorStore((s) => s.composition)
  const selectedItemId = useEditorStore((s) => s.selectedItemId)
  const selectItem = useEditorStore((s) => s.selectItem)
  const moveItem = useEditorStore((s) => s.moveItem)
  const { width, height, items } = composition
  const colors = getPalette(composition.paletteId).colors

  const svgRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const selectedItem = items.find((item) => item.id === selectedItemId)
  const selectedComponent = selectedItem && getComponentById(selectedItem.componentId)

  function handleItemPointerDown(e: ReactPointerEvent, item: CanvasItem) {
    // preventDefault не вызываем: клик по холсту должен снимать фокус с поля поиска,
    // иначе Delete продолжит считаться вводом текста. Выделение текста гасит select-none.
    if (e.button !== 0 || !svgRef.current) return
    e.stopPropagation()
    selectItem(item.id)

    const point = toCanvasPoint(svgRef.current, e.clientX, e.clientY)
    if (!point) return
    dragRef.current = { pointerId: e.pointerId, itemId: item.id, offsetX: item.x - point.x, offsetY: item.y - point.y }
    svgRef.current.setPointerCapture(e.pointerId)
    setIsDragging(true)
  }

  function handlePointerMove(e: ReactPointerEvent<SVGSVGElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== e.pointerId) return
    const point = toCanvasPoint(e.currentTarget, e.clientX, e.clientY)
    if (point) moveItem(drag.itemId, point.x + drag.offsetX, point.y + drag.offsetY)
  }

  function endDrag(e: ReactPointerEvent<SVGSVGElement>) {
    if (!dragRef.current || dragRef.current.pointerId !== e.pointerId) return
    dragRef.current = null
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
    setIsDragging(false)
  }

  return (
    <>
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
        className={`block size-full touch-none rounded-sm bg-white ring-1 ring-zinc-200 select-none ${isDragging ? 'cursor-grabbing' : ''}`}
        role="img"
        aria-label="Холст композиции"
        onPointerDown={(e) => {
          if (e.button === 0 && e.target === e.currentTarget) selectItem(null)
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
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
                className={isDragging ? undefined : 'cursor-grab'}
                onPointerDown={(e) => handleItemPointerDown(e, item)}
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
