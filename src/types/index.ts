/**
 * Семантические цветовые роли. Компоненты библиотеки ссылаются на роли,
 * а не на конкретные цвета — палитра сопоставляет каждой роли hex-цвет.
 */
export type ColorRole = 'primary' | 'secondary' | 'accent' | 'background' | 'neutral'

export type SVGElementTag =
  | 'g'
  | 'path'
  | 'circle'
  | 'ellipse'
  | 'rect'
  | 'polygon'
  | 'polyline'
  | 'line'

/**
 * Один графический элемент компонента. Геометрия в attrs не меняется при перекраске.
 * attrs хранятся с именами SVG-атрибутов (stroke-width, fill-rule) — в таком виде
 * они попадают в экспорт; для React имена переводятся в camelCase при рендере.
 * Цвет задаётся только ролями fill/stroke; элемент без fill рисуется с fill="none".
 */
export interface SVGElementNode {
  tag: SVGElementTag
  attrs?: Record<string, string | number>
  fill?: ColorRole
  stroke?: ColorRole
  children?: SVGElementNode[]
}

/** Компонент библиотеки (встроенный или импортированный пользователем). */
export interface SVGComponent {
  id: string
  name: string
  category: string
  tags: {
    ru: string[]
    en: string[]
  }
  /** Размер собственной системы координат компонента (viewBox="0 0 width height"). */
  viewBox: {
    width: number
    height: number
  }
  elements: SVGElementNode[]
  /** Роли, которые реально используются в elements и доступны для перекраски. */
  colorRoles: ColorRole[]
  source: 'builtin' | 'imported'
}

export interface Palette {
  id: string
  name: string
  colors: PaletteColors
}

/** Экземпляр компонента на холсте. x/y — центр объекта в координатах холста. */
export interface CanvasItem {
  id: string
  componentId: string
  x: number
  y: number
  scale: number
  /** Градусы, по часовой стрелке, вокруг центра объекта. */
  rotation: number
}

export type PaletteColors = Record<ColorRole, string>

/** Источник истины для холста и экспорта. Порядок items = порядок наложения (последний сверху). */
export interface Composition {
  width: number
  height: number
  /** id готовой палитры или 'custom' — тогда цвета берутся из customColors. */
  paletteId: string
  /** Пользовательская палитра (загруженная или отредактированная); хранится, даже когда выбран пресет. */
  customColors: PaletteColors | null
  customPaletteName: string | null
  items: CanvasItem[]
}
