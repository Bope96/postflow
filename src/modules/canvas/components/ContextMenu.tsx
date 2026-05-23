'use client'

import { useEffect, useRef } from 'react'
import {
  Video, Type, Clock, StickyNote, Pencil, Trash2, Ungroup,
  Link2Off, Layers, Copy, CopyPlus, Clipboard, ClipboardPaste,
} from 'lucide-react'

export type ContextMenuState = {
  x: number
  y: number
  flowPosition?: { x: number; y: number }
  nodeId?: string
  nodeType?: string
  edgeId?: string
} | null

interface Props {
  menu: ContextMenuState
  onClose: () => void
  // canvas actions
  onAddMedia?: (pos: { x: number; y: number }) => void
  onAddCaption?: (pos: { x: number; y: number }) => void
  onAddSchedule?: (pos: { x: number; y: number }) => void
  onAddNote?: (pos: { x: number; y: number }) => void
  onPaste?: () => void
  hasClipboard?: boolean
  // node actions
  onEditNode?: (id: string, type: string) => void
  onDeleteNode?: (id: string) => void
  onCopyNode?: (id: string) => void
  onDuplicateNode?: (id: string) => void
  onUngroupSchedule?: (id: string) => void
  onGroupSelected?: () => void
  selectedGroupCount?: number
  // edge actions
  onDeleteEdge?: (id: string) => void
}

interface MenuItem {
  label: string
  icon: React.ReactNode
  action: () => void | Promise<void>
  danger?: boolean
  divider?: boolean
  muted?: boolean
}

export function ContextMenu({
  menu, onClose,
  onAddMedia, onAddCaption, onAddSchedule, onAddNote, onPaste, hasClipboard,
  onEditNode, onDeleteNode, onCopyNode, onDuplicateNode, onUngroupSchedule, onGroupSelected, selectedGroupCount,
  onDeleteEdge,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  if (!menu) return null

  const pos = menu.flowPosition ?? { x: 0, y: 0 }
  let items: MenuItem[] = []

  if (menu.edgeId) {
    items = [
      { label: 'Remove Arrow', icon: <Link2Off size={14} />, action: () => onDeleteEdge?.(menu.edgeId!), danger: true },
    ]
  } else if (menu.nodeId && menu.nodeType) {
    const baseItems: MenuItem[] = [
      { label: 'Edit',      icon: <Pencil size={14} />,  action: () => onEditNode?.(menu.nodeId!, menu.nodeType!) },
      { label: 'Copy',      icon: <Copy size={14} />,    action: () => onCopyNode?.(menu.nodeId!) },
      { label: 'Duplicate', icon: <CopyPlus size={14} />, action: () => onDuplicateNode?.(menu.nodeId!), divider: true },
    ]

    if (menu.nodeType === 'scheduleGroup') {
      const groupItems: MenuItem[] = [
        {
          label: 'Ungroup',
          icon: <Ungroup size={14} />,
          action: () => onUngroupSchedule?.(menu.nodeId!),
        },
        ...(selectedGroupCount && selectedGroupCount >= 2
          ? [{ label: `Group ${selectedGroupCount} Selected`, icon: <Layers size={14} />, action: () => onGroupSelected?.(), divider: true }]
          : []
        ),
        { label: 'Delete', icon: <Trash2 size={14} />, action: () => onDeleteNode?.(menu.nodeId!), danger: true },
      ]
      items = [...baseItems, ...groupItems]
    } else {
      items = [
        ...baseItems,
        { label: 'Delete', icon: <Trash2 size={14} />, action: () => onDeleteNode?.(menu.nodeId!), danger: true },
      ]
    }
  } else {
    // Right-clicked empty canvas
    items = [
      {
        label: hasClipboard ? 'Paste' : 'Paste',
        icon: hasClipboard ? <ClipboardPaste size={14} /> : <Clipboard size={14} />,
        action: () => onPaste?.(),
        muted: !hasClipboard,
        divider: true,
      },
      { label: 'Add Media',    icon: <Video size={14} />,      action: () => onAddMedia?.(pos) },
      { label: 'Add Caption',  icon: <Type size={14} />,       action: () => onAddCaption?.(pos) },
      { label: 'Add Schedule', icon: <Clock size={14} />,      action: () => onAddSchedule?.(pos), divider: true },
      { label: 'Add Note',     icon: <StickyNote size={14} />, action: () => onAddNote?.(pos) },
    ]
  }

  const MENU_W = 196
  const MENU_H = items.length * 38 + 16
  const left = menu.x + MENU_W > window.innerWidth  ? menu.x - MENU_W : menu.x
  const top  = menu.y + MENU_H > window.innerHeight ? menu.y - MENU_H : menu.y

  return (
    <div
      ref={ref}
      className="fixed z-50 rounded-xl py-1.5 overflow-hidden"
      style={{
        left,
        top,
        width: MENU_W,
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
      }}
    >
      {items.map((item, i) => (
        <div key={i}>
          {item.divider && i > 0 && (
            <div className="my-1 mx-2" style={{ height: 1, backgroundColor: '#334155' }} />
          )}
          <button
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors text-left"
            style={{ color: item.danger ? '#f87171' : item.muted ? '#475569' : '#cbd5e1' }}
            onMouseEnter={(e) => {
              if (!item.muted) e.currentTarget.style.backgroundColor = item.danger ? '#450a0a' : '#334155'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
            onClick={async () => {
              await item.action()
              onClose()
            }}
          >
            <span style={{ color: item.danger ? '#f87171' : item.muted ? '#334155' : '#64748b' }}>
              {item.icon}
            </span>
            {item.label}
            {item.label === 'Paste' && !hasClipboard && (
              <span className="ml-auto text-xs" style={{ color: '#334155' }}>empty</span>
            )}
          </button>
        </div>
      ))}
    </div>
  )
}
