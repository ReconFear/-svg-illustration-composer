import { Shapes } from 'lucide-react'
import { useEditorStore } from '../store/editorStore'

export function TopBar() {
  const projectName = useEditorStore((s) => s.projectName)

  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-4">
      <div className="flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-md bg-indigo-600 text-white">
          <Shapes className="size-4" strokeWidth={2.25} />
        </div>
        <span className="text-sm font-semibold tracking-tight">SVG Composer</span>
      </div>

      <div className="h-5 w-px bg-zinc-200" />

      <span className="truncate text-sm text-zinc-500" title={projectName}>
        {projectName}
      </span>
    </header>
  )
}
