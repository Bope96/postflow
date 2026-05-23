'use client'

import { useState, useEffect } from 'react'
import { X, Trash2 } from 'lucide-react'
import type { CaptionNodeData } from '@/lib/canvas-types'
import { useCanvasStore } from '../../store'

export function CaptionEditor() {
  const { isCaptionEditorOpen, selectedCaption, closeCaptionEditor, saveCaptionNode, deleteCaptionNode } =
    useCanvasStore()

  const [label, setLabel] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    if (selectedCaption) {
      setLabel(selectedCaption.label)
      setText(selectedCaption.text)
    }
  }, [selectedCaption])

  if (!isCaptionEditorOpen || !selectedCaption) return null

  function handleSave() {
    if (!selectedCaption) return
    saveCaptionNode({ ...selectedCaption, label, text })
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={closeCaptionEditor} />
      <div className="fixed right-0 top-0 h-full w-[400px] z-50 flex flex-col"
        style={{ backgroundColor: '#1e293b', borderLeft: '1px solid #334155' }}>

        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #334155' }}>
          <h2 className="text-lg font-semibold text-slate-100">Caption</h2>
          <div className="flex gap-2">
            <button onClick={() => deleteCaptionNode(selectedCaption.id)}
              className="p-2 text-slate-500 hover:text-red-400 rounded-lg transition-colors">
              <Trash2 size={16} />
            </button>
            <button onClick={closeCaptionEditor}
              className="p-2 text-slate-500 hover:text-slate-200 rounded-lg transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Label</label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Caption, Caption 2, LinkedIn Caption"
              className="w-full rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
            />
            <p className="text-xs text-slate-600 mt-1">This label appears on the node card.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Caption Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your caption here..."
              rows={8}
              className="w-full rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
            />
            <p className="text-xs text-slate-600 mt-1 text-right">{text.length} characters</p>
          </div>

          <div className="rounded-xl p-4" style={{ backgroundColor: '#0f172a' }}>
            <p className="text-xs text-slate-500 mb-1 font-medium">How to connect</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Drag from the <span className="text-indigo-400">indigo dot</span> on the right edge of this caption to a platform row inside a Schedule Group. Each platform can have its own caption.
            </p>
          </div>
        </div>

        <div className="px-6 py-4" style={{ borderTop: '1px solid #334155' }}>
          <button onClick={handleSave}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors">
            Save Caption
          </button>
        </div>
      </div>
    </>
  )
}
