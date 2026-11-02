import { defineComponent, el } from '../define'

export const shield = defineComponent({
  id: 'shield',
  name: 'Щит',
  category: 'security',
  tags: {
    ru: ['щит', 'защита', 'безопасность', 'надёжность', 'доверие', 'гарантия', 'страхование', 'приватность', 'охрана'],
    en: ['shield', 'protection', 'security', 'safety', 'secure', 'reliability', 'trust', 'guarantee', 'insurance', 'privacy'],
  },
  elements: [
    el('path', { d: 'M100 24 L158 44 V96 C158 134 132 160 100 176 C68 160 42 134 42 96 V44 Z' }, 'primary'),
    el('path', { d: 'M100 40 L144 55 V96 C144 126 124 147 100 160 C76 147 56 126 56 96 V55 Z' }, 'secondary'),
    // правая половина — тень
    el('path', { d: 'M100 40 L144 55 V96 C144 126 124 147 100 160 Z', opacity: 0.35 }, 'background'),
    el('path', { d: 'M78 98 L94 114 L124 82', 'stroke-width': 11, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, undefined, 'neutral'),
    // искры
    el('path', { d: 'M168 20 Q170 32 182 34 Q170 36 168 48 Q166 36 154 34 Q166 32 168 20 Z' }, 'accent'),
    el('path', { d: 'M34 140 Q35.2 148.8 44 150 Q35.2 151.2 34 160 Q32.8 151.2 24 150 Q32.8 148.8 34 140 Z' }, 'accent'),
  ],
})
