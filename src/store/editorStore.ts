import { create } from 'zustand'
import type { CanvasItem, Composition } from '../types'
import { cascadePosition } from '../composition/placement'

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
}))
