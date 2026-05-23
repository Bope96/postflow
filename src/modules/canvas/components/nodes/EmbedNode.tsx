'use client'

import { useState } from 'react'
import { Handle, Position, NodeResizer, type NodeProps } from '@xyflow/react'
import { Edit2, AlertTriangle, Loader2 } from 'lucide-react'
import type { EmbedNodeData } from '@/lib/canvas-types'
import { PLATFORM_COLOR, PLATFORM_LABEL } from '@/lib/embed-utils'
import { useCanvasStore } from '../../store'

// TikTok and Instagram restrict embedding from localhost.
// YouTube and Facebook work fine on localhost.
const LOCALHOST_RESTRICTED: EmbedNodeData['platform'][] = ['tiktok', 'instagram']

export function EmbedNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as EmbedNodeData
  const openEmbedEditor = useCanvasStore((s) => s.openEmbedEditor)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  const color = PLATFORM_COLOR[nodeData.platform] ?? '#475569'
  const label = PLATFORM_LABEL[nodeData.platform] ?? 'Embed'

  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

  const localRestricted = isLocalhost && LOCALHOST_RESTRICTED.includes(nodeData.platform)

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all flex flex-col"
      style={{
        backgroundColor: '#0f172a',
        border: `2px solid ${selected ? color : '#334155'}`,
        boxShadow: selected ? `0 0 0 3px ${color}33` : '0 8px 32px rgba(0,0,0,0.5)',
        width: '100%',
        height: '100%',
        minWidth: 260,
        minHeight: 200,
      }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={260}
        minHeight={200}
        handleStyle={{ width: 8, height: 8, backgroundColor: color, border: '2px solid #0f172a', borderRadius: 2 }}
        lineStyle={{ borderColor: `${color}88` }}
      />

      <Handle type="target" position={Position.Left}  id="target" style={{ backgroundColor: color, border: '2px solid #0f172a', width: 10, height: 10 }} />
      <Handle type="source" position={Position.Right} id="source" style={{ backgroundColor: color, border: '2px solid #0f172a', width: 10, height: 10 }} />

      {/* Header bar */}
      <div
        className="flex items-center justify-between px-3 py-2 flex-shrink-0"
        style={{ backgroundColor: `${color}22`, borderBottom: `1px solid ${color}44` }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
          <span className="text-xs font-semibold" style={{ color }}>{label}</span>
          {nodeData.title && nodeData.title !== label && (
            <span className="text-xs text-slate-500 truncate max-w-[140px]">{nodeData.title}</span>
          )}
        </div>
        <button
          className="text-slate-600 hover:text-slate-300 transition-colors nodrag"
          onClick={(e) => { e.stopPropagation(); openEmbedEditor(nodeData) }}
          title="Edit"
        >
          <Edit2 size={11} />
        </button>
      </div>

      {/* Player area */}
      {!nodeData.embedUrl ? (
        // No URL yet — prompt to edit
        <div
          className="flex-1 flex flex-col items-center justify-center gap-2 cursor-pointer nodrag"
          onClick={() => openEmbedEditor(nodeData)}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}22` }}>
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
          </div>
          <p className="text-sm text-slate-400">Paste a {label} URL</p>
          <p className="text-xs text-slate-600">Double-click to add</p>
        </div>
      ) : localRestricted ? (
        // TikTok / Instagram on localhost — show clear explanation
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4 text-center nodrag">
          <div className="p-2.5 rounded-xl" style={{ backgroundColor: '#78350f22' }}>
            <AlertTriangle size={20} className="text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-400 mb-1">{label} preview unavailable on localhost</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              {label} restricts embedding from local development servers.
              Deploy to Vercel (or any public URL) and it will play inline automatically.
            </p>
          </div>
          <a
            href={nodeData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg transition-colors nodrag"
            style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}44` }}
            onClick={(e) => e.stopPropagation()}
          >
            Open on {label} ↗
          </a>
        </div>
      ) : (
        // Normal iframe embed
        <div className="flex-1 relative">
          {loading && !failed && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: '#0f172a' }}>
              <Loader2 size={20} className="animate-spin" style={{ color }} />
            </div>
          )}
          {failed && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
              <AlertTriangle size={18} className="text-red-400" />
              <p className="text-xs text-slate-500">Could not load embed. The video may be private or the URL changed.</p>
              <a
                href={nodeData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-400 hover:text-indigo-300 nodrag"
                onClick={(e) => e.stopPropagation()}
              >
                Open original ↗
              </a>
            </div>
          )}
          <iframe
            key={nodeData.embedUrl}
            src={nodeData.embedUrl}
            className="w-full h-full nodrag nopan"
            style={{ border: 'none', display: failed ? 'none' : 'block' }}
            allow="autoplay; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title={nodeData.title || label}
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setFailed(true) }}
          />
        </div>
      )}
    </div>
  )
}
