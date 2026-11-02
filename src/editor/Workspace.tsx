import { useEditorStore } from '../store/editorStore'
import { Canvas } from './Canvas'

export function Workspace() {
  const { width, height } = useEditorStore((s) => s.composition)

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-zinc-100">
      <div className="canvas-fit-area flex min-h-0 flex-1 items-center justify-center m-6">
        <div className="canvas-fit relative">
          <Canvas />
        </div>
      </div>

      <div className="flex h-8 shrink-0 items-center justify-center text-[11px] text-zinc-400 tabular-nums">
        {width} × {height}
      </div>
    </main>
  )
}
