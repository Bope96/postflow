'use client'

import { useState, useEffect } from 'react'
import { X, Trash2, Save } from 'lucide-react'
import type { StickyNote, StickyNoteColor } from '@/lib/types'
import { useCanvasStore } from '@/modules/canvas/store'

const COLORS: { id: StickyNoteColor; bg: string; border: string; label: string }[] = [
  { id: 'yellow', bg: '#fef9c3', border: '#fde047', label: 'Yellow' },
  { id: 'pink',   bg: '#fce7f3', border: '#f9a8d4', label: 'Pink' },
  { id: 'blue',   bg: '#dbeafe', border: '#93c5fd', label: 'Blue' },
  { id: 'green',  bg: '#dcfce7', border: '#86efac', label: 'Green' },
  { id: 'purple', bg: '#f3e8ff', border: '#d8b4fe', label: 'Purple' },
]

export function NoteEditor() {
  const { isNoteEditorOpen, selectedNote, closeNoteEditor, saveNote, deleteNote } =
    useCanvasStore()

  const [content, setContent] = useState('')
  const [color, setColor] = useState<StickyNoteColor>('yellow')
  const [authorName, setAuthorName] = useState('You')

  useEffect(() => {
    if (selectedNote) {
      setContent(selectedNote.content)
      setColor(selectedNote.color)
      setAuthorName(selectedNote.authorName)
    }
  }, [selectedNote])

  if (!isNoteEditorOpen || !selectedNote) return null

  function handleSave() {
    if (!selectedNote) return
    saveNote({ ...selectedNote, content, color, authorName, updatedAt: new Date().toISOString() })
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={closeNoteEditor} />

      <div
        className="fixed right-0 top-0 h-full w-[360px] z-50 flex flex-col"
        style={{ backgroundColor: '#1e293b', borderLeft: '1px solid #334155' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #334155' }}>
          <h2 className="text-lg font-semibold text-slate-100">Sticky Note</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => deleteNote(selectedNote.id)}
              className="p-2 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={closeNoteEditor}
              className="p-2 text-slate-500 hover:text-slate-200 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Color picker */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Color</label>
            <div className="flex gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  title={c.label}
                  className="w-8 h-8 rounded-full transition-all"
                  style={{
                    backgroundColor: c.bg,
                    outline: color === c.id ? `3px solid ${c.border}` : '3px solid transparent',
                    outlineOffset: '2px',
                    transform: color === c.id ? 'scale(1.2)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">From</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Note</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              rows={6}
              className="w-full rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
            />
          </div>

          {/* Preview */}
          {content && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Preview</label>
              <div
                className="w-44 min-h-24 rounded-lg p-3"
                style={{
                  backgroundColor: COLORS.find((c) => c.id === color)?.bg,
                  border: `2px solid ${COLORS.find((c) => c.id === color)?.border}`,
                }}
              >
                <p className="text-xs font-semibold uppercase mb-1 opacity-60">{authorName}</p>
                <p className="text-xs leading-relaxed text-gray-800">{content}</p>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4" style={{ borderTop: '1px solid #334155' }}>
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Save size={14} />
            Save Note
          </button>
        </div>
      </div>
    </>
  )
}
