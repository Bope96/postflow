'use client'

import { useState, useEffect } from 'react'
import { X, Trash2, ExternalLink } from 'lucide-react'
import { useCanvasStore } from '../../store'
import { parseEmbedUrl, PLATFORM_COLOR, PLATFORM_LABEL } from '@/lib/embed-utils'
import type { EmbedNodeData } from '@/lib/canvas-types'

export function EmbedEditor() {
  const { isEmbedEditorOpen, selectedEmbed, closeEmbedEditor, saveEmbedNode, deleteEmbedNode } =
    useCanvasStore()

  const [url,   setUrl]   = useState('')
  const [title, setTitle] = useState('')
  const [parsed, setParsed] = useState<ReturnType<typeof parseEmbedUrl>>(null)

  useEffect(() => {
    if (selectedEmbed) {
      setUrl(selectedEmbed.url)
      setTitle(selectedEmbed.title)
      setParsed(parseEmbedUrl(selectedEmbed.url))
    }
  }, [selectedEmbed])

  function handleUrlChange(val: string) {
    setUrl(val)
    const result = parseEmbedUrl(val)
    setParsed(result)
    if (result && !title) setTitle(result.title)
  }

  function handleSave() {
    if (!selectedEmbed) return
    const result = parseEmbedUrl(url)
    const updated: EmbedNodeData = {
      ...selectedEmbed,
      url,
      title: title || result?.title || 'Embed',
      embedUrl: result?.embedUrl ?? '',
      platform: result?.platform ?? 'unknown',
    }
    saveEmbedNode(updated)
  }

  if (!isEmbedEditorOpen || !selectedEmbed) return null

  const color = parsed ? PLATFORM_COLOR[parsed.platform] : '#475569'
  const label = parsed ? PLATFORM_LABEL[parsed.platform] : null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={closeEmbedEditor} />
      <div className="fixed right-0 top-0 h-full w-[400px] z-50 flex flex-col"
        style={{ backgroundColor: '#1e293b', borderLeft: '1px solid #334155' }}>

        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #334155' }}>
          <h2 className="text-lg font-semibold text-slate-100">Embed Video</h2>
          <div className="flex gap-2">
            <button onClick={() => deleteEmbedNode(selectedEmbed.id)}
              className="p-2 text-slate-500 hover:text-red-400 rounded-lg transition-colors">
              <Trash2 size={16} />
            </button>
            <button onClick={closeEmbedEditor}
              className="p-2 text-slate-500 hover:text-slate-200 rounded-lg transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* URL input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Video URL</label>
            <input
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="Paste a TikTok, YouTube, or Instagram URL…"
              className="w-full rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
              autoFocus
            />
          </div>

          {/* Platform detection badge */}
          {parsed && (
            <div
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
              style={{ backgroundColor: `${color}22`, border: `1px solid ${color}44` }}
            >
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-sm font-medium" style={{ color }}>
                {label} detected — will embed directly in canvas
              </span>
            </div>
          )}

          {url && !parsed && (
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
              style={{ backgroundColor: '#450a0a22', border: '1px solid #f8717144' }}>
              <span className="text-sm text-red-400">
                URL not recognised. Supported: TikTok, YouTube, YouTube Shorts, Instagram posts/reels, Facebook videos.
              </span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Label (optional)</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Product launch clip"
              className="w-full rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
            />
          </div>

          {/* Supported platforms */}
          <div className="rounded-xl p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}>
            <p className="text-xs font-medium text-slate-500 mb-2">Supported platforms</p>
            <div className="flex flex-wrap gap-2">
              {(['tiktok', 'youtube', 'instagram', 'facebook'] as const).map((p) => (
                <span key={p} className="text-xs px-2.5 py-1 rounded-lg font-medium"
                  style={{ backgroundColor: `${PLATFORM_COLOR[p]}22`, color: PLATFORM_COLOR[p], border: `1px solid ${PLATFORM_COLOR[p]}44` }}>
                  {PLATFORM_LABEL[p]}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Also works with YouTube Shorts and Instagram Reels.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 flex gap-2" style={{ borderTop: '1px solid #334155' }}>
          {url && (
            <a
              href={url.startsWith('http') ? url : `https://${url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-200 transition-colors"
              style={{ border: '1px solid #334155' }}
            >
              <ExternalLink size={14} />
              Open
            </a>
          )}
          <button
            onClick={handleSave}
            disabled={!parsed}
            className="flex-1 py-2.5 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-40"
            style={{ backgroundColor: parsed ? color : '#334155' }}
          >
            {parsed ? `Embed ${label}` : 'Paste a supported URL'}
          </button>
        </div>
      </div>
    </>
  )
}
