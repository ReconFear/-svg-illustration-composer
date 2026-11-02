import { create } from 'zustand'
import type { Composition } from '../types'

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

interface EditorState {
  projectName: string
  composition: Composition
  selectedItemId: string | null
}

export const useEditorStore = create<EditorState>()(() => ({
  projectName: 'Новая иллюстрация',
  composition: createEmptyComposition(),
  selectedItemId: null,
}))
