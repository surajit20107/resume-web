import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
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

      <Toaster
        position="top-center"
        gutter={10}
        containerClassName="toast-container no-print"
        toastOptions={{
          duration: 5000,
          style: {
            background: 'var(--ui-surface)',
            color: 'var(--ui-text)',
            border: '1px solid var(--ui-line)',
            borderRadius: '10px',
            boxShadow: 'var(--ui-shadow)',
            fontSize: '13.5px',
            fontWeight: 500,
            maxWidth: '560px',
            padding: '10px 14px',
          },
          success: {
            iconTheme: {
              primary: 'var(--ui-accent)',
              secondary: 'var(--ui-surface)',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--ui-danger)',
              secondary: 'var(--ui-surface)',
            },
          },
        }}
      />
    </div>
  )
}
