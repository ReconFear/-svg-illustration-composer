import { defineComponent, el } from '../define'

export const person = defineComponent({
  id: 'person',
  name: 'Человек',
  category: 'people',
  tags: {
    ru: ['человек', 'люди', 'пользователь', 'клиент', 'команда', 'сотрудник', 'лидер', 'приветствие', 'персона'],
    en: ['person', 'people', 'user', 'customer', 'client', 'team', 'employee', 'leader', 'human', 'hello'],
  },
  elements: [
    el('ellipse', { cx: 100, cy: 184, rx: 40, ry: 6 }, 'background'),
    // ноги
    el('rect', { x: 82, y: 136, width: 15, height: 46, rx: 7.5 }, 'neutral'),
    el('rect', { x: 103, y: 136, width: 15, height: 46, rx: 7.5 }, 'neutral'),
    // руки
    el('line', { x1: 76, y1: 100, x2: 60, y2: 134, 'stroke-width': 14, 'stroke-linecap': 'round' }, undefined, 'primary'),
    el('line', { x1: 124, y1: 100, x2: 146, y2: 70, 'stroke-width': 14, 'stroke-linecap': 'round' }, undefined, 'primary'),
    el('circle', { cx: 59, cy: 139, r: 7 }, 'secondary'),
    el('circle', { cx: 148, cy: 64, r: 7 }, 'secondary'),
    // шея и туловище
    el('rect', { x: 94, y: 68, width: 12, height: 14, rx: 4 }, 'secondary'),
    el('path', { d: 'M70 142 V106 A28 28 0 0 1 98 78 H102 A28 28 0 0 1 130 106 V142 A6 6 0 0 1 124 148 H76 A6 6 0 0 1 70 142 Z' }, 'primary'),
    el('path', { d: 'M90 79 L100 96 L110 79 Z' }, 'accent'),
    // голова
    el('circle', { cx: 100, cy: 50, r: 20 }, 'secondary'),
    el('path', { d: 'M80 50 A20 20 0 0 1 120 48 C112 44 102 42 94 46 C88 49 84 51 80 50 Z' }, 'neutral'),
  ],
})
