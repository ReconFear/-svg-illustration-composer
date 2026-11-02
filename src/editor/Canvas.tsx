import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useEditorStore } from '../store/editorStore'
import { getComponentById } from '../library'
import { getPalette } from '../palettes'
import { SvgNodes } from './SvgNodes'
import { itemFrameTransform, itemTransform, scaledHalfSize } from './geometry'
import type { CanvasItem } from '../types'

/** Отступ рамки и размер ручки — в единицах холста, не зависят от scale объекта. */
const SELECTION_PADDING = 8
const HANDLE_SIZE = 16
const HANDLE_HIT_RADIUS = 22
const SELECTION_COLOR = '#6366F1'

type DragState =
  | {
      mode: 'move'
      pointerId: number
      itemId: string
      /** Смещение от курсора до центра объекта в координатах холста — убирает скачок при захвате. */
      offsetX: number
      offsetY: number
    }
  | {
      mode: 'scale'
      pointerId: number
      itemId: string
      centerX: number
      centerY: number
      startScale: number
      /** Единичный вектор «центр → точка захвата»: масштаб = проекция курсора на него. */
      dirX: number
      dirY: number
      startDistance: number
    }

/** Экранные координаты указателя → координаты viewBox холста (учитывает масштаб отображения). */
function toCanvasPoint(svg: SVGSVGElement, clientX: number, clientY: number) {
  const ctm = svg.getScreenCTM()
  if (!ctm) return null
  return new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse())
}

/** Курсор ручки в правом нижнем углу с учётом поворота рамки. */
function resizeCursor(rotation: number): string {
  const cursors = ['ew-resize', 'nwse-resize', 'ns-resize', 'nesw-resize']
  const angle = (((rotation + 45) % 180) + 180) % 180
  return cursors[Math.round(angle / 45) % 4]
}

export function Canvas() {
  const composition = useEditorStore((s) => s.composition)
  const selectedItemId = useEditorStore((s) => s.selectedItemId)
  const { selectItem, moveItem, setItemScale } = useEditorStore.getState()
  const { width, height, items } = composition
  const colors = getPalette(composition.paletteId).colors

  const svgRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const [dragMode, setDragMode] = useState<DragState['mode'] | null>(null)

  const selectedItem = items.find((item) => item.id === selectedItemId)
  const selectedComponent = selectedItem && getComponentById(selectedItem.componentId)

  function startDrag(e: ReactPointerEvent, state: DragState) {
    svgRef.current?.setPointerCapture(e.pointerId)
    dragRef.current = state
    setDragMode(state.mode)
  }

  function handleItemPointerDown(e: ReactPointerEvent, item: CanvasItem) {
    // preventDefault не вызываем: клик по холсту должен снимать фокус с поля поиска,
    // иначе Delete продолжит считаться вводом текста. Выделение текста гасит select-none.
    if (e.button !== 0 || !svgRef.current) return
    e.stopPropagation()
    selectItem(item.id)

    const point = toCanvasPoint(svgRef.current, e.clientX, e.clientY)
    if (!point) return
    startDrag(e, { mode: 'move', pointerId: e.pointerId, itemId: item.id, offsetX: item.x - point.x, offsetY: item.y - point.y })
  }

  function handleScalePointerDown(e: ReactPointerEvent, item: CanvasItem) {
    if (e.button !== 0 || !svgRef.current) return
    e.stopPropagation()

    const point = toCanvasPoint(svgRef.current, e.clientX, e.clientY)
    if (!point) return
    const dx = point.x - item.x
    const dy = point.y - item.y
    const distance = Math.hypot(dx, dy)
    if (distance < 1) return
    startDrag(e, {
      mode: 'scale',
      pointerId: e.pointerId,
      itemId: item.id,
      centerX: item.x,
      centerY: item.y,
      startScale: item.scale,
      dirX: dx / distance,
      dirY: dy / distance,
      startDistance: distance,
    })
  }

  function handlePointerMove(e: ReactPointerEvent<SVGSVGElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== e.pointerId) return
    const point = toCanvasPoint(e.currentTarget, e.clientX, e.clientY)
    if (!point) return

    if (drag.mode === 'move') {
      moveItem(drag.itemId, point.x + drag.offsetX, point.y + drag.offsetY)
    } else {
      const projection = (point.x - drag.centerX) * drag.dirX + (point.y - drag.centerY) * drag.dirY
      setItemScale(drag.itemId, (drag.startScale * projection) / drag.startDistance)
    }
  }

  function endDrag(e: ReactPointerEvent<SVGSVGElement>) {
    if (!dragRef.current || dragRef.current.pointerId !== e.pointerId) return
    dragRef.current = null
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
    setDragMode(null)
  }

  const dragCursor =
    dragMode === 'move' ? 'grabbing' : dragMode === 'scale' && selectedItem ? resizeCursor(selectedItem.rotation) : undefined

  return (
    <>
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
        className="block size-full touch-none overflow-visible rounded-sm bg-white ring-1 ring-zinc-200 select-none"
        style={{ cursor: dragCursor }}
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
                style={{ cursor: dragMode ? undefined : 'grab' }}
                onPointerDown={(e) => handleItemPointerDown(e, item)}
              >
                <SvgNodes component={component} colors={colors} />
              </g>
            )
          })}
        </g>

        {/* Вспомогательный слой редактора — не входит в композицию и экспорт */}
        {selectedItem && selectedComponent && (
          <SelectionFrame
            item={selectedItem}
            {...scaledHalfSize(selectedItem, selectedComponent)}
            onScalePointerDown={(e) => handleScalePointerDown(e, selectedItem)}
          />
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

function SelectionFrame({
  item,
  halfWidth,
  halfHeight,
  onScalePointerDown,
}: {
  item: CanvasItem
  halfWidth: number
  halfHeight: number
  onScalePointerDown: (e: ReactPointerEvent) => void
}) {
  const frameX = halfWidth + SELECTION_PADDING
  const frameY = halfHeight + SELECTION_PADDING

  return (
    <g data-layer="overlay" transform={itemFrameTransform(item)}>
      <rect
        x={-frameX}
        y={-frameY}
        width={frameX * 2}
        height={frameY * 2}
        fill="none"
        stroke={SELECTION_COLOR}
        strokeWidth={1.5}
        strokeDasharray="6 4"
        vectorEffect="non-scaling-stroke"
        pointerEvents="none"
      />
      <g
        data-handle="scale"
        transform={`translate(${frameX} ${frameY})`}
        style={{ cursor: resizeCursor(item.rotation) }}
        onPointerDown={onScalePointerDown}
      >
        <circle r={HANDLE_HIT_RADIUS} fill="transparent" />
        <rect
          x={-HANDLE_SIZE / 2}
          y={-HANDLE_SIZE / 2}
          width={HANDLE_SIZE}
          height={HANDLE_SIZE}
          rx={3}
          fill="#FFFFFF"
          stroke={SELECTION_COLOR}
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </g>
  )
}
