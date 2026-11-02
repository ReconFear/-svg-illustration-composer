import { Download, Shapes } from 'lucide-react'
import { useEditorStore } from '../store/editorStore'
import { exportComposition } from '../export/svg'
import { downloadSvg, svgFileName } from '../export/download'

export function TopBar() {
  const projectName = useEditorStore((s) => s.projectName)
  const isEmpty = useEditorStore((s) => s.composition.items.length === 0)

  function handleDownload() {
    const { composition, projectName } = useEditorStore.getState()
    downloadSvg(exportComposition(composition), svgFileName(projectName))
  }

  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-4">
      <div className="flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-md bg-indigo-600 text-white">
          <Shapes className="size-4" strokeWidth={2.25} />
        </div>
        <span className="text-sm font-semibold tracking-tight">SVG Composer</span>
      </div>

      <div className="h-5 w-px bg-zinc-200" />

      <span className="min-w-0 flex-1 truncate text-sm text-zinc-500" title={projectName}>
        {projectName}
      </span>

      <button
        type="button"
        onClick={handleDownload}
        disabled={isEmpty}
        aria-label="Скачать SVG"
        title={isEmpty ? 'Добавьте объекты на холст, чтобы скачать SVG' : 'Скачать композицию как редактируемый SVG'}
        className="flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-zinc-900 px-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400"
      >
        <Download className="size-4" strokeWidth={2} />
        Скачать SVG
      </button>
    </header>
  )
}
