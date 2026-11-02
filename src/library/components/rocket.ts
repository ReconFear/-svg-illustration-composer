import { defineComponent, el, group } from '../define'

export const rocket = defineComponent({
  id: 'rocket',
  name: 'Ракета',
  category: 'space',
  tags: {
    ru: ['ракета', 'запуск', 'старт', 'стартап', 'рост', 'космос', 'скорость', 'полёт', 'взлёт'],
    en: ['rocket', 'launch', 'start', 'startup', 'growth', 'space', 'speed', 'flight', 'boost'],
  },
  elements: [
    group({ transform: 'translate(0 -6)' }, [
      // пламя
      el('path', { d: 'M84 140 H116 C116 162 108 176 100 192 C92 176 84 162 84 140 Z' }, 'accent'),
      el('path', { d: 'M92 140 H108 C108 156 104 166 100 176 C96 166 92 156 92 140 Z' }, 'background'),
      // боковые стабилизаторы
      el('path', { d: 'M78 106 L50 140 L54 156 L80 140 Z' }, 'primary'),
      el('path', { d: 'M122 106 L150 140 L146 156 L120 140 Z' }, 'primary'),
      // корпус
      el('path', { d: 'M100 22 C124 42 132 78 128 124 L124 146 L76 146 L72 124 C68 78 76 42 100 22 Z' }, 'secondary'),
      // обтекатель (точное подразбиение кривой корпуса)
      el('path', { d: 'M100 22 C110.3 30.6 117.7 42.2 122.4 56.2 L77.6 56.2 C82.3 42.2 89.7 30.6 100 22 Z' }, 'primary'),
      // пояс у сопла
      el('path', { d: 'M73.5 132 H126.5 L124 146 H76 Z' }, 'primary'),
      // иллюминатор
      el('circle', { cx: 100, cy: 90, r: 17 }, 'primary'),
      el('circle', { cx: 100, cy: 90, r: 11 }, 'background'),
      el('circle', { cx: 104, cy: 86, r: 3.5 }, 'secondary'),
      // центральный стабилизатор
      el('rect', { x: 95, y: 118, width: 10, height: 38, rx: 5 }, 'neutral'),
    ]),
  ],
})
