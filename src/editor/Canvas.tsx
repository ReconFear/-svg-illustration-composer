import { useEditorStore } from '../store/editorStore'

export function Canvas() {
  const composition = useEditorStore((s) => s.composition)
  const { width, height, items } = composition

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
        className="block size-full rounded-sm bg-white ring-1 ring-zinc-200"
        role="img"
        aria-label="Холст композиции"
      />

      {items.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-sm text-zinc-300">Холст пуст</span>
        </div>
      )}
    </>
  )
}
