import { TopBar } from './components/TopBar'
import { LibraryPanel } from './components/LibraryPanel'
import { PropertiesPanel } from './components/PropertiesPanel'
import { Workspace } from './editor/Workspace'
import { useEditorShortcuts } from './editor/useEditorShortcuts'

export default function App() {
  useEditorShortcuts()

  return (
    <div className="flex h-full min-w-[768px] flex-col">
      <TopBar />
      <div className="flex min-h-0 flex-1">
        <LibraryPanel />
        <Workspace />
        <PropertiesPanel />
      </div>
    </div>
  )
}
