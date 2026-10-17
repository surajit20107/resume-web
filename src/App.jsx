import { useState } from 'react'
import EditorPanel from './components/EditorPanel'
import ResumeSheet from './components/ResumeSheet'
import Toolbar from './components/Toolbar'
import { useResume } from './hooks/useResume'

export default function App() {
  const { resume, setResume, density, setDensity, reset, importResume } = useResume()
  const [editing, setEditing] = useState(false)

  return (
    <div className="app">
      <Toolbar
        editing={editing}
        onToggleEdit={() => setEditing((value) => !value)}
        density={density}
        onDensityChange={setDensity}
        resume={resume}
        onReset={reset}
        onImport={importResume}
      />

      <div className={`workspace ${editing ? 'is-editing' : ''}`}>
        <div className="paper-wrap">
          <ResumeSheet resume={resume} density={density} />
        </div>
        {editing && <EditorPanel resume={resume} onChange={setResume} />}
      </div>
    </div>
  )
}
