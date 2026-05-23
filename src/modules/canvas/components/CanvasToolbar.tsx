'use client'

import { useState, useRef, useEffect } from 'react'
import { Video, Type, Clock, StickyNote, Share2, Layers, Spline, Copy, Square, Link2, ArrowRight, Play } from 'lucide-react'
import { useCanvasStore } from '../store'
import { getEnabledPlatforms } from '@/modules/platforms/_base/registry'

const EDGE_STYLES = [
  {
    id: 'default',
    label: 'Curved',
    preview: (
      <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
        <path d="M2 18 C10 18, 10 2, 20 2 S30 2, 38 2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <polygon points="36,0 40,2 36,4" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'smoothstep',
    label: 'Rounded',
    preview: (
      <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
        <path d="M2 18 L2 10 Q2 2 10 2 L38 2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <polygon points="36,0 40,2 36,4" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'step',
    label: 'Sharp',
    preview: (
      <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
        <path d="M2 18 L2 2 L38 2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <polygon points="36,0 40,2 36,4" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'straight',
    label: 'Straight',
    preview: (
      <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
        <line x1="2" y1="18" x2="38" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="36,0 40,2 36,4" fill="currentColor" />
      </svg>
    ),
  },
]

const ENABLED_PLATFORMS = getEnabledPlatforms()

export function CanvasToolbar() {
  const addMediaNode            = useCanvasStore((s) => s.addMediaNode)
  const addCaptionNode          = useCanvasStore((s) => s.addCaptionNode)
  const addScheduleGroupNode    = useCanvasStore((s) => s.addScheduleGroupNode)
  const addStickyNoteNode       = useCanvasStore((s) => s.addStickyNoteNode)
  const addEmbedNode            = useCanvasStore((s) => s.addEmbedNode)
  const addRectangleNode        = useCanvasStore((s) => s.addRectangleNode)
  const addLinkNode             = useCanvasStore((s) => s.addLinkNode)
  const addFreeArrow            = useCanvasStore((s) => s.addFreeArrow)
  const groupSelectedNodes      = useCanvasStore((s) => s.groupSelectedNodes)
  const nodes                   = useCanvasStore((s) => s.nodes)

  const duplicateSelectedNodes = useCanvasStore((s) => s.duplicateSelectedNodes)
  const selectedCount = nodes.filter((n) => n.selected).length
  const selectedGroupCount = nodes.filter((n) => n.selected && n.type === 'scheduleGroup').length
  const canGroup = selectedGroupCount >= 2

  const edgeType = useCanvasStore((s) => s.edgeType)
  const setEdgeType = useCanvasStore((s) => s.setEdgeType)

  const [platformsOpen, setPlatformsOpen] = useState(false)
  const [edgePickerOpen, setEdgePickerOpen] = useState(false)
  const platformsRef = useRef<HTMLDivElement>(null)
  const edgePickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!platformsOpen && !edgePickerOpen) return
    const handler = (e: MouseEvent) => {
      if (platformsRef.current && !platformsRef.current.contains(e.target as Node)) setPlatformsOpen(false)
      if (edgePickerRef.current && !edgePickerRef.current.contains(e.target as Node)) setEdgePickerOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [platformsOpen, edgePickerOpen])

  return (
    <div
      className="flex items-center gap-1.5 rounded-xl p-1.5"
      style={{ backgroundColor: '#1e293b', border: '1px solid #334155', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
    >
      <span className="text-sm font-bold text-slate-100 px-2 tracking-tight">PostFlow</span>
      <div className="w-px h-5 bg-slate-700 mx-0.5" />

      <ToolbarButton onClick={addMediaNode}         color="#f59e0b" label="Media"    icon={<Video size={13} />}      title="Add a video or image" />
      <ToolbarButton onClick={addCaptionNode}       color="#6366f1" label="Caption"  icon={<Type size={13} />}       title="Add a caption" />
      <ToolbarButton onClick={addScheduleGroupNode} color="#10b981" label="Schedule" icon={<Clock size={13} />}      title="Add a schedule group" />
      <ToolbarButton onClick={addStickyNoteNode}    color="#854d0e" label="Note"     icon={<StickyNote size={13} />} title="Add a sticky note" textColor="#fef08a" />

      <div className="w-px h-5 bg-slate-700 mx-0.5" />

      <DraggableToolbarButton
        onClick={addEmbedNode}
        dragType="embed"
        color="#ef4444"
        label="Embed"
        icon={<Play size={13} />}
        title="Embed a TikTok, YouTube, or Instagram video · drag to place"
      />

      <DraggableToolbarButton
        onClick={addRectangleNode}
        dragType="rectangle"
        color="#4f46e5"
        label="Shape"
        icon={<Square size={13} />}
        title="Add a rectangle · drag to place"
      />
      <DraggableToolbarButton
        onClick={addLinkNode}
        dragType="link"
        color="#6366f1"
        label="Link"
        icon={<Link2 size={13} />}
        title="Add a link card · drag to place"
      />
      <DraggableToolbarButton
        onClick={addFreeArrow}
        dragType="arrow"
        color="#64748b"
        label="Arrow"
        icon={<ArrowRight size={13} />}
        title="Add a free arrow · drag to place"
        textColor="#94a3b8"
      />

      <div className="w-px h-5 bg-slate-700 mx-0.5" />

      {/* Platforms submenu button */}
      <div ref={platformsRef} className="relative">
        <button
          onClick={() => setPlatformsOpen((o) => !o)}
          title="Add a social media platform node"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:brightness-110"
          style={{
            backgroundColor: platformsOpen ? '#7c3aed44' : '#7c3aed22',
            color: '#a78bfa',
            border: `1px solid ${platformsOpen ? '#7c3aed88' : '#7c3aed44'}`,
          }}
        >
          <Share2 size={13} />
          Platforms
        </button>

        {platformsOpen && (
          <div
            className="absolute top-full left-0 mt-2 rounded-xl py-1.5 z-50"
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
              minWidth: 200,
            }}
          >
            <p className="px-3 py-1 text-xs text-slate-500 mb-1">Click to add · Drag to position</p>
            {ENABLED_PLATFORMS.map((platform) => (
              <div
                key={platform.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/postflow-platform', platform.id)
                  e.dataTransfer.effectAllowed = 'copy'
                  setPlatformsOpen(false)
                }}
                className="flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer transition-colors"
                style={{ color: '#cbd5e1' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#334155' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                onClick={() => {
                  useCanvasStore.getState().addPlatformNodeAt(platform.id, { x: 400 + Math.random() * 200, y: 200 + Math.random() * 200 })
                  setPlatformsOpen(false)
                }}
              >
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: platform.color }} />
                <span style={{ color: platform.color, fontWeight: 500 }}>{platform.name}</span>
                <span className="ml-auto text-xs text-slate-600">drag or click</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edge style picker */}
      <div ref={edgePickerRef} className="relative">
        <button
          onClick={() => setEdgePickerOpen((o) => !o)}
          title="Change arrow style"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:brightness-110"
          style={{
            backgroundColor: edgePickerOpen ? '#0ea5e944' : '#0ea5e922',
            color: '#38bdf8',
            border: `1px solid ${edgePickerOpen ? '#0ea5e988' : '#0ea5e944'}`,
          }}
        >
          <Spline size={13} />
          {EDGE_STYLES.find((s) => s.id === edgeType)?.label ?? 'Arrows'}
        </button>

        {edgePickerOpen && (
          <div
            className="absolute top-full left-0 mt-2 rounded-xl py-1.5 z-50"
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
              minWidth: 160,
            }}
          >
            {EDGE_STYLES.map((style) => (
              <button
                key={style.id}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors text-left"
                style={{
                  color: edgeType === style.id ? '#38bdf8' : '#cbd5e1',
                  backgroundColor: edgeType === style.id ? '#0ea5e922' : 'transparent',
                }}
                onMouseEnter={(e) => { if (edgeType !== style.id) e.currentTarget.style.backgroundColor = '#334155' }}
                onMouseLeave={(e) => { if (edgeType !== style.id) e.currentTarget.style.backgroundColor = 'transparent' }}
                onClick={() => { setEdgeType(style.id); setEdgePickerOpen(false) }}
              >
                <span style={{ color: edgeType === style.id ? '#38bdf8' : '#64748b' }}>
                  {style.preview}
                </span>
                {style.label}
                {edgeType === style.id && <span className="ml-auto text-xs opacity-60">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Duplicate + Group buttons — appear when nodes are selected */}
      {selectedCount > 0 && (
        <>
          <div className="w-px h-5 bg-slate-700 mx-0.5" />
          <button
            onClick={duplicateSelectedNodes}
            title={`Duplicate ${selectedCount} selected node${selectedCount > 1 ? 's' : ''} (Ctrl+D)`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:brightness-110"
            style={{ backgroundColor: '#0ea5e922', color: '#38bdf8', border: '1px solid #0ea5e944' }}
          >
            <Copy size={13} />
            Duplicate {selectedCount > 1 ? `${selectedCount}` : ''}
          </button>
        </>
      )}
      {canGroup && (
        <>
          <div className="w-px h-5 bg-slate-700 mx-0.5" />
          <button
            onClick={groupSelectedNodes}
            title={`Group ${selectedGroupCount} selected schedule nodes into one`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:brightness-110"
            style={{ backgroundColor: '#10b98122', color: '#34d399', border: '1px solid #10b98144' }}
          >
            <Layers size={13} />
            Group {selectedGroupCount}
          </button>
        </>
      )}

      <div className="w-px h-5 bg-slate-700 mx-0.5" />
      <span className="text-xs text-slate-600 px-1 hidden sm:block">
        Drag to select · Space+drag to pan
      </span>
    </div>
  )
}

function ToolbarButton({
  onClick, color, label, icon, title, textColor,
}: {
  onClick: () => void
  color: string
  label: string
  icon: React.ReactNode
  title: string
  textColor?: string
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:brightness-110"
      style={{ backgroundColor: `${color}22`, color: textColor ?? color, border: `1px solid ${color}44` }}
    >
      {icon}
      {label}
    </button>
  )
}

function DraggableToolbarButton({
  onClick, dragType, color, label, icon, title, textColor,
}: {
  onClick: () => void
  dragType: string
  color: string
  label: string
  icon: React.ReactNode
  title: string
  textColor?: string
}) {
  return (
    <button
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/postflow-node', dragType)
        e.dataTransfer.effectAllowed = 'copy'
      }}
      onClick={onClick}
      title={title}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:brightness-110 cursor-grab active:cursor-grabbing"
      style={{ backgroundColor: `${color}22`, color: textColor ?? color, border: `1px solid ${color}44` }}
    >
      {icon}
      {label}
    </button>
  )
}
