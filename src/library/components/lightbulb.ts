import { defineComponent, el, group } from '../define'

const ray = { 'stroke-width': 6, 'stroke-linecap': 'round' }

export const lightbulb = defineComponent({
  id: 'lightbulb',
  name: 'Лампочка',
  category: 'ideas',
  tags: {
    ru: ['лампочка', 'лампа', 'идея', 'инсайт', 'креатив', 'творчество', 'озарение', 'инновации', 'решение', 'мысль'],
    en: ['lightbulb', 'bulb', 'lamp', 'idea', 'insight', 'creative', 'creativity', 'innovation', 'solution', 'think'],
  },
  elements: [
    group({ transform: 'translate(0 16)' }, [
      // лучи
      el('line', { x1: 100, y1: 20, x2: 100, y2: 8, ...ray }, undefined, 'accent'),
      el('line', { x1: 139.6, y1: 36.4, x2: 148.1, y2: 27.9, ...ray }, undefined, 'accent'),
      el('line', { x1: 60.4, y1: 36.4, x2: 51.9, y2: 27.9, ...ray }, undefined, 'accent'),
      el('line', { x1: 156, y1: 76, x2: 168, y2: 76, ...ray }, undefined, 'accent'),
      el('line', { x1: 44, y1: 76, x2: 32, y2: 76, ...ray }, undefined, 'accent'),
      // колба
      el(
        'path',
        { d: 'M100 30 A46 46 0 0 1 128 112.6 C124 115.8 122 120 122 125 V130 H78 V125 C78 120 76 115.8 72 112.6 A46 46 0 0 1 100 30 Z' },
        'accent',
      ),
      el('path', { d: 'M74 72 A26 26 0 0 1 96 50', 'stroke-width': 6, 'stroke-linecap': 'round' }, undefined, 'background'),
      // нить накала
      el(
        'path',
        { d: 'M90 128 L90 108 L84 92 M110 128 L110 108 L116 92 M84 92 L92 98 L100 90 L108 98 L116 92', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
        undefined,
        'neutral',
      ),
      // цоколь
      el('rect', { x: 76, y: 128, width: 48, height: 10, rx: 4 }, 'primary'),
      el('rect', { x: 79, y: 140, width: 42, height: 10, rx: 4 }, 'secondary'),
      el('path', { d: 'M88 152 H112 C112 158 107 162 100 162 C93 162 88 158 88 152 Z' }, 'primary'),
    ]),
  ],
})
