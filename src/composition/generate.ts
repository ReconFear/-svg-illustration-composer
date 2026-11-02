import type { CanvasItem, SVGComponent } from '../types'
import { MAX_COMPONENTS_PER_GENERATION, matchComponents, parseComponentQuery } from './query'
import { generateLayout, type LayoutType } from './layouts'

export type GenerationResult =
  | { ok: true; items: CanvasItem[]; components: SVGComponent[] }
  | { ok: false; error: string }

const quote = (names: string[]) => names.map((name) => `«${name}»`).join(', ')

/**
 * Сценарий «по компонентам»: текст → компоненты → раскладка.
 * Без React и store — результат записывает вызывающая сторона.
 */
export function composeFromComponentQuery(
  input: string,
  layout: LayoutType,
  library: SVGComponent[],
  canvas: { width: number; height: number },
): GenerationResult {
  const names = parseComponentQuery(input)
  if (names.length === 0) {
    return { ok: false, error: 'Введите названия компонентов через запятую, например: ракета, облако, звезда' }
  }
  if (names.length > MAX_COMPONENTS_PER_GENERATION) {
    return {
      ok: false,
      error: `Можно указать до ${MAX_COMPONENTS_PER_GENERATION} компонентов за раз, сейчас — ${names.length}`,
    }
  }

  const { matched, missing } = matchComponents(names, library)
  if (missing.length > 0) {
    const noun = missing.length === 1 ? 'Компонент не найден' : 'Компоненты не найдены'
    return { ok: false, error: `${noun} в библиотеке: ${quote(missing)}` }
  }

  return { ok: true, items: generateLayout(matched, layout, canvas), components: matched }
}
