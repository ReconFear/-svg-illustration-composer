import { defineComponent, el } from '../define'

export const document = defineComponent({
  id: 'document',
  name: 'Документ',
  category: 'business',
  tags: {
    ru: ['документ', 'файл', 'бумага', 'договор', 'контракт', 'отчёт', 'план', 'заявка', 'одобрено', 'текст'],
    en: ['document', 'file', 'paper', 'contract', 'agreement', 'report', 'plan', 'application', 'approved', 'text'],
  },
  elements: [
    // задний лист
    el('rect', { x: 62, y: 38, width: 96, height: 128, rx: 8, transform: 'rotate(8 110 102)' }, 'secondary'),
    // передний лист с загнутым углом
    el(
      'path',
      { d: 'M46 40 A8 8 0 0 1 54 32 H114 L142 60 V160 A8 8 0 0 1 134 168 H54 A8 8 0 0 1 46 160 Z', 'stroke-width': 3, 'stroke-linejoin': 'round' },
      'background',
      'secondary',
    ),
    el('path', { d: 'M114 32 V52 A8 8 0 0 0 122 60 H142 Z', 'stroke-width': 3, 'stroke-linejoin': 'round' }, 'secondary', 'secondary'),
    // строки
    el('rect', { x: 60, y: 70, width: 48, height: 8, rx: 4 }, 'primary'),
    el('rect', { x: 60, y: 88, width: 68, height: 6, rx: 3 }, 'secondary'),
    el('rect', { x: 60, y: 102, width: 68, height: 6, rx: 3 }, 'secondary'),
    el('rect', { x: 60, y: 116, width: 50, height: 6, rx: 3 }, 'secondary'),
    // отметка «одобрено»
    el('circle', { cx: 140, cy: 154, r: 21 }, 'accent'),
    el('path', { d: 'M130 154 L137 161 L151 147', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, undefined, 'background'),
  ],
})
