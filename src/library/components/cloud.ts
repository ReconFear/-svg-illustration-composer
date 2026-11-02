import { defineComponent, el } from '../define'

export const cloud = defineComponent({
  id: 'cloud',
  name: 'Облако',
  category: 'weather',
  tags: {
    ru: ['облако', 'облачный', 'небо', 'погода', 'солнце', 'хранилище', 'сервис', 'мечта', 'лёгкость'],
    en: ['cloud', 'sky', 'weather', 'sun', 'storage', 'service', 'saas', 'dream', 'computing'],
  },
  elements: [
    // солнце
    el('circle', { cx: 142, cy: 76, r: 26 }, 'accent'),
    // дальнее облако
    el('rect', { x: 108, y: 102, width: 68, height: 28, rx: 14 }, 'primary'),
    el('circle', { cx: 130, cy: 102, r: 20 }, 'primary'),
    el('circle', { cx: 154, cy: 108, r: 14 }, 'primary'),
    // ближнее облако
    el('rect', { x: 30, y: 118, width: 124, height: 40, rx: 20 }, 'secondary'),
    el('circle', { cx: 66, cy: 118, r: 24 }, 'secondary'),
    el('circle', { cx: 102, cy: 104, r: 34 }, 'secondary'),
    el('circle', { cx: 134, cy: 122, r: 22 }, 'secondary'),
    // блик
    el('path', { d: 'M82 102 A22 22 0 0 1 100 84', 'stroke-width': 6, 'stroke-linecap': 'round' }, undefined, 'background'),
  ],
})
