'use client'

import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Link2, ExternalLink } from 'lucide-react'
import type { LinkNodeData } from '@/lib/canvas-types'
import { useCanvasStore } from '../../store'

export function LinkNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as LinkNodeData
  const openLinkEditor = useCanvasStore((s) => s.openLinkEditor)

  function openUrl(e: React.MouseEvent) {
    e.stopPropagation()
    const url = nodeData.url.startsWith('http') ? nodeData.url : `https://${nodeData.url}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      className="rounded-xl transition-all cursor-pointer"
      style={{
        backgroundColor: '#1e293b',
        border: `2px solid ${selected ? '#6366f1' : '#334155'}`,
        boxShadow: selected ? '0 0 0 3px rgba(99,102,241,0.2)' : '0 4px 16px rgba(0,0,0,0.4)',
        minWidth: 200,
      }}
      onDoubleClick={() => openLinkEditor(nodeData)}
    >
      <Handle type="target" position={Position.Left}  id="target" style={handleStyle} />
      <Handle type="source" position={Position.Right} id="source" style={handleStyle} />

      <div className="px-4 py-3 flex items-start gap-3">
        <div className="mt-0.5 p-1.5 rounded-lg flex-shrink-0" style={{ backgroundColor: '#6366f133' }}>
          <Link2 size={14} className="text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate leading-tight">
            {nodeData.title || 'Untitled Link'}
          </p>
          {nodeData.url && (
            <p className="text-xs text-slate-500 truncate mt-0.5">{nodeData.url}</p>
          )}
        </div>
        {nodeData.url && (
          <button
            onClick={openUrl}
            className="mt-0.5 text-slate-600 hover:text-indigo-400 transition-colors flex-shrink-0 nodrag"
            title="Open link"
          >
            <ExternalLink size={13} />
          </button>
        )}
      </div>
    </div>
  )
}

const handleStyle: React.CSSProperties = {
  backgroundColor: '#6366f1',
  width: 10,
  height: 10,
  border: '2px solid #0f172a',
}
