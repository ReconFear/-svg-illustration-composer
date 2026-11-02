/**
 * Локальный смысловой словарь для генерации по метафоре.
 *
 * Ключевые слова пишутся в нормализованном виде (нижний регистр, «ё» → «е»):
 *  - «бизнес*» — основа: совпадает с любым словом, которое с неё начинается (бизнеса, бизнесу);
 *  - «план»    — точная форма: только это слово (не «планета»).
 * Короткие и многозначные основы лучше перечислять точными формами.
 *
 * components — веса релевантности компонентов библиотеки для темы (≈ 0.5…3).
 * Чтобы добавить тему, достаточно дописать объект сюда; движок подбора не меняется.
 */
export interface Concept {
  id: string
  label: string
  keywords: string[]
  components: Record<string, number>
}

export const CONCEPTS: Concept[] = [
  {
    id: 'growth',
    label: 'Рост и развитие',
    keywords: [
      'рост*', 'растущ*', 'вырос*', 'развит*', 'развив*', 'прогресс*', 'увелич*', 'масштаб*', 'расширен*',
      'эволюц*', 'улучш*', 'подъем*', 'повышен*', 'ускорен*', 'динамик*',
      'grow*', 'develop*', 'progress*', 'scal*', 'expan*', 'evolv*', 'evolution*', 'improv*', 'increas*',
      'rise', 'rising', 'boost*', 'upgrade*',
    ],
    components: { chart: 3, rocket: 2.5, plant: 2, target: 1, star: 0.5 },
  },
  {
    id: 'business',
    label: 'Бизнес и аналитика',
    keywords: [
      'бизнес*', 'компани*', 'предприят*', 'продаж*', 'прибыл*', 'доход*', 'выручк*', 'финанс*', 'аналит*',
      'статист*', 'рынок', 'рынка', 'рынке', 'рынку', 'рыночн*', 'маркетинг*', 'стартап*', 'инвест*', 'экономи*',
      'метрик*', 'анализ*', 'kpi', 'деньг*', 'денеж*', 'клиент*', 'корпорат*', 'фирм*', 'торгов*',
      'business*', 'compan*', 'enterprise*', 'sale', 'sales', 'profit*', 'revenue*', 'financ*', 'analyt*',
      'statist*', 'analys*', 'analyz*', 'market*', 'startup*', 'invest*', 'econom*', 'metric*', 'money', 'customer*', 'client*',
      'corporat*', 'commerce*',
    ],
    components: { chart: 3, target: 1.5, laptop: 1.5, document: 1, person: 1, rocket: 1 },
  },
  {
    id: 'technology',
    label: 'Технологии и программирование',
    keywords: [
      'технолог*', 'техник*', 'техничес*', 'программ*', 'код', 'кода', 'коде', 'разработ*', 'компьютер*', 'цифров*',
      'софт*', 'приложен*', 'сайт*', 'интернет*', 'онлайн*', 'автоматиз*', 'систем*', 'данн*', 'ии', 'нейросет*',
      'алгоритм*', 'облачн*', 'сервер*', 'айти', 'it', 'гаджет*', 'устройств*',
      'tech*', 'software*', 'program*', 'code', 'coding', 'coder*', 'computer*', 'digital*', 'app', 'apps',
      'application*', 'web', 'website*', 'internet*', 'online', 'automat*', 'system*', 'data', 'ai',
      'algorithm*', 'server*', 'device*', 'gadget*',
    ],
    components: { laptop: 3, gear: 2, cloud: 1.5, lightbulb: 0.5, chart: 0.5 },
  },
  {
    id: 'security',
    label: 'Защита и безопасность',
    keywords: [
      'защит*', 'безопас*', 'охран*', 'надежн*', 'довер*', 'приватн*', 'конфиденц*', 'персональн*', 'данн*',
      'шифр*', 'парол*', 'кибер*', 'риск*', 'страхов*', 'гарант*', 'щит*',
      'protect*', 'secur*', 'safe*', 'privacy', 'private', 'trust*', 'reliab*', 'encrypt*', 'password*',
      'cyber*', 'risk*', 'insur*', 'guarant*', 'shield*', 'data', 'personal',
    ],
    components: { shield: 3, document: 1.5, laptop: 1, person: 1, gear: 0.5 },
  },
  {
    id: 'ideas',
    label: 'Идеи и инновации',
    keywords: [
      'идея', 'идеи', 'идей', 'идею', 'идеям', 'идеями', 'идеях', 'инновац*', 'креатив*', 'творч*', 'изобрет*',
      'озарен*', 'вдохнов*', 'мысл*', 'придум*', 'генерац*', 'новый', 'новая', 'новое', 'новые', 'новых', 'новым',
      'новизн*', 'решени*', 'концепц*', 'гениальн*', 'инсайт*', 'смекалк*',
      'idea', 'ideas', 'innovat*', 'creativ*', 'invent*', 'inspir*', 'insight*', 'think*', 'brainstorm*', 'new',
      'novel', 'concept*', 'solution*', 'imagin*', 'genius',
    ],
    components: { lightbulb: 3, star: 1.5, gear: 1, rocket: 1, person: 0.5 },
  },
  {
    id: 'space',
    label: 'Космос и исследования',
    keywords: [
      'космо*', 'космич*', 'ракет*', 'звезд*', 'планет*', 'галакт*', 'вселен*', 'орбит*', 'полет*', 'запуск*',
      'исследов*', 'открыти*', 'освоен*', 'астроном*', 'луна', 'луны', 'марс', 'марса', 'спутник*', 'небо', 'неба',
      'небес*',
      'space', 'cosmo*', 'cosmic', 'rocket*', 'star', 'stars', 'planet*', 'galax*', 'universe*', 'orbit*',
      'flight*', 'launch*', 'explor*', 'research*', 'discover*', 'astro*', 'moon', 'mars', 'satellite*', 'sky',
    ],
    components: { rocket: 3, star: 2, cloud: 1, target: 0.5, lightbulb: 0.5 },
  },
  {
    id: 'productivity',
    label: 'Работа и продуктивность',
    keywords: [
      'работ*', 'продуктив*', 'эффектив*', 'задач*', 'процесс*', 'проект*', 'команд*', 'сотрудн*', 'офис*',
      'карьер*', 'навык*', 'планир*', 'план', 'плана', 'планы', 'время', 'времени', 'дедлайн*', 'управлен*',
      'менеджм*', 'труд*', 'коллег*',
      'work*', 'productiv*', 'efficien*', 'task*', 'process*', 'project*', 'team*', 'employee*', 'office*',
      'career*', 'skill*', 'plan', 'plans', 'planning', 'time', 'deadline*', 'manag*', 'job', 'jobs',
    ],
    components: { laptop: 2.5, gear: 2, person: 2, document: 1.5, target: 1, chart: 0.5 },
  },
  {
    id: 'nature',
    label: 'Природа и экология',
    keywords: [
      'природ*', 'эколог*', 'зелен*', 'растен*', 'растител*', 'цветок', 'цветы', 'цветов', 'лес', 'леса', 'лесн*',
      'дерев*', 'сад', 'сада', 'садов*', 'устойчив*', 'климат*', 'погод*', 'солн*', 'земл*', 'органич*', 'био',
      'весн*', 'озелен*', 'окружающ*',
      'natur*', 'eco', 'ecolog*', 'green*', 'plant*', 'flower*', 'forest*', 'tree', 'trees', 'garden*',
      'sustainab*', 'climate*', 'weather*', 'sun', 'sunny', 'earth*', 'organic*', 'bio', 'environment*', 'spring',
    ],
    components: { plant: 3, cloud: 2, star: 0.5 },
  },
  {
    id: 'goals',
    label: 'Цели и достижения',
    keywords: [
      'цель', 'цели', 'целе*', 'целев*', 'достиж*', 'достига*', 'успех*', 'успеш*', 'побед*', 'результат*',
      'награ*', 'лидер*', 'мотивац*', 'стратег*', 'фокус*', 'точност*', 'миссия', 'миссии', 'мечт*', 'амбиц*',
      'рекорд*', 'вершин*', 'приз', 'призы', 'призов',
      'goal*', 'target*', 'aim', 'aims', 'achiev*', 'success*', 'win', 'wins', 'winning', 'victor*', 'result*',
      'award*', 'leader*', 'motivat*', 'strateg*', 'focus*', 'accura*', 'mission*', 'dream*', 'ambiti*', 'record*',
    ],
    components: { target: 3, star: 2, rocket: 1, person: 1, chart: 0.5 },
  },
  {
    id: 'documents',
    label: 'Документы и организация',
    keywords: [
      'документ*', 'бумаг*', 'файл*', 'договор*', 'контракт*', 'отчет*', 'архив*', 'папк*', 'текст*', 'справк*',
      'заявк*', 'юрид*', 'соглашен*', 'бухгалт*', 'регламент*', 'сертифик*', 'подпис*', 'организац*',
      'систематиз*', 'учет*', 'делопроизвод*', 'анкет*',
      'document*', 'doc', 'docs', 'paper*', 'file', 'files', 'contract*', 'agreement*', 'report*', 'archive*',
      'folder*', 'text*', 'legal*', 'certificat*', 'signature*', 'organiz*', 'form', 'forms',
    ],
    components: { document: 3, laptop: 1, shield: 1, gear: 0.5, person: 0.5 },
  },
]

/** Универсальный набор, если тема не распознана: первый станет главным. */
export const NEUTRAL_COMPONENTS = ['lightbulb', 'star', 'cloud', 'plant']
