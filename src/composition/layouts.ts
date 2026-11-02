import type { CanvasItem, SVGComponent } from '../types'
import { clampScale, rotatedHalfExtents } from '../editor/geometry'
import { clampToCanvas } from './placement'
import { createItemId } from './ids'

export type LayoutType = 'hero' | 'horizontal' | 'balanced'

/** Слот шаблона: центр и длина большей стороны объекта на холсте. */
interface Slot {
  x: number
  y: number
  size: number
}

/** Шаблоны заданы для эталонного холста 1200×800 и масштабируются под фактический. */
const REFERENCE_WIDTH = 1200
const REFERENCE_HEIGHT = 800

/**
 * Hero: первый объект — главный, крупный и почти по центру; остальные — по углам
 * вокруг него, разного размера и с намеренной асимметрией (диагонали вместо зеркал).
 */
const HERO_SLOTS: Record<number, Slot[]> = {
  1: [{ x: 600, y: 400, size: 380 }],
  2: [
    { x: 500, y: 420, size: 380 },
    { x: 900, y: 280, size: 210 },
  ],
  3: [
    { x: 600, y: 430, size: 360 },
    { x: 300, y: 250, size: 190 },
    { x: 910, y: 560, size: 200 },
  ],
  4: [
    { x: 600, y: 420, size: 360 },
    { x: 280, y: 270, size: 200 },
    { x: 930, y: 400, size: 190 },
    { x: 330, y: 610, size: 160 },
  ],
  5: [
    { x: 600, y: 420, size: 340 },
    { x: 270, y: 230, size: 180 },
    { x: 930, y: 240, size: 170 },
    { x: 920, y: 580, size: 190 },
    { x: 290, y: 590, size: 160 },
  ],
  6: [
    { x: 600, y: 400, size: 320 },
    { x: 260, y: 220, size: 160 },
    { x: 940, y: 230, size: 170 },
    { x: 930, y: 580, size: 180 },
    { x: 270, y: 590, size: 170 },
    { x: 620, y: 690, size: 140 },
  ],
}

/**
 * Balanced: объекты разбросаны по всей площади, размеры убывают от первого к последним,
 * центры смещены относительно сетки — нет ощущения таблицы, но массы уравновешены.
 */
const BALANCED_SLOTS: Record<number, Slot[]> = {
  1: [{ x: 600, y: 400, size: 320 }],
  2: [
    { x: 430, y: 360, size: 300 },
    { x: 820, y: 480, size: 240 },
  ],
  3: [
    { x: 380, y: 330, size: 280 },
    { x: 790, y: 280, size: 220 },
    { x: 700, y: 580, size: 230 },
  ],
  4: [
    { x: 350, y: 300, size: 260 },
    { x: 770, y: 250, size: 200 },
    { x: 870, y: 560, size: 230 },
    { x: 480, y: 610, size: 190 },
  ],
  5: [
    { x: 330, y: 290, size: 240 },
    { x: 720, y: 220, size: 190 },
    { x: 980, y: 430, size: 200 },
    { x: 650, y: 500, size: 230 },
    { x: 360, y: 630, size: 170 },
  ],
  6: [
    { x: 300, y: 260, size: 220 },
    { x: 650, y: 200, size: 180 },
    { x: 970, y: 300, size: 190 },
    { x: 590, y: 470, size: 210 },
    { x: 880, y: 600, size: 200 },
    { x: 300, y: 600, size: 180 },
  ],
}

const HORIZONTAL_MARGIN = 90
const HORIZONTAL_GAP = 56
/** В длинном ряду промежутки уже, иначе объекты становятся слишком мелкими. */
const HORIZONTAL_GAP_DENSE = 32
const HORIZONTAL_DENSE_FROM = 5
const HORIZONTAL_MAX_SIZE = 280
/** Насколько центральные объекты ряда крупнее крайних. */
const HORIZONTAL_CENTER_BOOST = 0.18

/**
 * Horizontal: ряд с равными промежутками, центральные объекты чуть крупнее,
 * нижние края выровнены по общей линии — группа стоит «на полке» по центру холста.
 */
function horizontalSlots(count: number): Slot[] {
  const gap = count >= HORIZONTAL_DENSE_FROM ? HORIZONTAL_GAP_DENSE : HORIZONTAL_GAP
  const middle = (count - 1) / 2
  const weights = Array.from({ length: count }, (_, i) =>
    middle === 0 ? 1 : 1 + HORIZONTAL_CENTER_BOOST * (1 - Math.abs(i - middle) / middle),
  )
  const available = REFERENCE_WIDTH - HORIZONTAL_MARGIN * 2 - gap * (count - 1)
  const totalWeight = weights.reduce((sum, w) => sum + w, 0)
  const base = Math.min(HORIZONTAL_MAX_SIZE / Math.max(...weights), available / totalWeight)
  const sizes = weights.map((w) => w * base)

  const rowWidth = sizes.reduce((sum, s) => sum + s, 0) + gap * (count - 1)
  const baseline = REFERENCE_HEIGHT / 2 + Math.max(...sizes) / 2
  let cursor = (REFERENCE_WIDTH - rowWidth) / 2
  return sizes.map((size) => {
    const slot = { x: cursor + size / 2, y: baseline - size / 2, size }
    cursor += size + gap
    return slot
  })
}

