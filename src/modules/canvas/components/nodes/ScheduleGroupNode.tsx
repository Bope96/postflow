'use client'

import { Handle, Position, type NodeProps } from '@xyflow/react'
import { format } from 'date-fns'
import { Clock, Edit2 } from 'lucide-react'
import type { ScheduleGroupNodeData } from '@/lib/canvas-types'
import { getPlatform } from '@/modules/platforms/_base/registry'
import { MOCK_ACCOUNTS } from '@/modules/platforms/_base/mock-accounts'
import { useCanvasStore } from '../../store'

const STATUS_COLOR: Record<string, string> = {
  pending:   '#94a3b8',
  published: '#4ade80',
  failed:    '#f87171',
}

export function ScheduleGroupNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as ScheduleGroupNodeData
  const openScheduleGroupEditor = useCanvasStore((s) => s.openScheduleGroupEditor)
  const updateScheduleGroupAccount = useCanvasStore((s) => s.updateScheduleGroupAccount)

  const scheduledDate = nodeData.scheduledAt
    ? new Date(Number(nodeData.scheduledAt))
    : null

  return (
    <div
      className="rounded-2xl overflow-visible cursor-pointer transition-all"
      style={{
        backgroundColor: '#1e293b',
        border: `2px solid ${selected ? '#6366f1' : '#334155'}`,
        boxShadow: selected ? '0 0 0 4px rgba(99,102,241,0.15)' : '0 8px 32px rgba(0,0,0,0.5)',
        minWidth: 260,
      }}
      onDoubleClick={() => openScheduleGroupEditor(nodeData)}
    >
      {/* Group-level target handle — for media connections (right side) */}
      <Handle
        type="target"
        position={Position.Right}
        id="group-target"
        style={{
          top: 28,
          backgroundColor: '#f59e0b',
          border: '2px solid #0f172a',
          width: 12,
          height: 12,
        }}
      />

      {/* Header */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid #334155' }}>
        <div className="flex items-center gap-1.5 mb-0.5">
          <Clock size={12} className="text-indigo-400" />
          <span className="text-xs font-bold text-indigo-300 uppercase tracking-wide">
            {nodeData.label}
          </span>
        </div>
        <p className="text-sm font-semibold text-slate-100">
          {scheduledDate && !isNaN(scheduledDate.getTime())
            ? format(scheduledDate, 'MMM d, h:mm a')
            : 'No time set'}
        </p>
      </div>

      {/* Platform account rows */}
      <div className="py-1.5">
        {nodeData.accounts.map((account) => {
          const platform = getPlatform(account.platformId)
          const options = MOCK_ACCOUNTS[account.platformId] ?? []
          return (
            <div key={account.id} className="relative flex items-center gap-2 px-4 py-2">
              {/* Per-row target handle — for caption connections (left side) */}
              <Handle
                type="target"
                position={Position.Left}
                id={account.id}
                style={{
                  backgroundColor: platform?.color ?? '#6366f1',
                  border: '2px solid #0f172a',
                  width: 10,
                  height: 10,
                }}
              />

              {/* Platform color dot + name */}
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: platform?.color ?? '#94a3b8' }}
              />
              <span
                className="text-xs font-medium flex-shrink-0"
                style={{ color: platform?.color ?? '#94a3b8', minWidth: 64 }}
              >
                {platform?.name ?? account.platformId}
              </span>

              {/* Account dropdown */}
              <select
                className="flex-1 text-xs rounded-md px-2 py-1 min-w-0 nodrag"
                style={{
                  backgroundColor: '#0f172a',
                  color: '#cbd5e1',
                  border: '1px solid #334155',
                  outline: 'none',
                }}
                value={account.accountName}
                onChange={(e) =>
                  updateScheduleGroupAccount(nodeData.id, account.id, e.target.value)
                }
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={(e) => e.stopPropagation()}
              >
                {options.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
                {/* Keep current value if it's not in mock list */}
                {!options.includes(account.accountName) && (
                  <option value={account.accountName}>{account.accountName}</option>
                )}
              </select>

              {/* Status dot */}
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: STATUS_COLOR[account.status] }}
                title={account.status}
              />
            </div>
          )
        })}
      </div>

      <div className="px-4 pb-2.5 text-xs text-slate-600 flex items-center gap-1">
        <Edit2 size={10} />
        Double-click to edit
      </div>
    </div>
  )
}
