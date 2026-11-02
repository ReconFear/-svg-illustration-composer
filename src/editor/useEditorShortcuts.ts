import { useEffect } from 'react'
import { useEditorStore } from '../store/editorStore'

/** Пользователь вводит текст — клавиши редактора не перехватываем. */
function isTextInput(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

export function useEditorShortcuts() {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return
      if (isTextInput(e.target)) return
      const { selectedItemId, removeItem } = useEditorStore.getState()
      if (!selectedItemId) return
      e.preventDefault()
      removeItem(selectedItemId)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
