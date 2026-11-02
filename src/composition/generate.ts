import type { CanvasItem, SVGComponent } from '../types'
import { MAX_COMPONENTS_PER_GENERATION, matchComponents, parseComponentQuery } from './query'
import { generateLayout, type LayoutType } from './layouts'
import { analyzeMetaphor, chooseMetaphorLayout, selectMetaphorComponents } from './metaphor'

export interface GenerationNotice {
  /** success — точный результат; info — приблизительный или универсальный, о чём честно сообщаем. */
  kind: 'success' | 'info'
  text: string
  /** Дополнительная подсказка (например, распознанные темы) — для title. */
  details?: string
}

export type GenerationResult =
  | { ok: true; items: CanvasItem[]; components: SVGComponent[]; notice: GenerationNotice }
  | { ok: false; error: string }

function pluralRu(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1]
  return forms[2]
}

const listNames = (components: SVGComponent[]) => components.map((c) => c.name).join(', ')

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

  return {
    ok: true,
    items: generateLayout(matched, layout, canvas),
    components: matched,
    notice: { kind: 'success', text: `Собрано: ${listNames(matched)}` },
  }
}

/**
 * Сценарий «по метафоре»: текст → темы словаря → 3–5 компонентов → раскладка.
 * Самый релевантный компонент идёт первым и становится главным объектом шаблона.
 */
export function composeFromMetaphor(
  input: string,
  library: SVGComponent[],
  canvas: { width: number; height: number },
): GenerationResult {
  if (!input.trim()) {
    return { ok: false, error: 'Введите идею или заголовок, например: развитие бизнеса' }
  }

  const analysis = analyzeMetaphor(input, library)
  const byId = new Map(library.map((component) => [component.id, component]))
  const components = selectMetaphorComponents(analysis, library)
    .map((id) => byId.get(id))
    .filter((component): component is SVGComponent => component !== undefined)
  const items = generateLayout(components, chooseMetaphorLayout(analysis), canvas)

  const count = `${components.length} ${pluralRu(components.length, ['компонент', 'компонента', 'компонентов'])}`
  const notice: GenerationNotice =
    analysis.source === 'concepts'
      ? {
          kind: 'success',
          text: `Подобрано ${count}: ${listNames(components)}`,
          details: `Темы: ${analysis.concepts.map((c) => c.label).join(', ')}`,
        }
      : analysis.source === 'tags'
        ? { kind: 'info', text: `Точная тема не распознана — подобрано по ключевым словам: ${listNames(components)}` }
        : { kind: 'info', text: `Тема не распознана — показана универсальная композиция: ${listNames(components)}` }

  return { ok: true, items, components, notice }
}
