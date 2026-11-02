import type { ColorRole, SVGComponent, SVGElementNode, SVGElementTag } from '../types'

type Attrs = Record<string, string | number>

/** Краткая запись элемента: el('circle', { cx, cy, r }, 'primary'). */
export function el(tag: SVGElementTag, attrs: Attrs, fill?: ColorRole, stroke?: ColorRole): SVGElementNode {
  const node: SVGElementNode = { tag, attrs }
  if (fill) node.fill = fill
  if (stroke) node.stroke = stroke
  return node
}

export function group(attrs: Attrs, children: SVGElementNode[]): SVGElementNode {
  return { tag: 'g', attrs, children }
}

function collectRoles(nodes: SVGElementNode[], roles: Set<ColorRole>) {
  for (const node of nodes) {
    if (node.fill) roles.add(node.fill)
    if (node.stroke) roles.add(node.stroke)
    if (node.children) collectRoles(node.children, roles)
  }
}

/** Встроенный компонент; список цветовых ролей вычисляется из геометрии. */
export function defineComponent(def: Omit<SVGComponent, 'colorRoles' | 'source' | 'viewBox'>): SVGComponent {
  const roles = new Set<ColorRole>()
  collectRoles(def.elements, roles)
  return {
    ...def,
    viewBox: { width: 200, height: 200 },
    colorRoles: [...roles],
    source: 'builtin',
  }
}

const round = (n: number) => Math.round(n * 10) / 10

function polar(cx: number, cy: number, r: number, angleRad: number) {
  return `${round(cx + r * Math.cos(angleRad))} ${round(cy + r * Math.sin(angleRad))}`
}

/** Контур шестерёнки с трапециевидными зубьями и дугами между ними. */
export function gearPath(cx: number, cy: number, outer: number, inner: number, teeth: number): string {
  const step = (Math.PI * 2) / teeth
  const parts: string[] = []
  for (let i = 0; i < teeth; i++) {
    const a = i * step - Math.PI / 2
    const baseStart = polar(cx, cy, inner, a - step * 0.22)
    if (i === 0) parts.push(`M${baseStart}`)
    parts.push(`L${polar(cx, cy, outer, a - step * 0.13)}`)
    parts.push(`L${polar(cx, cy, outer, a + step * 0.13)}`)
    parts.push(`L${polar(cx, cy, inner, a + step * 0.22)}`)
    parts.push(`A${inner} ${inner} 0 0 1 ${polar(cx, cy, inner, a + step * 0.78)}`)
  }
  return parts.join(' ') + ' Z'
}

/** Точки многоконечной звезды для polygon. */
export function starPoints(cx: number, cy: number, outer: number, inner: number, rays = 5): string {
  const points: string[] = []
  for (let i = 0; i < rays * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = (i * Math.PI) / rays - Math.PI / 2
    points.push(polar(cx, cy, r, a).replace(' ', ','))
  }
  return points.join(' ')
}
