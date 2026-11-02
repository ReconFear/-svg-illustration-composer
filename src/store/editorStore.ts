import { create } from 'zustand'
import type { CanvasItem, Composition } from '../types'
import { cascadePosition, clampToCanvas, duplicatePosition } from '../composition/placement'
import { clampScale, normalizeRotation, rotatedHalfExtents } from '../editor/geometry'
import { getComponentById } from '../library'

export const CANVAS_WIDTH = 1200
export const CANVAS_HEIGHT = 800

export function createEmptyComposition(): Composition {
  return {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    paletteId: 'default',
    items: [],
  }
}

function createItemId(): string {
  return `item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

interface EditorState {
  projectName: string
  composition: Composition
  selectedItemId: string | null
  /** Добавляет экземпляр компонента на холст и выделяет его. Возвращает id нового объекта. */
  addItem: (componentId: string) => string
  selectItem: (id: string | null) => void
  /** Перемещает центр объекта; габариты объекта ограничиваются холстом. */
  moveItem: (id: string, x: number, y: number) => void
  /** Масштаб ограничивается MIN_SCALE…MAX_SCALE, позиция при необходимости сдвигается внутрь холста. */
  setItemScale: (id: string, scale: number) => void
  /** Угол в градусах, нормализуется в [-180, 180]; позиция при необходимости сдвигается внутрь холста. */
  setItemRotation: (id: string, rotation: number) => void
  removeItem: (id: string) => void
  /** Копия кладётся сразу над оригиналом и выделяется. Возвращает id копии. */
  duplicateItem: (id: string) => string | null
  moveLayerUp: (id: string) => void
  moveLayerDown: (id: string) => void
}

/** Возвращает объект с центром, сдвинутым так, чтобы его rotated AABB оставался на холсте. */
function keepInsideCanvas(item: CanvasItem, composition: Composition): CanvasItem {
  const component = getComponentById(item.componentId)
  if (!component) return item
  const { halfX, halfY } = rotatedHalfExtents(item, component)
  return { ...item, ...clampToCanvas(item.x, item.y, halfX, halfY, composition.width, composition.height) }
}

function updateItem(composition: Composition, id: string, update: (item: CanvasItem) => CanvasItem): Composition {
  return {
    ...composition,
    items: composition.items.map((item) => (item.id === id ? keepInsideCanvas(update(item), composition) : item)),
  }
}

/** Меняет местами объект и его соседа в порядке наложения. */
function swapWithNeighbor(items: CanvasItem[], id: string, direction: 1 | -1): CanvasItem[] {
  const index = items.findIndex((item) => item.id === id)
  const target = index + direction
  if (index === -1 || target < 0 || target >= items.length) return items
  const next = [...items]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

export const useEditorStore = create<EditorState>()((set, get) => ({
  projectName: 'Новая иллюстрация',
  composition: createEmptyComposition(),
  selectedItemId: null,

  addItem: (componentId) => {
    const { composition } = get()
    const item: CanvasItem = {
      id: createItemId(),
      componentId,
      ...cascadePosition(composition.items.length, composition.width, composition.height),
      scale: 1,
      rotation: 0,
    }
    set({
      composition: { ...composition, items: [...composition.items, item] },
      selectedItemId: item.id,
    })
    return item.id
  },

  selectItem: (id) => set({ selectedItemId: id }),

  moveItem: (id, x, y) =>
    set(({ composition }) => ({ composition: updateItem(composition, id, (item) => ({ ...item, x, y })) })),

  setItemScale: (id, scale) =>
    set(({ composition }) => ({
      composition: updateItem(composition, id, (item) => ({ ...item, scale: clampScale(scale) })),
    })),

  setItemRotation: (id, rotation) =>
    set(({ composition }) => ({
      composition: updateItem(composition, id, (item) => ({ ...item, rotation: normalizeRotation(rotation) })),
    })),

  removeItem: (id) =>
    set(({ composition, selectedItemId }) => ({
      composition: { ...composition, items: composition.items.filter((item) => item.id !== id) },
      selectedItemId: selectedItemId === id ? null : selectedItemId,
    })),

  duplicateItem: (id) => {
    const { composition } = get()
    const index = composition.items.findIndex((item) => item.id === id)
    if (index === -1) return null
    const source = composition.items[index]
    const component = getComponentById(source.componentId)
    if (!component) return null
    const { halfX, halfY } = rotatedHalfExtents(source, component)
    const copy: CanvasItem = {
      ...source,
      id: createItemId(),
      ...duplicatePosition(source.x, source.y, halfX, halfY, composition.width, composition.height),
    }
    const items = [...composition.items]
    items.splice(index + 1, 0, copy)
    set({ composition: { ...composition, items }, selectedItemId: copy.id })
    return copy.id
  },

  moveLayerUp: (id) =>
    set(({ composition }) => ({
      composition: { ...composition, items: swapWithNeighbor(composition.items, id, 1) },
    })),

  moveLayerDown: (id) =>
    set(({ composition }) => ({
      composition: { ...composition, items: swapWithNeighbor(composition.items, id, -1) },
    })),
}))
