import type { ColorRole, Palette, PaletteColors } from '../types'

export const COLOR_ROLES: ColorRole[] = ['primary', 'secondary', 'accent', 'background', 'neutral']

export const COLOR_ROLE_LABELS: Record<ColorRole, string> = {
  primary: 'Основной',
  secondary: 'Дополнительный',
  accent: 'Акцент',
  background: 'Фон и блики',
  neutral: 'Контуры и детали',
}

export const defaultPalette: Palette = {
  id: 'default',
  name: 'Default',
  colors: {
    primary: '#4F46E5',
    secondary: '#A5B4FC',
    accent: '#F59E0B',
    background: '#E0E7FF',
    neutral: '#1E1B4B',
  },
}

export const palettes: Palette[] = [
  defaultPalette,
  {
    id: 'pastel',
    name: 'Pastel',
    colors: {
      primary: '#E98FB0',
      secondary: '#A3D2EC',
      accent: '#FFCB77',
      background: '#FDEFF4',
      neutral: '#5E548E',
    },
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    colors: {
      primary: '#FF006E',
      secondary: '#3A86FF',
      accent: '#FFBE0B',
      background: '#FFE3EF',
      neutral: '#14213D',
    },
  },
  {
    id: 'nature',
    name: 'Nature',
    colors: {
      primary: '#2D6A4F',
      secondary: '#95D5B2',
      accent: '#E9A23B',
      background: '#E9F5DB',
      neutral: '#1B3A2B',
    },
  },
  {
    // Тёмная гамма для светлого холста: глубокие сланцевые тона, холодный акцент,
    // светлый background оставлен для бликов и экранов, чтобы рисунки читались.
    id: 'dark',
    name: 'Dark',
    colors: {
      primary: '#1E293B',
      secondary: '#64748B',
      accent: '#22D3EE',
      background: '#CBD5E1',
      neutral: '#020617',
    },
  },
]

export const CUSTOM_PALETTE_ID = 'custom'

export function getPalette(id: string): Palette {
  return palettes.find((p) => p.id === id) ?? defaultPalette
}

/**
 * Единая точка получения цветов композиции: холст, миниатюры и экспорт берут цвета только отсюда.
 * 'custom' → пользовательские цвета (если их нет — Default), иначе — готовая палитра.
 */
export function resolvePalette(paletteId: string, customColors: PaletteColors | null): PaletteColors {
  if (paletteId === CUSTOM_PALETTE_ID) return customColors ?? defaultPalette.colors
  return getPalette(paletteId).colors
}
