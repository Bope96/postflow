'use client'

import { Handle, Position, NodeResizer, type NodeProps } from '@xyflow/react'
import type { RectangleNodeData } from '@/lib/canvas-types'
import { useCanvasStore } from '../../store'

export function RectangleNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as RectangleNodeData
  const openRectangleEditor = useCanvasStore((s) => s.openRectangleEditor)

  return (
    <div
      className="w-full h-full rounded-xl flex items-center justify-center transition-all cursor-pointer relative"
      style={{
        backgroundColor: nodeData.color,
        border: `2px solid ${selected ? '#ffffff99' : `${nodeData.color}bb`}`,
        boxShadow: selected ? '0 0 0 3px rgba(255,255,255,0.15)' : '0 4px 16px rgba(0,0,0,0.4)',
        minWidth: 80,
        minHeight: 50,
      }}
      onDoubleClick={() => openRectangleEditor(nodeData)}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={80}
        minHeight={50}
        handleStyle={{ width: 8, height: 8, backgroundColor: '#fff', border: '1px solid #475569', borderRadius: 2 }}
        lineStyle={{ borderColor: '#ffffff66' }}
      />

      <Handle type="source" position={Position.Top}    id="top"    style={handleStyle} />
      <Handle type="source" position={Position.Right}  id="right"  style={handleStyle} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={handleStyle} />
      <Handle type="source" position={Position.Left}   id="left"   style={handleStyle} />

      {nodeData.label && (
        <span
          className="text-sm font-semibold select-none text-center px-3 leading-tight"
          style={{ color: 'rgba(255,255,255,0.92)', textShadow: '0 1px 3px rgba(0,0,0,0.6)', pointerEvents: 'none' }}
        >
          {nodeData.label}
        </span>
      )}
    </div>
  )
}

const handleStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  width: 8,
  height: 8,
  border: '2px solid #1e293b',
  opacity: 0.7,
}
