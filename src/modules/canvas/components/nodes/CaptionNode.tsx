'use client'

import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Type, Edit2 } from 'lucide-react'
import type { CaptionNodeData } from '@/lib/canvas-types'
import { useCanvasStore } from '../../store'

export function CaptionNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as CaptionNodeData
  const openCaptionEditor = useCanvasStore((s) => s.openCaptionEditor)

  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer transition-all w-56"
      style={{
        backgroundColor: '#1e293b',
        border: `2px solid ${selected ? '#6366f1' : '#334155'}`,
        boxShadow: selected ? '0 0 0 4px rgba(99,102,241,0.2)' : '0 8px 32px rgba(0,0,0,0.5)',
      }}
      onDoubleClick={() => openCaptionEditor(nodeData)}
    >
      {/* Source handle — connects to platform rows in Schedule Groups */}
      <Handle
        type="source"
        position={Position.Right}
        id="caption-source"
        style={{ backgroundColor: '#6366f1', border: '2px solid #0f172a', width: 12, height: 12 }}
      />

      {/* Header */}
      <div className="px-3 pt-3 pb-2 flex items-center gap-2" style={{ borderBottom: '1px solid #334155' }}>
        <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <Type size={12} color="white" />
        </div>
        <span className="text-xs font-bold text-indigo-300 uppercase tracking-wide">
          {nodeData.label}
        </span>
      </div>

      {/* Caption text */}
      <div className="px-3 py-3">
        <p className="text-sm text-slate-200 leading-relaxed line-clamp-4">
          {nodeData.text || <span className="text-slate-500 italic">No caption yet</span>}
        </p>
      </div>

      {/* Footer */}
      <div className="px-3 pb-2 text-xs text-slate-600 flex items-center gap-1">
        <Edit2 size={10} />
        Double-click to edit
      </div>
    </div>
  )
}
