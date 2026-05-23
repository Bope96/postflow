'use client'

import { useState, useEffect } from 'react'
import { X, Trash2, Plus } from 'lucide-react'
import { format } from 'date-fns'
import type { ScheduleGroupNodeData, ScheduledAccount } from '@/lib/canvas-types'
import { PLATFORM_REGISTRY } from '@/modules/platforms/_base/registry'
import { useCanvasStore } from '../../store'

export function ScheduleGroupEditor() {
  const { isScheduleGroupEditorOpen, selectedScheduleGroup, closeScheduleGroupEditor,
    saveScheduleGroupNode, deleteScheduleGroupNode } = useCanvasStore()

  const [label, setLabel] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [accounts, setAccounts] = useState<ScheduledAccount[]>([])
  const [newPlatformId, setNewPlatformId] = useState('instagram')
  const [newAccountName, setNewAccountName] = useState('')

  useEffect(() => {
    if (selectedScheduleGroup) {
      setLabel(selectedScheduleGroup.label)
      setScheduledAt(
        selectedScheduleGroup.scheduledAt
          ? format(new Date(Number(selectedScheduleGroup.scheduledAt)), "yyyy-MM-dd'T'HH:mm")
          : ''
      )
      setAccounts(selectedScheduleGroup.accounts)
    }
  }, [selectedScheduleGroup])

  if (!isScheduleGroupEditorOpen || !selectedScheduleGroup) return null

  function addAccount() {
    if (!newAccountName.trim()) return
    const newAcc: ScheduledAccount = {
      id: `acc-${Date.now()}`,
      platformId: newPlatformId,
      accountName: newAccountName.trim(),
      status: 'pending',
    }
    setAccounts((prev) => [...prev, newAcc])
    setNewAccountName('')
  }

  function removeAccount(id: string) {
    setAccounts((prev) => prev.filter((a) => a.id !== id))
  }

  function handleSave() {
    if (!selectedScheduleGroup) return
    saveScheduleGroupNode({
      ...selectedScheduleGroup,
      label,
      scheduledAt: scheduledAt ? String(new Date(scheduledAt).getTime()) : selectedScheduleGroup.scheduledAt,
      accounts,
    })
  }

  const enabledPlatforms = PLATFORM_REGISTRY.filter((p) => p.isEnabled)

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={closeScheduleGroupEditor} />
      <div className="fixed right-0 top-0 h-full w-[420px] z-50 flex flex-col"
        style={{ backgroundColor: '#1e293b', borderLeft: '1px solid #334155' }}>

        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #334155' }}>
          <h2 className="text-lg font-semibold text-slate-100">Schedule Group</h2>
          <div className="flex gap-2">
            <button onClick={() => deleteScheduleGroupNode(selectedScheduleGroup.id)}
              className="p-2 text-slate-500 hover:text-red-400 rounded-lg transition-colors">
              <Trash2 size={16} />
            </button>
            <button onClick={closeScheduleGroupEditor}
              className="p-2 text-slate-500 hover:text-slate-200 rounded-lg transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Label</label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Schedule Time 2/2"
              className="w-full rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
            />
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Date & Time</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
            />
          </div>

          {/* Accounts */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Platform Accounts <span className="text-slate-600 font-normal">({accounts.length})</span>
            </label>
            <div className="space-y-2 mb-3">
              {accounts.map((acc) => {
                const platform = PLATFORM_REGISTRY.find((p) => p.id === acc.platformId)
                return (
                  <div key={acc.id} className="flex items-center gap-2 rounded-lg px-3 py-2"
                    style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: platform?.color ?? '#94a3b8' }} />
                    <span className="flex-1 text-sm text-slate-200 truncate">{acc.accountName}</span>
                    <button onClick={() => removeAccount(acc.id)}
                      className="text-slate-600 hover:text-red-400 transition-colors">
                      <X size={13} />
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Add account row */}
            <div className="flex gap-2">
              <select
                value={newPlatformId}
                onChange={(e) => setNewPlatformId(e.target.value)}
                className="rounded-lg px-2 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-shrink-0"
                style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
              >
                {enabledPlatforms.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <input
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addAccount()}
                placeholder="Account name..."
                className="flex-1 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
              />
              <button onClick={addAccount}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex-shrink-0">
                <Plus size={14} />
              </button>
            </div>
            <p className="text-xs text-slate-600 mt-1.5">Press Enter or click + to add</p>
          </div>
        </div>

        <div className="px-6 py-4" style={{ borderTop: '1px solid #334155' }}>
          <button onClick={handleSave}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors">
            Save Schedule Group
          </button>
        </div>
      </div>
    </>
  )
}
