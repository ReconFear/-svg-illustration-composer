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
