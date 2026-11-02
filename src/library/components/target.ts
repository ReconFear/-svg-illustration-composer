import { defineComponent, el } from '../define'

export const target = defineComponent({
  id: 'target',
  name: 'Мишень',
  category: 'goals',
  tags: {
    ru: ['мишень', 'цель', 'задача', 'точность', 'фокус', 'стратегия', 'результат', 'достижение', 'kpi'],
    en: ['target', 'goal', 'aim', 'objective', 'accuracy', 'focus', 'strategy', 'result', 'achievement', 'kpi'],
  },
  elements: [
    // кольца
    el('circle', { cx: 92, cy: 108, r: 60 }, 'primary'),
    el('circle', { cx: 92, cy: 108, r: 47 }, 'background'),
    el('circle', { cx: 92, cy: 108, r: 34 }, 'secondary'),
    el('circle', { cx: 92, cy: 108, r: 21 }, 'background'),
    el('circle', { cx: 92, cy: 108, r: 10 }, 'accent'),
    // стрела
    el('line', { x1: 94, y1: 106, x2: 156, y2: 44, 'stroke-width': 6, 'stroke-linecap': 'round' }, undefined, 'neutral'),
    el('polygon', { points: '150,50 150,32 160,22 160,40', 'stroke-width': 2, 'stroke-linejoin': 'round' }, 'accent', 'accent'),
    el('polygon', { points: '150,50 168,50 178,40 160,40', 'stroke-width': 2, 'stroke-linejoin': 'round' }, 'accent', 'accent'),
  ],
})
