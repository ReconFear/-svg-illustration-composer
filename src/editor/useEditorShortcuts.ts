import { useEffect } from 'react'
import { useEditorStore } from '../store/editorStore'

const NON_TEXT_INPUT_TYPES = ['range', 'checkbox', 'radio', 'button', 'submit', 'reset', 'color']

/** Пользователь вводит текст — клавиши редактора не перехватываем. Ползунок текстом не считается. */
function isTextInput(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (target instanceof HTMLInputElement) return !NON_TEXT_INPUT_TYPES.includes(target.type)
  return target.isContentEditable || ['TEXTAREA', 'SELECT'].includes(target.tagName)
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
