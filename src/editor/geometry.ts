import type { CanvasItem, SVGComponent } from '../types'

export const MIN_SCALE = 0.3
export const MAX_SCALE = 2

export function clampScale(scale: number): number {
  return Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE)
}

/** Угол в диапазоне [-180, 180]; 180 оставляем как есть, чтобы ввод «180» не превращался в «-180». */
export function normalizeRotation(rotation: number): number {
  if (rotation >= -180 && rotation <= 180) return rotation
  return ((((rotation + 180) % 360) + 360) % 360) - 180
}

/** Число для SVG-атрибута: до тысячных, без хвостов вида 1.9800000000000002 (холст и экспорт совпадают). */
function num(value: number): number {
  return Math.round(value * 1000) / 1000
}

/**
 * Transform группы объекта на холсте и в экспорте.
 * Читается справа налево: центр viewBox компонента переносится в начало координат,
 * затем масштаб и поворот вокруг него, затем перенос в точку (x, y) холста.
 * Так x/y всегда остаются центром объекта, а scale/rotation — относительно центра.
 */
export function itemTransform(item: CanvasItem, component: SVGComponent): string {
  const { width, height } = component.viewBox
  return `translate(${num(item.x)} ${num(item.y)}) rotate(${num(item.rotation)}) scale(${num(item.scale)}) translate(${num(-width / 2)} ${num(-height / 2)})`
}

/** Transform рамки выделения: центр и поворот объекта, но без масштаба — отступы и ручки не растягиваются. */
export function itemFrameTransform(item: CanvasItem): string {
  return `translate(${num(item.x)} ${num(item.y)}) rotate(${num(item.rotation)})`
}

/** Половина габаритов объекта на холсте до поворота (viewBox × scale). */
export function scaledHalfSize(item: Pick<CanvasItem, 'scale'>, component: SVGComponent) {
  return {
    halfWidth: (component.viewBox.width * item.scale) / 2,
    halfHeight: (component.viewBox.height * item.scale) / 2,
  }
}

/** Половина габаритов ограничивающего прямоугольника повёрнутого viewBox (rotated AABB). */
export function rotatedHalfExtents(item: Pick<CanvasItem, 'scale' | 'rotation'>, component: SVGComponent) {
  const { halfWidth, halfHeight } = scaledHalfSize(item, component)
  const rad = (item.rotation * Math.PI) / 180
  const cos = Math.abs(Math.cos(rad))
  const sin = Math.abs(Math.sin(rad))
  return {
    halfX: halfWidth * cos + halfHeight * sin,
    halfY: halfWidth * sin + halfHeight * cos,
  }
}
