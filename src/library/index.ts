import type { SVGComponent } from '../types'
import { rocket } from './components/rocket'
import { cloud } from './components/cloud'
import { laptop } from './components/laptop'
import { person } from './components/person'
import { gear } from './components/gear'
import { lightbulb } from './components/lightbulb'
import { chart } from './components/chart'
import { target } from './components/target'
import { document as documentComponent } from './components/document'
import { shield } from './components/shield'
import { plant } from './components/plant'
import { star } from './components/star'

/** Встроенная библиотека. Новый компонент = новый файл в components/ и строка здесь. */
export const builtinComponents: SVGComponent[] = [
  rocket,
  cloud,
  laptop,
  person,
  gear,
  lightbulb,
  chart,
  target,
  documentComponent,
  shield,
  plant,
  star,
]

const byId = new Map(builtinComponents.map((c) => [c.id, c]))

export function getComponentById(id: string): SVGComponent | undefined {
  return byId.get(id)
}

/** Нормализация для поиска: регистр, пробелы по краям, «ё» → «е». */
export const normalizeText = (s: string) => s.trim().toLowerCase().replaceAll('ё', 'е')

/** Поиск по id, названию, категории и тегам (ru/en), без учёта регистра и «ё». */
export function searchComponents(components: SVGComponent[], query: string): SVGComponent[] {
  const q = normalizeText(query)
  if (!q) return components
  return components.filter((c) =>
    [c.id, c.name, c.category, ...c.tags.ru, ...c.tags.en].some((field) => normalizeText(field).includes(q)),
  )
}
