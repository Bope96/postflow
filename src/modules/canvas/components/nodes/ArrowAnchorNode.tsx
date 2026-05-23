'use client'

import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { ArrowAnchorNodeData } from '@/lib/canvas-types'

export function ArrowAnchorNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as ArrowAnchorNodeData

  return (
    <div
      className="rounded-full transition-all"
      style={{
        width: 12,
        height: 12,
        backgroundColor: selected ? '#f1f5f9' : '#64748b',
        border: `2px solid ${selected ? '#fff' : '#475569'}`,
        boxShadow: selected ? '0 0 0 3px rgba(255,255,255,0.15)' : 'none',
        cursor: 'move',
      }}
    >
      {nodeData.role === 'start' ? (
        <Handle
          type="source"
          position={Position.Right}
          id="arrow-source"
          style={{ opacity: 0, width: 12, height: 12, top: 0, left: 0, transform: 'none', borderRadius: '50%' }}
        />
      ) : (
        <Handle
          type="target"
          position={Position.Left}
          id="arrow-target"
          style={{ opacity: 0, width: 12, height: 12, top: 0, left: 0, transform: 'none', borderRadius: '50%' }}
        />
      )}
    </div>
  )
}
