'use client'

import { useCanvasStore } from '@/modules/canvas/store'

export default function SettingsPage() {
  const showMinimap = useCanvasStore((s) => s.showMinimap)
  const toggleMinimap = useCanvasStore((s) => s.toggleMinimap)

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-100 mb-2">Settings</h1>
      <p className="text-slate-400 mb-8">Manage your workspace and preferences.</p>

      <div className="space-y-4">
        <div className="rounded-xl p-6" style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
          <h2 className="font-semibold text-slate-100 mb-1">Workspace</h2>
          <p className="text-sm text-slate-500 mb-4">Your workspace name and details.</p>
          <input
            defaultValue="My Team Workspace"
            className="rounded-lg px-4 py-2 text-sm text-slate-200 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
          />
        </div>

        {/* Canvas preferences */}
        <div className="rounded-xl p-6" style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
          <h2 className="font-semibold text-slate-100 mb-4">Canvas</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-200">Minimap preview</p>
                <p className="text-xs text-slate-500 mt-0.5">Show the overview map in the bottom-left corner of the canvas</p>
              </div>
              <button
                onClick={toggleMinimap}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                style={{ backgroundColor: showMinimap ? '#6366f1' : '#334155' }}
              >
                <span
                  className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  style={{ transform: showMinimap ? 'translateX(24px)' : 'translateX(4px)' }}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl p-6" style={{ backgroundColor: '#1c1917', border: '1px solid #78350f' }}>
          <h2 className="font-semibold text-amber-400 mb-1">Connect Supabase (optional)</h2>
          <p className="text-sm text-amber-600 mb-3">
            Right now the app uses demo data. To save your posts and team across sessions,
            connect a free Supabase database.
          </p>
          <p className="text-xs text-amber-700">
            See the CLAUDE.md file in the project folder for setup instructions.
          </p>
        </div>
      </div>
    </div>
  )
}
