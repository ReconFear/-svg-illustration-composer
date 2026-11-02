import type { SVGComponent } from '../types'
import { normalizeText } from '../library'
import { isWordForm } from './query'
import { CONCEPTS, NEUTRAL_COMPONENTS } from './concepts'
import type { LayoutType } from './layouts'

export const MIN_METAPHOR_COMPONENTS = 3
export const MAX_METAPHOR_COMPONENTS = 5

/** Компонент попадает в композицию, если его релевантность не ниже этой доли от лучшего. */
const RELEVANCE_CUTOFF = 0.4
/** Прямое совпадение слова запроса с тегом компонента. */
const TAG_BONUS = 1.5
/** Вес компонента в теме, начиная с которого тема считается представленной этим компонентом. */
const CONCEPT_REPRESENTATIVE_WEIGHT = 2
/** Если второй компонент почти так же релевантен, как первый, явного главного нет — Balanced. */
const BALANCED_TIE_RATIO = 1.2

const STOP_WORDS = new Set([
  'и', 'в', 'во', 'на', 'для', 'с', 'со', 'по', 'к', 'ко', 'о', 'об', 'от', 'до', 'из', 'за', 'у', 'а', 'но',
  'или', 'не', 'как', 'это', 'над', 'под', 'при', 'про', 'без', 'мы', 'наш', 'наша', 'наше', 'наши', 'свой',
  'the', 'a', 'an', 'of', 'and', 'or', 'for', 'to', 'in', 'on', 'with', 'by', 'at', 'from', 'our', 'your', 'my',
])

/** «Развитие бизнеса!» → ['развитие', 'бизнеса']. Нормализация, разбиение на слова, без стоп-слов и повторов. */
export function tokenize(text: string): string[] {
  const words = normalizeText(text)
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word))
  return [...new Set(words)]
}

/** «бизнес*» — основа (совпадает начало слова), «план» — только точная форма. */
function matchesKeyword(token: string, keyword: string): boolean {
  return keyword.endsWith('*') ? token.startsWith(keyword.slice(0, -1)) : token === keyword
}

/** Минимальная длина тега, чтобы считать его основой («документ» → «документами»). Короче — ложные совпадения. */
const TAG_STEM_MIN_LENGTH = 5

function matchesTag(token: string, tag: string): boolean {
  const normalized = normalizeText(tag)
  return (
    token === normalized ||
    isWordForm(token, normalized) ||
    (normalized.length >= TAG_STEM_MIN_LENGTH && token.startsWith(normalized))
  )
}

export interface MatchedComponent {
  componentId: string
  score: number
}

export interface MatchedConcept {
  id: string
  label: string
  /** Сколько разных слов запроса относится к теме. */
  hits: number
}

export interface MetaphorAnalysis {
  /** По убыванию релевантности, без повторов. */
  components: MatchedComponent[]
  /** Распознанные темы по убыванию числа совпадений. */
  concepts: MatchedConcept[]
  /** Откуда взялся результат: темы словаря, только теги библиотеки или ничего. */
  source: 'concepts' | 'tags' | 'none'
}

/**
 * Релевантность компонента = Σ (совпадений с темой × вес компонента в теме) + бонус за совпадения с его тегами.
 * Каждая тема получает баллы независимо, поэтому фраза из нескольких тем учитывает их все.
 * При равенстве выигрывает компонент с самым сильным вкладом одной темы, затем — порядок библиотеки.
 */
