/**
 * Центр объекта всегда остаётся внутри холста — так объект не может
 * целиком уйти за границы, но его можно частично вынести за край.
 */
export function clampToCanvas(x: number, y: number, canvasWidth: number, canvasHeight: number) {
  return {
    x: Math.min(Math.max(x, 0), canvasWidth),
    y: Math.min(Math.max(y, 0), canvasHeight),
  }
}

const DUPLICATE_OFFSET = 24
const DUPLICATE_EDGE = 60

/** Позиция копии: правее и ниже оригинала, у края холста — в обратную сторону. */
export function duplicatePosition(x: number, y: number, canvasWidth: number, canvasHeight: number) {
  const dx = x + DUPLICATE_OFFSET > canvasWidth - DUPLICATE_EDGE ? -DUPLICATE_OFFSET : DUPLICATE_OFFSET
  const dy = y + DUPLICATE_OFFSET > canvasHeight - DUPLICATE_EDGE ? -DUPLICATE_OFFSET : DUPLICATE_OFFSET
  return clampToCanvas(x + dx, y + dy, canvasWidth, canvasHeight)
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
