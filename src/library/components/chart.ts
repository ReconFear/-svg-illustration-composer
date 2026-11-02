import { defineComponent, el } from '../define'

const dot = { r: 5, 'stroke-width': 3 }

export const chart = defineComponent({
  id: 'chart',
  name: 'График',
  category: 'business',
  tags: {
    ru: ['график', 'диаграмма', 'аналитика', 'рост', 'бизнес', 'продажи', 'прибыль', 'статистика', 'отчёт', 'развитие', 'финансы'],
    en: ['chart', 'graph', 'analytics', 'growth', 'business', 'sales', 'profit', 'statistics', 'report', 'progress', 'finance'],
  },
  elements: [
    // карточка
    el('rect', { x: 28, y: 28, width: 144, height: 136, rx: 14 }, 'background'),
    // столбцы
    el('rect', { x: 50, y: 116, width: 20, height: 28, rx: 4 }, 'secondary'),
    el('rect', { x: 78, y: 98, width: 20, height: 46, rx: 4 }, 'secondary'),
    el('rect', { x: 106, y: 80, width: 20, height: 64, rx: 4 }, 'primary'),
    el('rect', { x: 134, y: 62, width: 20, height: 82, rx: 4 }, 'primary'),
    el('line', { x1: 42, y1: 146, x2: 160, y2: 146, 'stroke-width': 4, 'stroke-linecap': 'round' }, undefined, 'neutral'),
    // линия тренда со стрелкой
    el(
      'polyline',
      { points: '60,102 88,84 116,66 146,42', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
      undefined,
      'accent',
    ),
    el('polygon', { points: '154.2,35.8 147.4,52.2 136.6,38.7', 'stroke-width': 3, 'stroke-linejoin': 'round' }, 'accent', 'accent'),
    el('circle', { cx: 60, cy: 102, ...dot }, 'background', 'accent'),
    el('circle', { cx: 88, cy: 84, ...dot }, 'background', 'accent'),
    el('circle', { cx: 116, cy: 66, ...dot }, 'background', 'accent'),
  ],
})
