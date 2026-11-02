/** «Новая иллюстрация» → «новая-иллюстрация.svg»; пустое или нечитаемое имя → «svg-composer.svg». */
export function svgFileName(projectName: string): string {
  const slug = projectName
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return `${slug || 'svg-composer'}.svg`
}

/** Скачивание через временный object URL; URL освобождается после того, как браузер начал загрузку. */
export function downloadSvg(svg: string, fileName: string) {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  link.remove()
  // Немедленный revoke в части браузеров обрывает загрузку — освобождаем с небольшой задержкой.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