const GRID_MARGIN = 60
const GRID_FILL = 0.8

/** Запасная раскладка без пересечений: равные ячейки, неполный последний ряд центрируется. */
function gridSlots(count: number): Slot[] {
  const cols = Math.ceil(Math.sqrt(count * 1.5))
  const rows = Math.ceil(count / cols)
  const cellWidth = (REFERENCE_WIDTH - GRID_MARGIN * 2) / cols
  const cellHeight = (REFERENCE_HEIGHT - GRID_MARGIN * 2) / rows
  const size = Math.min(cellWidth, cellHeight) * GRID_FILL

  return Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / cols)
    const inRow = row === rows - 1 ? count - row * cols : cols
    const col = i % cols
    const rowOffset = ((cols - inRow) * cellWidth) / 2
    return {
      x: GRID_MARGIN + rowOffset + cellWidth * (col + 0.5),
      y: GRID_MARGIN + cellHeight * (row + 0.5),
      size,
    }
  })
}

/**
 * Слоты шаблонов размечены с запасом; общий коэффициент растягивает их от центра холста,
 * чтобы композиция занимала заметную часть площади (у рисунков внутри viewBox есть поля).
 */
const TEMPLATE_ZOOM = 1.1

function zoomFromCenter(slot: Slot): Slot {
  return {
    x: REFERENCE_WIDTH / 2 + (slot.x - REFERENCE_WIDTH / 2) * TEMPLATE_ZOOM,
    y: REFERENCE_HEIGHT / 2 + (slot.y - REFERENCE_HEIGHT / 2) * TEMPLATE_ZOOM,
    size: slot.size * TEMPLATE_ZOOM,
  }
}

function templateSlots(layout: LayoutType, count: number): Slot[] | undefined {
  if (layout === 'horizontal') return horizontalSlots(count)
  return (layout === 'hero' ? HERO_SLOTS : BALANCED_SLOTS)[count]?.map(zoomFromCenter)
}

interface CanvasSize {
  width: number
  height: number
}

function placeInSlot(component: SVGComponent, slot: Slot, canvas: CanvasSize): CanvasItem {
  const k = Math.min(canvas.width / REFERENCE_WIDTH, canvas.height / REFERENCE_HEIGHT)
  const longestSide = Math.max(component.viewBox.width, component.viewBox.height)
  const item: CanvasItem = {
    id: createItemId(),
    componentId: component.id,
    x: (slot.x * canvas.width) / REFERENCE_WIDTH,
    y: (slot.y * canvas.height) / REFERENCE_HEIGHT,
    scale: clampScale((slot.size * k) / longestSide),
    rotation: 0,
  }
  const { halfX, halfY } = rotatedHalfExtents(item, component)
  return { ...item, ...clampToCanvas(item.x, item.y, halfX, halfY, canvas.width, canvas.height) }
}

/** Допустимое перекрытие рамок: доля площади меньшей рамки. Рамки шире рисунков, так что 6% визуально незаметны. */
const MAX_OVERLAP_RATIO = 0.06

function hasSignificantOverlap(items: CanvasItem[], components: SVGComponent[]): boolean {
  const boxes = items.map((item, i) => {
    const { halfX, halfY } = rotatedHalfExtents(item, components[i])
    return { left: item.x - halfX, right: item.x + halfX, top: item.y - halfY, bottom: item.y + halfY }
  })
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i]
      const b = boxes[j]
      const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left)
      const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
      if (overlapX <= 0 || overlapY <= 0) continue
      const area = (box: typeof a) => (box.right - box.left) * (box.bottom - box.top)
      if ((overlapX * overlapY) / Math.min(area(a), area(b)) > MAX_OVERLAP_RATIO) return true
    }
  }
  return false
}

/**
 * Детерминированная раскладка: одинаковый ввод → одинаковые позиции и размеры.
 * Если шаблона для такого количества нет или после проверки границ рамки заметно
 * пересекаются (например, у импортированных несквадратных SVG), используется сетка.
 */
export function generateLayout(components: SVGComponent[], layout: LayoutType, canvas: CanvasSize): CanvasItem[] {
  if (components.length === 0) return []
  const slots = templateSlots(layout, components.length)
  if (slots) {
    const items = components.map((component, i) => placeInSlot(component, slots[i], canvas))
    if (!hasSignificantOverlap(items, components)) return items
  }
  const fallback = gridSlots(components.length)
  return components.map((component, i) => placeInSlot(component, fallback[i], canvas))
}
