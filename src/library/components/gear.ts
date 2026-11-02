import { defineComponent, el, gearPath } from '../define'

export const gear = defineComponent({
  id: 'gear',
  name: 'Шестерёнки',
  category: 'tech',
  tags: {
    ru: ['шестерёнка', 'шестеренка', 'механизм', 'настройки', 'процесс', 'автоматизация', 'система', 'инженерия', 'работа'],
    en: ['gear', 'gears', 'cog', 'settings', 'process', 'automation', 'system', 'engineering', 'mechanism'],
  },
  elements: [
    // большая шестерёнка
    el('path', { d: gearPath(84, 88, 56, 45, 10) }, 'primary'),
    el('circle', { cx: 84, cy: 88, r: 28 }, 'secondary'),
    el('circle', { cx: 84, cy: 88, r: 13 }, 'background'),
    // малая шестерёнка
    el('path', { d: gearPath(142, 140, 32, 25, 8) }, 'accent'),
    el('circle', { cx: 142, cy: 140, r: 10 }, 'background'),
  ],
})
