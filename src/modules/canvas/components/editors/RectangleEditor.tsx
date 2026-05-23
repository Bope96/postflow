'use client'

import { useState, useEffect } from 'react'
import { X, Trash2 } from 'lucide-react'
import { useCanvasStore } from '../../store'

const COLORS = [
  { label: 'Indigo',  value: '#4f46e5' },
  { label: 'Blue',    value: '#2563eb' },
  { label: 'Teal',    value: '#0d9488' },
  { label: 'Green',   value: '#16a34a' },
  { label: 'Amber',   value: '#d97706' },
  { label: 'Red',     value: '#dc2626' },
  { label: 'Pink',    value: '#db2777' },
  { label: 'Slate',   value: '#475569' },
]

export function RectangleEditor() {
  const { isRectangleEditorOpen, selectedRectangle, closeRectangleEditor, saveRectangleNode, deleteRectangleNode } =
    useCanvasStore()

  const [label, setLabel] = useState('')
  const [color, setColor] = useState(COLORS[0].value)

  useEffect(() => {
    if (selectedRectangle) {
      setLabel(selectedRectangle.label)
      setColor(selectedRectangle.color)
    }
  }, [selectedRectangle])

  if (!isRectangleEditorOpen || !selectedRectangle) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={closeRectangleEditor} />
      <div className="fixed right-0 top-0 h-full w-[360px] z-50 flex flex-col"
        style={{ backgroundColor: '#1e293b', borderLeft: '1px solid #334155' }}>

        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #334155' }}>
          <h2 className="text-lg font-semibold text-slate-100">Rectangle</h2>
          <div className="flex gap-2">
            <button onClick={() => deleteRectangleNode(selectedRectangle.id)}
              className="p-2 text-slate-500 hover:text-red-400 rounded-lg transition-colors">
              <Trash2 size={16} />
            </button>
            <button onClick={closeRectangleEditor}
              className="p-2 text-slate-500 hover:text-slate-200 rounded-lg transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Label (optional)</label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Phase 1, Campaign A…"
              className="w-full rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Color</label>
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className="aspect-square rounded-xl transition-all hover:scale-105"
                  style={{
                    backgroundColor: c.value,
                    outline: color === c.value ? '3px solid #fff' : '3px solid transparent',
                    outlineOffset: 2,
                  }}
                  title={c.label}
                />
              ))}
            </div>
            <div className="mt-3">
              <label className="block text-xs text-slate-500 mb-1.5">Custom color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0.5"
                  style={{ backgroundColor: '#0f172a' }}
                />
                <span className="text-sm text-slate-400 font-mono">{color}</span>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Preview</label>
            <div
              className="w-full h-24 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: color }}
            >
              {label && (
                <span className="text-sm font-semibold text-white/90" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
                  {label}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4" style={{ borderTop: '1px solid #334155' }}>
          <button
            onClick={() => saveRectangleNode({ ...selectedRectangle, label, color })}
            className="w-full py-2.5 text-white text-sm font-medium rounded-xl transition-colors"
            style={{ backgroundColor: color }}
          >
            Save
          </button>
        </div>
      </div>
    </>
  )
}