export function analyzeMetaphor(query: string, library: SVGComponent[]): MetaphorAnalysis {
  const tokens = tokenize(query)
  const scores = new Map<string, { score: number; strongest: number }>()
  const add = (componentId: string, points: number) => {
    const entry = scores.get(componentId) ?? { score: 0, strongest: 0 }
    entry.score += points
    entry.strongest = Math.max(entry.strongest, points)
    scores.set(componentId, entry)
  }

  const concepts: MatchedConcept[] = []
  for (const concept of CONCEPTS) {
    const hits = tokens.filter((token) => concept.keywords.some((keyword) => matchesKeyword(token, keyword))).length
    if (hits === 0) continue
    concepts.push({ id: concept.id, label: concept.label, hits })
    for (const [componentId, weight] of Object.entries(concept.components)) add(componentId, hits * weight)
  }

  for (const component of library) {
    const tags = [component.id, component.name, ...component.tags.ru, ...component.tags.en]
    const tagHits = tokens.filter((token) => tags.some((tag) => matchesTag(token, tag))).length
    if (tagHits > 0) add(component.id, tagHits * TAG_BONUS)
  }

  const libraryIndex = new Map(library.map((component, i) => [component.id, i]))
  const components = [...scores.entries()]
    .filter(([componentId]) => libraryIndex.has(componentId))
    .sort(
      ([idA, a], [idB, b]) =>
        b.score - a.score || b.strongest - a.strongest || libraryIndex.get(idA)! - libraryIndex.get(idB)!,
    )
    .map(([componentId, { score }]) => ({ componentId, score }))

  concepts.sort((a, b) => b.hits - a.hits)
  const source = concepts.length > 0 ? 'concepts' : components.length > 0 ? 'tags' : 'none'
  return { components, concepts, source }
}

/** Только ранжированный список компонентов с релевантностью. */
export function matchMetaphor(query: string, library: SVGComponent[]): MatchedComponent[] {
  return analyzeMetaphor(query, library).components
}

/**
 * Выбирает 3–5 компонентов; первый — самый релевантный, он станет главным объектом.
 * 1. Сколько брать: все, чья релевантность ≥ 40% от лучшей, но в пределах 3–5.
 * 2. Каждая распознанная тема представлена хотя бы одним своим сильным компонентом.
 * 3. Остальное — по убыванию релевантности; если релевантных меньше трёх — универсальные объекты.
 */
export function selectMetaphorComponents(analysis: MetaphorAnalysis, library: SVGComponent[]): string[] {
  const available = new Set(library.map((component) => component.id))
  const neutral = NEUTRAL_COMPONENTS.filter((id) => available.has(id))
  if (analysis.components.length === 0) return neutral

  const ranked = analysis.components
  const relevant = ranked.filter((c) => c.score >= ranked[0].score * RELEVANCE_CUTOFF).length
  const target = Math.min(Math.max(relevant, MIN_METAPHOR_COMPONENTS), MAX_METAPHOR_COMPONENTS)
  const picked: string[] = []

  for (const matched of analysis.concepts) {
    const concept = CONCEPTS.find((c) => c.id === matched.id)
    if (!concept || picked.length >= MAX_METAPHOR_COMPONENTS) continue
    const isRepresented = picked.some((id) => (concept.components[id] ?? 0) >= CONCEPT_REPRESENTATIVE_WEIGHT)
    if (isRepresented) continue
    const best = Object.entries(concept.components)
      .filter(([id]) => available.has(id) && !picked.includes(id))
      .sort(([, a], [, b]) => b - a)[0]
    if (best) picked.push(best[0])
  }

  for (const { componentId } of ranked) {
    if (picked.length >= target) break
    if (!picked.includes(componentId)) picked.push(componentId)
  }

  for (const id of neutral) {
    if (picked.length >= MIN_METAPHOR_COMPONENTS) break
    if (!picked.includes(id)) picked.push(id)
  }

  const rank = (id: string) => {
    const index = ranked.findIndex((c) => c.componentId === id)
    return index === -1 ? ranked.length : index
  }
  return picked.sort((a, b) => rank(a) - rank(b))
}

/**
 * Hero по умолчанию. Balanced — когда запрос объединяет несколько тем и у лидера нет
 * явного отрыва (второй компонент набрал больше 1/1.2 его баллов): главного объекта нет.
 */
export function chooseMetaphorLayout(analysis: MetaphorAnalysis): LayoutType {
  const [first, second] = analysis.components
  if (analysis.concepts.length >= 2 && first && second && second.score * BALANCED_TIE_RATIO > first.score) {
    return 'balanced'
  }
  return 'hero'
}
