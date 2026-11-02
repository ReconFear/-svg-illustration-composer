import type { CanvasItem, SVGComponent } from '../types'

/**
 * Transform группы объекта на холсте.
 * Читается справа налево: центр viewBox компонента переносится в начало координат,
 * затем масштаб и поворот вокруг него, затем перенос в точку (x, y) холста.
 * Так x/y всегда остаются центром объекта, а scale/rotation — относительно центра.
 */
export function itemTransform(item: CanvasItem, component: SVGComponent): string {
  const { width, height } = component.viewBox
  return `translate(${item.x} ${item.y}) rotate(${item.rotation}) scale(${item.scale}) translate(${-width / 2} ${-height / 2})`
}
