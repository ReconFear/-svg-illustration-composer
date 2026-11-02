import type { Composition, PaletteColors, SVGComponent, SVGElementNode, SVGElementTag } from '../types'
import { getComponentById } from '../library'
import { PAINT_ATTRIBUTES, resolvePaint, resolvePalette } from '../palettes'
import { itemTransform } from '../editor/geometry'

const SVG_NS = 'http://www.w3.org/2000/svg'

/** Только векторные примитивы модели — никаких image, script, foreignObject, use. */
const ALLOWED_TAGS = new Set<SVGElementTag>(['g', 'path', 'circle', 'ellipse', 'rect', 'polygon', 'polyline', 'line'])

/** Имя атрибута: обычное SVG-имя, без обработчиков событий и ссылок на внешние ресурсы. */
function isSafeAttribute(name: string): boolean {
  return /^[a-z][a-z0-9-]*$/i.test(name) && !/^on/i.test(name) && !/href$/i.test(name) && name !== 'style'
}

/** Символы, недопустимые в XML 1.0, — XMLSerializer их не экранирует, а парсеры на них падают. */
const INVALID_XML_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g

function setAttribute(element: Element, name: string, value: string | number) {
  element.setAttribute(name, String(value).replace(INVALID_XML_CHARS, ''))
}

/** SVGElementNode → DOM-элемент SVG с подставленными цветами. Исходные данные не изменяются. */
function createNode(doc: XMLDocument, node: SVGElementNode, colors: PaletteColors): Element | null {
  if (!ALLOWED_TAGS.has(node.tag)) return null
  const element = doc.createElementNS(SVG_NS, node.tag)

  for (const [name, value] of Object.entries(node.attrs ?? {})) {
    if (isSafeAttribute(name) && !PAINT_ATTRIBUTES.has(name)) setAttribute(element, name, value)
  }

  if (node.tag === 'g') {
    for (const child of node.children ?? []) {
      const childElement = createNode(doc, child, colors)
      if (childElement) element.appendChild(childElement)
    }
  } else {
    for (const [name, value] of Object.entries(resolvePaint(node, colors))) setAttribute(element, name, value)
  }
  return element
}

/** XML-совместимый id: начинается с буквы, только латиница, цифры, «-» и «_». */
function groupId(index: number, componentId: string): string {
  const safe = componentId.replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '')
  return `object-${index + 1}${safe ? `-${safe}` : ''}`
}

/**
 * Модель композиции → самостоятельный SVG-документ.
 * Каждый CanvasItem — отдельная <g> с тем же transform, что на холсте, в порядке наложения.
 * Цветовые роли заменяются HEX-значениями активной палитры. Фон прозрачный.
 */
export function exportComposition(
  composition: Composition,
  getComponent: (id: string) => SVGComponent | undefined = getComponentById,
): string {
  const doc = document.implementation.createDocument(SVG_NS, 'svg', null)
  const svg = doc.documentElement
  setAttribute(svg, 'version', '1.1')
  setAttribute(svg, 'width', composition.width)
  setAttribute(svg, 'height', composition.height)
  setAttribute(svg, 'viewBox', `0 0 ${composition.width} ${composition.height}`)

  const colors = resolvePalette(composition.paletteId, composition.customColors)

  composition.items.forEach((item, index) => {
    const component = getComponent(item.componentId)
    if (!component) return
    const group = doc.createElementNS(SVG_NS, 'g')
    setAttribute(group, 'id', groupId(index, component.id))
    setAttribute(group, 'data-component-id', component.id)
    setAttribute(group, 'transform', itemTransform(item, component))
    for (const node of component.elements) {
      const element = createNode(doc, node, colors)
      if (element) group.appendChild(element)
    }
    svg.appendChild(group)
  })

  return `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(doc)}\n`
}
