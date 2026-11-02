import type { SVGComponent } from '../types'
import { normalizeText } from '../library'

export const MAX_COMPONENTS_PER_GENERATION = 6

/** «ракета, облако; звезда\nplant» → ['ракета', 'облако', 'звезда', 'plant']. Пустые значения отбрасываются. */
export function parseComponentQuery(input: string): string[] {
  return input
    .split(/[,;\n]+/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function commonPrefixLength(a: string, b: string): number {
  let i = 0
  while (i < a.length && i < b.length && a[i] === b[i]) i++
  return i
}

/** Простая словоформа: «ракеты» ~ «ракета», «stars» ~ «star». Отличие только в окончании до 2 символов. */
function isWordForm(query: string, word: string): boolean {
  const prefix = commonPrefixLength(query, word)
  return prefix >= 4 && prefix >= Math.max(query.length, word.length) - 2
}

/**
 * Один компонент на одно название. Приоритет: точный id/название → точный тег → словоформа.
 * Внутри уровня берётся первый компонент в порядке библиотеки — результат воспроизводим.
 */
function findComponent(name: string, components: SVGComponent[]): SVGComponent | undefined {
  const q = normalizeText(name)
  const tags = (c: SVGComponent) => [...c.tags.ru, ...c.tags.en].map(normalizeText)
  const names = (c: SVGComponent) => [normalizeText(c.id), normalizeText(c.name)]

  return (
    components.find((c) => names(c).includes(q)) ??
    components.find((c) => tags(c).includes(q)) ??
    components.find((c) => [...names(c), ...tags(c)].some((word) => isWordForm(q, word)))
  )
}

export interface ComponentMatchResult {
  /** Найденные компоненты в порядке ввода (повторы допустимы: «звезда, звезда» — две звезды). */
  matched: SVGComponent[]
  /** Названия, для которых ничего не нашлось, в исходном написании. */
  missing: string[]
}

export function matchComponents(names: string[], components: SVGComponent[]): ComponentMatchResult {
  const matched: SVGComponent[] = []
  const missing: string[] = []
  for (const name of names) {
    const component = findComponent(name, components)
    if (component) matched.push(component)
    else missing.push(name)
  }
  return { matched, missing }
}
