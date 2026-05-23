'use client'

import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Video, ImageIcon, Edit2 } from 'lucide-react'
import type { MediaNodeData } from '@/lib/canvas-types'
import { useCanvasStore } from '../../store'

export function MediaNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as MediaNodeData
  const openMediaEditor = useCanvasStore((s) => s.openMediaEditor)

  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer transition-all w-52"
      style={{
        backgroundColor: '#1e293b',
        border: `2px solid ${selected ? '#f59e0b' : '#334155'}`,
        boxShadow: selected ? '0 0 0 4px rgba(245,158,11,0.2)' : '0 8px 32px rgba(0,0,0,0.5)',
      }}
      onDoubleClick={() => openMediaEditor(nodeData)}
    >
      {/* Source handle — connects to Schedule Groups */}
      <Handle
        type="source"
        position={Position.Left}
        id="media-source"
        style={{ backgroundColor: '#f59e0b', border: '2px solid #0f172a', width: 12, height: 12 }}
      />

      {/* Media preview */}
      <div
        className="w-full h-36 flex items-center justify-center relative"
        style={{ backgroundColor: '#0f172a' }}
      >
        {nodeData.previewUrl ? (
          nodeData.mediaType === 'video' ? (
            <video
              src={nodeData.previewUrl}
              className="w-full h-full object-cover"
              muted
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={nodeData.previewUrl}
              alt={nodeData.title}
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="flex flex-col items-center gap-2">
            {nodeData.mediaType === 'video' ? (
              <Video size={32} className="text-slate-600" />
            ) : (
              <ImageIcon size={32} className="text-slate-600" />
            )}
            <span className="text-xs text-slate-600">
              {nodeData.fileName ?? 'No file yet'}
            </span>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="px-3 py-2.5" style={{ borderTop: '1px solid #334155' }}>
        <p className="text-sm font-semibold text-slate-100 truncate">{nodeData.title}</p>
        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
          <Edit2 size={10} />
          Double-click to edit
        </p>
      </div>
    </div>
  )
}
