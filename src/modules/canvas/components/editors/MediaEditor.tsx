'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Trash2, Upload, Video, ImageIcon } from 'lucide-react'
import type { MediaNodeData } from '@/lib/canvas-types'
import { useCanvasStore } from '../../store'

export function MediaEditor() {
  const { isMediaEditorOpen, selectedMedia, closeMediaEditor, saveMediaNode, deleteMediaNode } =
    useCanvasStore()

  const [title, setTitle] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | undefined>()
  const [fileName, setFileName] = useState<string | undefined>()
  const [mediaType, setMediaType] = useState<MediaNodeData['mediaType']>('unknown')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (selectedMedia) {
      setTitle(selectedMedia.title)
      setPreviewUrl(selectedMedia.previewUrl)
      setFileName(selectedMedia.fileName)
      setMediaType(selectedMedia.mediaType)
    }
  }, [selectedMedia])

  if (!isMediaEditorOpen || !selectedMedia) return null

  function handleFile(file: File) {
    const type = file.type.startsWith('video') ? 'video' : file.type.startsWith('image') ? 'image' : 'unknown'
    setMediaType(type)
    setFileName(file.name)
    setPreviewUrl(URL.createObjectURL(file))
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, ''))
  }

  function handleSave() {
    if (!selectedMedia) return
    saveMediaNode({ ...selectedMedia, title, previewUrl, fileName, mediaType })
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={closeMediaEditor} />
      <div className="fixed right-0 top-0 h-full w-[400px] z-50 flex flex-col"
        style={{ backgroundColor: '#1e293b', borderLeft: '1px solid #334155' }}>

        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #334155' }}>
          <h2 className="text-lg font-semibold text-slate-100">Media</h2>
          <div className="flex gap-2">
            <button onClick={() => deleteMediaNode(selectedMedia.id)}
              className="p-2 text-slate-500 hover:text-red-400 rounded-lg transition-colors">
              <Trash2 size={16} />
            </button>
            <button onClick={closeMediaEditor}
              className="p-2 text-slate-500 hover:text-slate-200 rounded-lg transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Upload area */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">File</label>
            <div
              className="w-full h-40 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors"
              style={{ backgroundColor: '#0f172a', border: '2px dashed #334155' }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const file = e.dataTransfer.files[0]
                if (file) handleFile(file)
              }}
            >
              {previewUrl ? (
                mediaType === 'video'
                  ? <video src={previewUrl} className="h-full w-full object-cover rounded-xl" muted />
                  : <img src={previewUrl} alt="preview" className="h-full w-full object-cover rounded-xl" />
              ) : (
                <>
                  <Upload size={24} className="text-slate-600" />
                  <span className="text-sm text-slate-500">Click or drag file here</span>
                  <span className="text-xs text-slate-600">Video or image</span>
                </>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="video/*,image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
            {fileName && (
              <p className="text-xs text-slate-500 mt-1.5 truncate">{fileName}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Product Launch Video"
              className="w-full rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
              style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
            />
          </div>
        </div>

        <div className="px-6 py-4" style={{ borderTop: '1px solid #334155' }}>
          <button onClick={handleSave}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-xl transition-colors">
            Save
          </button>
        </div>
      </div>
    </>
  )
}
