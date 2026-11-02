import { defineComponent, el } from '../define'

export const laptop = defineComponent({
  id: 'laptop',
  name: 'Ноутбук',
  category: 'tech',
  tags: {
    ru: ['ноутбук', 'компьютер', 'технологии', 'работа', 'офис', 'разработка', 'код', 'онлайн', 'цифровой'],
    en: ['laptop', 'computer', 'technology', 'tech', 'work', 'office', 'development', 'code', 'online', 'digital'],
  },
  elements: [
    el('ellipse', { cx: 100, cy: 162, rx: 72, ry: 6 }, 'background'),
    // крышка и экран
    el('rect', { x: 40, y: 44, width: 120, height: 86, rx: 8 }, 'neutral'),
    el('rect', { x: 48, y: 52, width: 104, height: 70, rx: 3 }, 'background'),
    // содержимое экрана
    el('rect', { x: 58, y: 62, width: 44, height: 8, rx: 4 }, 'primary'),
    el('rect', { x: 58, y: 78, width: 32, height: 6, rx: 3 }, 'secondary'),
    el('rect', { x: 58, y: 92, width: 40, height: 5, rx: 2.5 }, 'secondary'),
    el('rect', { x: 58, y: 103, width: 28, height: 5, rx: 2.5 }, 'secondary'),
    el('rect', { x: 112, y: 88, width: 8, height: 24, rx: 2 }, 'accent'),
    el('rect', { x: 124, y: 76, width: 8, height: 36, rx: 2 }, 'primary'),
    el('rect', { x: 136, y: 96, width: 8, height: 16, rx: 2 }, 'secondary'),
    // корпус
    el('path', { d: 'M30 138 H170 L163 151 A6 6 0 0 1 157.7 154 H42.3 A6 6 0 0 1 37 151 Z' }, 'primary'),
    el('rect', { x: 22, y: 128, width: 156, height: 12, rx: 6 }, 'secondary'),
    el('rect', { x: 84, y: 128, width: 32, height: 5, rx: 2.5 }, 'primary'),
  ],
})
