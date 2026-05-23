'use client'

import { useState, useEffect } from 'react'
import { X, Trash2, Link2 } from 'lucide-react'
import { useCanvasStore } from '../../store'

export function LinkEditor() {
  const { isLinkEditorOpen, selectedLink, closeLinkEditor, saveLinkNode, deleteLinkNode } =
    useCanvasStore()

  const [title, setTitle] = useState('')
  const [url, setUrl]     = useState('')

  useEffect(() => {
    if (selectedLink) {
      setTitle(selectedLink.title)
      setUrl(selectedLink.url)
    }
  }, [selectedLink])

  if (!isLinkEditorOpen || !selectedLink) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={closeLinkEditor} />
      <div className="fixed right-0 top-0 h-full w-[360px] z-50 flex flex-col"
        style={{ backgroundColor: '#1e293b', borderLeft: '1px solid #334155' }}>

        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #334155' }}>
          <div className="flex items-center gap-2.5">
            <Link2 size={16} className="text-indigo-400" />
            <h2 className="text-lg font-semibold text-slate-100">Link</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => deleteLinkNode(selectedLink.id)}
              className="p-2 text-slate-500 hover:text-red-400 rounded-lg transition-colors">
              <Trash2 size={16} />
            </button>
            <button onClick={closeLinkEditor}
              className="p-2 text-slate-500 hover:text-slate-200 rounded-lg transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Campaign Brief, Brand Guidelines…"
              className="w-full rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">URL</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
              type="url"
              className="w-full rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
            />
          </div>
        </div>

        <div className="px-6 py-4" style={{ borderTop: '1px solid #334155' }}>
          <button
            onClick={() => saveLinkNode({ ...selectedLink, title, url })}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </>
  )
}
