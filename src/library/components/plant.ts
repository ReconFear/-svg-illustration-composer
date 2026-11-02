import { defineComponent, el } from '../define'

export const plant = defineComponent({
  id: 'plant',
  name: 'Растение',
  category: 'nature',
  tags: {
    ru: ['растение', 'цветок', 'росток', 'природа', 'рост', 'развитие', 'экология', 'забота', 'устойчивость', 'зелень'],
    en: ['plant', 'flower', 'sprout', 'nature', 'growth', 'development', 'ecology', 'eco', 'care', 'sustainability'],
  },
  elements: [
    el('ellipse', { cx: 100, cy: 182, rx: 44, ry: 6 }, 'background'),
    // стебель
    el('path', { d: 'M100 118 C100 94 100 72 100 46', 'stroke-width': 5, 'stroke-linecap': 'round' }, undefined, 'neutral'),
    // листья
    el('path', { d: 'M100 94 C80 94 60 84 54 60 C78 58 96 70 100 94 Z' }, 'primary'),
    el('path', { d: 'M100 76 C118 76 136 66 142 44 C120 42 104 54 100 76 Z' }, 'secondary'),
    el('path', { d: 'M100 50 C91 42 89 29 98 16 C109 27 109 40 100 50 Z' }, 'primary'),
    el('path', { d: 'M100 110 C113 112 128 105 134 92 C119 88 106 96 100 110 Z' }, 'primary'),
    // горшок
    el('path', { d: 'M66 124 H134 L127 171 A6 6 0 0 1 121 176 H79 A6 6 0 0 1 73 171 Z' }, 'accent'),
    el('rect', { x: 60, y: 112, width: 80, height: 16, rx: 5 }, 'primary'),
  ],
})
