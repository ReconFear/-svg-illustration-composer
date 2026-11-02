import { defineComponent, el, starPoints } from '../define'

export const star = defineComponent({
  id: 'star',
  name: 'Звезда',
  category: 'achievement',
  tags: {
    ru: ['звезда', 'успех', 'достижение', 'награда', 'рейтинг', 'качество', 'лучший', 'мечта', 'победа', 'отзыв'],
    en: ['star', 'success', 'achievement', 'award', 'rating', 'quality', 'best', 'favorite', 'win', 'review'],
  },
  elements: [
    el('circle', { cx: 100, cy: 100, r: 72 }, 'background'),
    el('polygon', { points: starPoints(100, 106, 58, 25), 'stroke-width': 10, 'stroke-linejoin': 'round' }, 'accent', 'accent'),
    // блик на левом верхнем луче
    el('path', { d: 'M88 90 L96 72', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.6 }, undefined, 'background'),
    // искры
    el('path', { d: 'M160 28 Q161.6 40.4 174 42 Q161.6 43.6 160 56 Q158.4 43.6 146 42 Q158.4 40.4 160 28 Z' }, 'primary'),
    el('path', { d: 'M38 144 Q39 151 46 152 Q39 153 38 160 Q37 153 30 152 Q37 151 38 144 Z' }, 'secondary'),
    el('circle', { cx: 42, cy: 50, r: 5 }, 'secondary'),
    el('circle', { cx: 164, cy: 154, r: 4 }, 'primary'),
  ],
})
