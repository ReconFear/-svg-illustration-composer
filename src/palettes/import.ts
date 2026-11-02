import type { PaletteColors } from '../types'

export const MAX_PALETTE_FILE_SIZE = 50 * 1024
export const MIN_PALETTE_COLORS = 3
export const MAX_PALETTE_COLORS = 8

const HEX_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i

/** «#abc», «abc», «#AABBCC» → «#AABBCC»; иначе null. */
export function normalizeHex(value: string): string | null {
  const match = HEX_PATTERN.exec(value.trim())
  if (!match) return null
  const hex = match[1].length === 3 ? [...match[1]].map((c) => c + c).join('') : match[1]
  return `#${hex.toUpperCase()}`
}

/** Линейное смешение с белым (amount > 0) или чёрным (amount < 0). amount ∈ [-1, 1]. */
export function shade(hex: string, amount: number): string {
  const target = amount > 0 ? 255 : 0
  const t = Math.abs(amount)
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return `#${channels
    .map((c) => Math.round(c + (target - c) * t))
    .map((c) => c.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`
}

const BACKGROUND_LIGHTEN = 0.85
const NEUTRAL_DARKEN = 0.7

/**
 * Набор цветов → семантические роли, по порядку:
 * 1-3 → primary, secondary, accent; 4 → background; 5 → neutral.
 * Недостающие роли выводятся из primary: background — сильное осветление, neutral — затемнение.
 * Цвета после пятого не используются.
 */
export function colorsToRoles(colors: string[]): PaletteColors {
  const [primary, secondary, accent, background, neutral] = colors
  return {
    primary,
    secondary,
    accent,
    background: background ?? shade(primary, BACKGROUND_LIGHTEN),
    neutral: neutral ?? shade(primary, -NEUTRAL_DARKEN),
  }
}

export type PaletteImportResult =
  | { ok: true; name: string; colors: PaletteColors; sourceCount: number }
  | { ok: false; error: string }

function fail(error: string): PaletteImportResult {
  return { ok: false, error }
}

function readRawColors(text: string, fileName: string): { name?: string; raw: unknown[] } | string {
  const trimmed = text.trim()
  const looksLikeJson = fileName.toLowerCase().endsWith('.json') || trimmed.startsWith('{') || trimmed.startsWith('[')
  if (!looksLikeJson) return { raw: trimmed.split(/[\s,;]+/).filter(Boolean) }

  let data: unknown
  try {
    data = JSON.parse(trimmed)
  } catch {
    return 'Файл не является корректным JSON'
  }
  if (Array.isArray(data)) return { raw: data }
  if (data && typeof data === 'object' && Array.isArray((data as { colors?: unknown }).colors)) {
    const { name, colors } = data as { name?: unknown; colors: unknown[] }
    return { name: typeof name === 'string' ? name.trim() : undefined, raw: colors }
  }
  return 'В JSON нужен массив цветов: { "name": "…", "colors": ["#235789", …] }'
}

/** Разбор содержимого файла палитры (JSON или TXT). Без File API — его читает вызывающая сторона. */
export function parsePaletteFile(text: string, fileName: string): PaletteImportResult {
  const parsed = readRawColors(text, fileName)
  if (typeof parsed === 'string') return fail(parsed)

  const colors: string[] = []
  for (const value of parsed.raw) {
    const hex = typeof value === 'string' ? normalizeHex(value) : null
    if (!hex) return fail(`Некорректный цвет: «${String(value).slice(0, 24)}». Ожидается HEX, например #235789`)
    colors.push(hex)
  }
  if (colors.length < MIN_PALETTE_COLORS || colors.length > MAX_PALETTE_COLORS) {
    return fail(`Нужно от ${MIN_PALETTE_COLORS} до ${MAX_PALETTE_COLORS} цветов, в файле — ${colors.length}`)
  }

  const baseName = fileName.replace(/\.[^.]+$/, '')
  return {
    ok: true,
    name: parsed.name || baseName || 'Своя палитра',
    colors: colorsToRoles(colors),
    sourceCount: colors.length,
  }
}

/** Чтение файла через File API с проверкой размера. */
export async function readPaletteFile(file: File): Promise<PaletteImportResult> {
  if (file.size > MAX_PALETTE_FILE_SIZE) return fail('Файл слишком большой — палитра должна весить не больше 50 КБ')
  if (file.size === 0) return fail('Файл пустой')
  try {
    return parsePaletteFile(await file.text(), file.name)
  } catch {
    return fail('Не удалось прочитать файл')
  }
}
