import type { Palette } from '../types'

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

export const palettes: Palette[] = [defaultPalette]

export function getPalette(id: string): Palette {
  return palettes.find((p) => p.id === id) ?? defaultPalette
}
