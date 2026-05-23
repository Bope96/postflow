'use client'

import { type NodeProps } from '@xyflow/react'
import { Edit2 } from 'lucide-react'
import type { StickyNote, StickyNoteColor } from '@/lib/types'
import { useCanvasStore } from '../../store'

const NOTE_COLORS: Record<StickyNoteColor, { bg: string; border: string; text: string; author: string }> = {
  yellow: { bg: '#fef9c3', border: '#fde047', text: '#713f12', author: '#92400e' },
  pink:   { bg: '#fce7f3', border: '#f9a8d4', text: '#831843', author: '#9d174d' },
  blue:   { bg: '#dbeafe', border: '#93c5fd', text: '#1e3a8a', author: '#1d4ed8' },
  green:  { bg: '#dcfce7', border: '#86efac', text: '#14532d', author: '#15803d' },
  purple: { bg: '#f3e8ff', border: '#d8b4fe', text: '#581c87', author: '#7c3aed' },
}

export function StickyNoteNode({ data }: NodeProps) {
  const note = data as unknown as StickyNote
  const openNoteEditor = useCanvasStore((s) => s.openNoteEditor)
  const colors = NOTE_COLORS[note.color ?? 'yellow']

  return (
    <div
      className="w-52 min-h-36 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow p-3 flex flex-col gap-2"
      style={{
        backgroundColor: colors.bg,
        border: `2px solid ${colors.border}`,
      }}
      onDoubleClick={() => openNoteEditor(note)}
    >
      {/* Author */}
      <div
        className="text-xs font-semibold tracking-wide uppercase"
        style={{ color: colors.author }}
      >
        {note.authorName}
      </div>

      {/* Content */}
      <p
        className="text-sm leading-relaxed flex-1"
        style={{ color: colors.text }}
      >
        {note.content || <span style={{ opacity: 0.5 }}>Empty note...</span>}
      </p>

      {/* Edit hint */}
      <div
        className="flex items-center gap-1 text-xs opacity-40 mt-auto"
        style={{ color: colors.text }}
      >
        <Edit2 size={10} />
        Double-click to edit
      </div>
    </div>
  )
}
