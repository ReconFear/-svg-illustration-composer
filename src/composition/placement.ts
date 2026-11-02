function clampAxis(value: number, halfExtent: number, size: number) {
  // Объект крупнее холста по этой оси — центрируем, иначе держим габариты внутри.
  if (halfExtent * 2 >= size) return size / 2
  return Math.min(Math.max(value, halfExtent), size - halfExtent)
}

/**
 * Ограничивает центр объекта так, чтобы его габариты (с учётом scale и rotation)
 * целиком оставались в пределах холста. halfX/halfY — половины rotated AABB.
 */
export function clampToCanvas(
  x: number,
  y: number,
  halfX: number,
  halfY: number,
  canvasWidth: number,
  canvasHeight: number,
) {
  return {
    x: clampAxis(x, halfX, canvasWidth),
    y: clampAxis(y, halfY, canvasHeight),
  }
}

const DUPLICATE_OFFSET = 24

/** Сдвиг копии по оси: вперёд, а если у края сдвинуться вперёд нельзя — назад. */
function offsetAxis(value: number, halfExtent: number, size: number) {
  const forward = clampAxis(value + DUPLICATE_OFFSET, halfExtent, size)
  return forward !== value ? forward : clampAxis(value - DUPLICATE_OFFSET, halfExtent, size)
}

/** Позиция копии: правее и ниже оригинала, у края холста — в обратную сторону, габариты внутри холста. */
export function duplicatePosition(
  x: number,
  y: number,
  halfX: number,
  halfY: number,
  canvasWidth: number,
  canvasHeight: number,
) {
  return {
    x: offsetAxis(x, halfX, canvasWidth),
    y: offsetAxis(y, halfY, canvasHeight),
  }
}

const CASCADE_STEP = 36
const CASCADE_LENGTH = 6
const ROW_SHIFT = 120

/**
 * Позиция центра для объекта, добавляемого вручную из библиотеки.
 * Первый объект — в центре холста, следующие сдвигаются по диагонали,
 * через каждые CASCADE_LENGTH объектов серия начинается левее.
 * Для объекта 200×200 при scale = 1 все позиции остаются в пределах 1200×800.
 */
export function cascadePosition(index: number, canvasWidth: number, canvasHeight: number) {
  const step = index % CASCADE_LENGTH
  const row = Math.floor(index / CASCADE_LENGTH) % 3
  return {
    x: canvasWidth / 2 + step * CASCADE_STEP - row * ROW_SHIFT,
    y: canvasHeight / 2 + step * CASCADE_STEP,
  }
}
