import { createElement, type ReactElement } from 'react'
import type { ColorRole, SVGComponent, SVGElementNode } from '../types'

type Colors = Record<ColorRole, string>

/** stroke-width → strokeWidth: данные хранят SVG-имена атрибутов, React ждёт camelCase. */
const toReactProp = (name: string) => name.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())

function renderNode(node: SVGElementNode, colors: Colors, key: number): ReactElement {
  const props: Record<string, string | number> = { key }
  if (node.attrs) {
    for (const [name, value] of Object.entries(node.attrs)) props[toReactProp(name)] = value
  }

  if (node.tag === 'g') {
    return createElement('g', props, node.children?.map((child, i) => renderNode(child, colors, i)))
  }

  props.fill = node.fill ? colors[node.fill] : 'none'
  if (node.stroke) props.stroke = colors[node.stroke]
  return createElement(node.tag, props)
}

/** Рисует элементы компонента в его собственной системе координат (0 0 w h). */
export function SvgNodes({ component, colors }: { component: SVGComponent; colors: Colors }) {
  return <>{component.elements.map((node, i) => renderNode(node, colors, i))}</>
}

/** Самостоятельная миниатюра компонента с собственным viewBox. */
export function ComponentPreview({
  component,
  colors,
  className,
}: {
  component: SVGComponent
  colors: Colors
  className?: string
}) {
  const { width, height } = component.viewBox
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden>
      <SvgNodes component={component} colors={colors} />
    </svg>
  )
}
