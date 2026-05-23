'use client'

import { create } from 'zustand'
import {
  type Node,
  type Edge,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MarkerType,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react'
import type { MediaNodeData, CaptionNodeData, ScheduleGroupNodeData, RectangleNodeData, LinkNodeData, ArrowAnchorNodeData, EmbedNodeData } from '@/lib/canvas-types'
import { parseEmbedUrl } from '@/lib/embed-utils'
import type { StickyNote } from '@/lib/types'
import { MOCK_NODES, MOCK_EDGES } from './mock-data'

interface CanvasStore {
  nodes: Node[]
  edges: Edge[]

  // Media editor
  isMediaEditorOpen: boolean
  selectedMedia: MediaNodeData | null
  openMediaEditor: (data: MediaNodeData) => void
  closeMediaEditor: () => void
  saveMediaNode: (data: MediaNodeData) => void
  deleteMediaNode: (id: string) => void

  // Caption editor
  isCaptionEditorOpen: boolean
  selectedCaption: CaptionNodeData | null
  openCaptionEditor: (data: CaptionNodeData) => void
  closeCaptionEditor: () => void
  saveCaptionNode: (data: CaptionNodeData) => void
  deleteCaptionNode: (id: string) => void

  // Schedule group editor
  isScheduleGroupEditorOpen: boolean
  selectedScheduleGroup: ScheduleGroupNodeData | null
  openScheduleGroupEditor: (data: ScheduleGroupNodeData) => void
  closeScheduleGroupEditor: () => void
  saveScheduleGroupNode: (data: ScheduleGroupNodeData) => void
  deleteScheduleGroupNode: (id: string) => void

  // Note editor (keep existing)
  isNoteEditorOpen: boolean
  selectedNote: StickyNote | null
  openNoteEditor: (note?: StickyNote) => void
  closeNoteEditor: () => void
  saveNote: (note: StickyNote) => void
  deleteNote: (id: string) => void

  // React Flow handlers
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void

  // Add new nodes
  addMediaNode: () => void
  addCaptionNode: () => void
  addScheduleGroupNode: () => void
  addStickyNoteNode: () => void

  // Drop file onto canvas
  addMediaNodeFromFile: (file: File, position: { x: number; y: number }) => void

  // Context menu actions
  deleteEdge: (id: string) => void
  addMediaNodeAt: (pos: { x: number; y: number }) => void
  addCaptionNodeAt: (pos: { x: number; y: number }) => void
  addScheduleGroupNodeAt: (pos: { x: number; y: number }) => void
  ungroupScheduleNode: (id: string) => void

  // Platform drop from toolbar
  addPlatformNodeAt: (platformId: string, pos: { x: number; y: number }) => void

  // Edge style
  edgeType: string
  setEdgeType: (type: string) => void

  // Duplicate selected nodes + their interconnecting edges
  duplicateSelectedNodes: () => void

  // Account name update within a schedule group row
  updateScheduleGroupAccount: (nodeId: string, accountId: string, accountName: string) => void

  // Group multiple selected schedule-group nodes into one
  groupSelectedNodes: () => void

  // Rectangle node
  isRectangleEditorOpen: boolean
  selectedRectangle: RectangleNodeData | null
  openRectangleEditor: (data: RectangleNodeData) => void
  closeRectangleEditor: () => void
  saveRectangleNode: (data: RectangleNodeData) => void
  deleteRectangleNode: (id: string) => void
  addRectangleNode: () => void
  addRectangleNodeAt: (pos: { x: number; y: number }) => void

  // Link node
  isLinkEditorOpen: boolean
  selectedLink: LinkNodeData | null
  openLinkEditor: (data: LinkNodeData) => void
  closeLinkEditor: () => void
  saveLinkNode: (data: LinkNodeData) => void
  deleteLinkNode: (id: string) => void
  addLinkNode: () => void
  addLinkNodeAt: (pos: { x: number; y: number }) => void

  // Free arrow (two anchor nodes + edge)
  addFreeArrow: () => void
  addFreeArrowAt: (pos: { x: number; y: number }) => void

  // Embed node (TikTok, YouTube, Instagram, Facebook inline players)
  isEmbedEditorOpen: boolean
  selectedEmbed: EmbedNodeData | null
  openEmbedEditor: (data: EmbedNodeData) => void
  closeEmbedEditor: () => void
  saveEmbedNode: (data: EmbedNodeData) => void
  deleteEmbedNode: (id: string) => void
  addEmbedNode: () => void
  addEmbedNodeAt: (pos: { x: number; y: number }) => void

  // Minimap
  showMinimap: boolean
  toggleMinimap: () => void

  // Clipboard
  clipboard: Node[]
  copyNodes: (ids: string[]) => void
  pasteNodes: (pos: { x: number; y: number }) => void
  pasteFromText: (text: string, pos: { x: number; y: number }) => void
}

function d(data: unknown): Record<string, unknown> {
  return data as unknown as Record<string, unknown>
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  nodes: MOCK_NODES,
  edges: MOCK_EDGES,
  showMinimap: true,
  toggleMinimap: () => set((s) => ({ showMinimap: !s.showMinimap })),
  clipboard: [],
  edgeType: 'smoothstep',
  setEdgeType: (type) => set((s) => ({
    edgeType: type,
    edges: s.edges.map((e) => ({ ...e, type })),
  })),

  duplicateSelectedNodes: () => set((s) => {
    const selected = s.nodes.filter((n) => n.selected)
    if (!selected.length) return s

    const ts = Date.now()
    // Map old node ID → new node ID
    const idMap = new Map<string, string>()
    selected.forEach((n, i) => idMap.set(n.id, `${n.id}-copy-${ts}-${i}`))

    // Clone nodes, offset down-right, mark as selected (deselect originals)
    const OFFSET = { x: 260, y: 80 }
    const newNodes: Node[] = selected.map((n) => ({
      ...n,
      id: idMap.get(n.id)!,
      position: { x: n.position.x + OFFSET.x, y: n.position.y + OFFSET.y },
      selected: true,
      // Deep-clone data so edits don't bleed between original and copy
      data: JSON.parse(JSON.stringify(n.data)) as Record<string, unknown>,
    }))

    // Also update the node-data `id` field if present (MediaNodeData, CaptionNodeData, etc. all have id)
    newNodes.forEach((n) => {
      const data = n.data as Record<string, unknown>
      if (typeof data.id === 'string') data.id = n.id
    })

    const selectedIds = new Set(selected.map((n) => n.id))

    // Clone edges whose both endpoints are in the selection
    const newEdges: Edge[] = s.edges
      .filter((e) => selectedIds.has(e.source) && selectedIds.has(e.target))
      .map((e, i) => ({
        ...e,
        id: `${e.id}-copy-${ts}-${i}`,
        source: idMap.get(e.source)!,
        target: idMap.get(e.target)!,
        selected: false,
      }))

    // Deselect originals
    const deselectedOriginals = s.nodes.map((n) =>
      n.selected ? { ...n, selected: false } : n
    )

    return {
      nodes: [...deselectedOriginals, ...newNodes],
      edges: [...s.edges, ...newEdges],
    }
  }),

  // ── Media ────────────────────────────────────────────────────
  isMediaEditorOpen: false,
  selectedMedia: null,
  openMediaEditor: (data) => set({ selectedMedia: data, isMediaEditorOpen: true }),
  closeMediaEditor: () => set({ isMediaEditorOpen: false, selectedMedia: null }),
  saveMediaNode: (data) => set((s) => ({
    nodes: s.nodes.map((n) => n.id === data.id ? { ...n, data: d(data) } : n),
    isMediaEditorOpen: false,
    selectedMedia: null,
  })),
  deleteMediaNode: (id) => set((s) => ({
    nodes: s.nodes.filter((n) => n.id !== id),
    edges: s.edges.filter((e) => e.source !== id && e.target !== id),
    isMediaEditorOpen: false,
    selectedMedia: null,
  })),

  // ── Caption ──────────────────────────────────────────────────
  isCaptionEditorOpen: false,
  selectedCaption: null,
  openCaptionEditor: (data) => set({ selectedCaption: data, isCaptionEditorOpen: true }),
  closeCaptionEditor: () => set({ isCaptionEditorOpen: false, selectedCaption: null }),
  saveCaptionNode: (data) => set((s) => ({
    nodes: s.nodes.map((n) => n.id === data.id ? { ...n, data: d(data) } : n),
    isCaptionEditorOpen: false,
    selectedCaption: null,
  })),
  deleteCaptionNode: (id) => set((s) => ({
    nodes: s.nodes.filter((n) => n.id !== id),
    edges: s.edges.filter((e) => e.source !== id && e.target !== id),
    isCaptionEditorOpen: false,
    selectedCaption: null,
  })),

  // ── Schedule Group ────────────────────────────────────────────
  isScheduleGroupEditorOpen: false,
  selectedScheduleGroup: null,
  openScheduleGroupEditor: (data) => set({ selectedScheduleGroup: data, isScheduleGroupEditorOpen: true }),
  closeScheduleGroupEditor: () => set({ isScheduleGroupEditorOpen: false, selectedScheduleGroup: null }),
  saveScheduleGroupNode: (data) => set((s) => ({
    nodes: s.nodes.map((n) => n.id === data.id ? { ...n, data: d(data) } : n),
    isScheduleGroupEditorOpen: false,
    selectedScheduleGroup: null,
  })),
  deleteScheduleGroupNode: (id) => set((s) => ({
    nodes: s.nodes.filter((n) => n.id !== id),
    edges: s.edges.filter((e) => e.source !== id && e.target !== id),
    isScheduleGroupEditorOpen: false,
    selectedScheduleGroup: null,
  })),

  // ── Sticky Notes ──────────────────────────────────────────────
  isNoteEditorOpen: false,
  selectedNote: null,
  openNoteEditor: (note) => set({ selectedNote: note ?? null, isNoteEditorOpen: true }),
  closeNoteEditor: () => set({ isNoteEditorOpen: false, selectedNote: null }),
  saveNote: (note) => set((s) => {
    const exists = s.nodes.find((n) => n.id === note.id)
    if (exists) return { nodes: s.nodes.map((n) => n.id === note.id ? { ...n, data: d(note) } : n), isNoteEditorOpen: false, selectedNote: null }
    return {
      nodes: [...s.nodes, { id: note.id, type: 'stickyNote', position: { x: 200 + Math.random() * 400, y: 200 + Math.random() * 300 }, data: d(note) }],
      isNoteEditorOpen: false,
      selectedNote: null,
    }
  }),
  deleteNote: (id) => set((s) => ({ nodes: s.nodes.filter((n) => n.id !== id), isNoteEditorOpen: false, selectedNote: null })),

  // ── React Flow handlers ───────────────────────────────────────
  onNodesChange: (changes) => set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) })),
  onEdgesChange: (changes) => set((s) => ({ edges: applyEdgeChanges(changes, s.edges) })),
  onConnect: (connection) => set((s) => ({
    edges: addEdge({
      ...connection,
      type: 'smoothstep',
      style: { stroke: '#6366f1', strokeWidth: 1.5 },
    }, s.edges),
  })),

  // ── Add new nodes ─────────────────────────────────────────────
  addMediaNode: () => {
    const id = `media-${Date.now()}`
    const data: MediaNodeData = { id, title: 'New Media', mediaType: 'unknown' }
    const node: Node = { id, type: 'media', position: { x: 300 + Math.random() * 200, y: 100 + Math.random() * 200 }, data: d(data) }
    set((s) => ({ nodes: [...s.nodes, node] }))
    get().openMediaEditor(data)
  },

  addCaptionNode: () => {
    const id = `caption-${Date.now()}`
    const nodeCount = get().nodes.filter((n) => n.type === 'caption').length
    const data: CaptionNodeData = { id, label: `Caption ${nodeCount + 1}`, text: '' }
    const node: Node = { id, type: 'caption', position: { x: 50 + Math.random() * 100, y: 100 + Math.random() * 300 }, data: d(data) }
    set((s) => ({ nodes: [...s.nodes, node] }))
    get().openCaptionEditor(data)
  },

  addScheduleGroupNode: () => {
    const id = `sg-${Date.now()}`
    const data: ScheduleGroupNodeData = {
      id,
      label: 'New Schedule',
      scheduledAt: String(Date.now() + 24 * 60 * 60 * 1000),
      accounts: [],
    }
    const node: Node = { id, type: 'scheduleGroup', position: { x: 380 + Math.random() * 100, y: 100 + Math.random() * 200 }, data: d(data) }
    set((s) => ({ nodes: [...s.nodes, node] }))
    get().openScheduleGroupEditor(data)
  },

  addStickyNoteNode: () => {
    const colors = ['yellow', 'pink', 'blue', 'green', 'purple'] as const
    const note: StickyNote = {
      id: `note-${Date.now()}`,
      workspaceId: 'ws-1',
      authorId: 'user-1',
      authorName: 'You',
      content: '',
      color: colors[Math.floor(Math.random() * colors.length)],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    get().openNoteEditor(note)
  },

  deleteEdge: (id) => set((s) => ({ edges: s.edges.filter((e) => e.id !== id) })),

  addMediaNodeAt: (pos) => {
    const id = `media-${Date.now()}`
    const data: MediaNodeData = { id, title: 'New Media', mediaType: 'unknown' }
    const node: Node = { id, type: 'media', position: pos, data: d(data) }
    set((s) => ({ nodes: [...s.nodes, node] }))
    get().openMediaEditor(data)
  },

  addCaptionNodeAt: (pos) => {
    const id = `caption-${Date.now()}`
    const nodeCount = get().nodes.filter((n) => n.type === 'caption').length
    const data: CaptionNodeData = { id, label: `Caption ${nodeCount + 1}`, text: '' }
    const node: Node = { id, type: 'caption', position: pos, data: d(data) }
    set((s) => ({ nodes: [...s.nodes, node] }))
    get().openCaptionEditor(data)
  },

  addScheduleGroupNodeAt: (pos) => {
    const id = `sg-${Date.now()}`
    const data: ScheduleGroupNodeData = {
      id,
      label: 'New Schedule',
      scheduledAt: String(Date.now() + 24 * 60 * 60 * 1000),
      accounts: [],
    }
    const node: Node = { id, type: 'scheduleGroup', position: pos, data: d(data) }
    set((s) => ({ nodes: [...s.nodes, node] }))
    get().openScheduleGroupEditor(data)
  },

  ungroupScheduleNode: (id) => set((s) => {
    const node = s.nodes.find((n) => n.id === id)
    if (!node) return s
    const groupData = node.data as unknown as ScheduleGroupNodeData
    if (!groupData.accounts.length) {
      return {
        nodes: s.nodes.filter((n) => n.id !== id),
        edges: s.edges.filter((e) => e.source !== id && e.target !== id),
      }
    }
    const newNodes: Node[] = groupData.accounts.map((account, i) => {
      const newId = `sg-${Date.now()}-${i}`
      const newData: ScheduleGroupNodeData = {
        id: newId,
        label: account.accountName,
        scheduledAt: groupData.scheduledAt,
        accounts: [{ ...account, id: `${newId}-acc` }],
      }
      return {
        id: newId,
        type: 'scheduleGroup',
        position: {
          x: node.position.x + (i % 3) * 280,
          y: node.position.y + Math.floor(i / 3) * 200,
        },
        data: d(newData),
      }
    })
    return {
      nodes: [...s.nodes.filter((n) => n.id !== id), ...newNodes],
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
    }
  }),

  updateScheduleGroupAccount: (nodeId, accountId, accountName) => set((s) => ({
    nodes: s.nodes.map((n) => {
      if (n.id !== nodeId) return n
      const data = n.data as unknown as ScheduleGroupNodeData
      return {
        ...n,
        data: d({
          ...data,
          accounts: data.accounts.map((a) =>
            a.id === accountId ? { ...a, accountName } : a
          ),
        }),
      }
    }),
  })),

  groupSelectedNodes: () => set((s) => {
    const selected = s.nodes.filter((n) => n.selected && n.type === 'scheduleGroup')
    if (selected.length < 2) return s
    const selectedIds = new Set(selected.map((n) => n.id))

    const avgX = selected.reduce((sum, n) => sum + n.position.x, 0) / selected.length
    const avgY = selected.reduce((sum, n) => sum + n.position.y, 0) / selected.length

    const allAccounts = selected.flatMap((n) => {
      const data = n.data as unknown as ScheduleGroupNodeData
      return data.accounts
    })

    const firstData = selected[0].data as unknown as ScheduleGroupNodeData
    const newId = `sg-${Date.now()}`
    const newData: ScheduleGroupNodeData = {
      id: newId,
      label: 'Grouped Schedule',
      scheduledAt: firstData.scheduledAt,
      accounts: allAccounts.map((a, i) => ({ ...a, id: `${newId}-acc-${i}` })),
    }
    const newNode: Node = {
      id: newId,
      type: 'scheduleGroup',
      position: { x: avgX, y: avgY },
      data: d(newData),
    }

    return {
      nodes: [...s.nodes.filter((n) => !selectedIds.has(n.id)), newNode],
      edges: s.edges.filter((e) => !selectedIds.has(e.source) && !selectedIds.has(e.target)),
    }
  }),

  addPlatformNodeAt: (platformId, pos) => {
    const id = `sg-${Date.now()}`
    const accId = `${id}-acc`
    const data: ScheduleGroupNodeData = {
      id,
      label: 'New Schedule',
      scheduledAt: String(Date.now() + 24 * 60 * 60 * 1000),
      accounts: [{ id: accId, platformId, accountName: `${platformId} account`, status: 'pending' }],
    }
    const node: Node = { id, type: 'scheduleGroup', position: pos, data: d(data) }
    set((s) => ({ nodes: [...s.nodes, node] }))
    get().openScheduleGroupEditor(data)
  },

  addMediaNodeFromFile: (file, position) => {
    const id = `media-${Date.now()}`
    const mediaType = file.type.startsWith('video') ? 'video' : file.type.startsWith('image') ? 'image' : 'unknown'
    const previewUrl = URL.createObjectURL(file)
    const data: MediaNodeData = {
      id,
      title: file.name.replace(/\.[^.]+$/, ''),
      mediaType,
      fileName: file.name,
      previewUrl,
    }
    const node: Node = { id, type: 'media', position, data: d(data) }
    set((s) => ({ nodes: [...s.nodes, node] }))
  },

  // ── Clipboard ─────────────────────────────────────────────────
  copyNodes: (ids) => set((s) => ({
    clipboard: s.nodes
      .filter((n) => ids.includes(n.id))
      .map((n) => ({ ...n, data: JSON.parse(JSON.stringify(n.data)) as Record<string, unknown> })),
  })),

  pasteNodes: (pos) => set((s) => {
    if (!s.clipboard.length) return s
    const ts = Date.now()
    const idMap = new Map<string, string>()
    s.clipboard.forEach((n, i) => idMap.set(n.id, `${n.id}-paste-${ts}-${i}`))

    // Center the pasted group at the click position
    const minX = Math.min(...s.clipboard.map((n) => n.position.x))
    const minY = Math.min(...s.clipboard.map((n) => n.position.y))

    const newNodes: Node[] = s.clipboard.map((n) => {
      const newId = idMap.get(n.id)!
      const data = JSON.parse(JSON.stringify(n.data)) as Record<string, unknown>
      if (typeof data.id === 'string') data.id = newId
      return {
        ...n,
        id: newId,
        position: {
          x: pos.x + (n.position.x - minX),
          y: pos.y + (n.position.y - minY),
        },
        selected: true,
        data,
      }
    })
    const clipIds = new Set(s.clipboard.map((n) => n.id))
    const newEdges: Edge[] = s.edges
      .filter((e) => clipIds.has(e.source) && clipIds.has(e.target))
      .map((e, i) => ({
        ...e,
        id: `${e.id}-paste-${ts}-${i}`,
        source: idMap.get(e.source)!,
        target: idMap.get(e.target)!,
        selected: false,
      }))
    const deselected = s.nodes.map((n) => n.selected ? { ...n, selected: false } : n)
    return { nodes: [...deselected, ...newNodes], edges: [...s.edges, ...newEdges] }
  }),

  pasteFromText: (text, pos) => {
    // Social media / video URL → embed node
    const embed = parseEmbedUrl(text)
    if (embed) {
      const id = `embed-${Date.now()}`
      const data: EmbedNodeData = { id, url: text, embedUrl: embed.embedUrl, title: embed.title, platform: embed.platform }
      const node: Node = { id, type: 'embed', position: pos, style: { width: 320, height: 460 }, data: d(data) }
      set((s) => ({ nodes: [...s.nodes, node] }))
      return
    }
    // Any URL → link node
    const isUrl = /^https?:\/\//i.test(text) || /^www\./i.test(text)
    if (isUrl) {
      const id = `link-${Date.now()}`
      const linkData: LinkNodeData = { id, title: text.replace(/^https?:\/\/(www\.)?/, '').split('/')[0], url: text }
      const node: Node = { id, type: 'link', position: pos, data: d(linkData) }
      set((s) => ({ nodes: [...s.nodes, node] }))
      return
    }
    // Plain text → sticky note
    const colors = ['yellow', 'pink', 'blue', 'green', 'purple'] as const
    const note = {
      id: `note-${Date.now()}`,
      workspaceId: 'ws-1',
      authorId: 'user-1',
      authorName: 'You',
      content: text,
      color: colors[Math.floor(Math.random() * colors.length)],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const node: Node = { id: note.id, type: 'stickyNote', position: pos, data: d(note) }
    set((s) => ({ nodes: [...s.nodes, node] }))
  },

  // ── Rectangle ─────────────────────────────────────────────────
  isRectangleEditorOpen: false,
  selectedRectangle: null,
  openRectangleEditor: (data) => set({ selectedRectangle: data, isRectangleEditorOpen: true }),
  closeRectangleEditor: () => set({ isRectangleEditorOpen: false, selectedRectangle: null }),
  saveRectangleNode: (data) => set((s) => ({
    nodes: s.nodes.map((n) => n.id === data.id ? { ...n, data: d(data) } : n),
    isRectangleEditorOpen: false,
    selectedRectangle: null,
  })),
  deleteRectangleNode: (id) => set((s) => ({
    nodes: s.nodes.filter((n) => n.id !== id),
    edges: s.edges.filter((e) => e.source !== id && e.target !== id),
    isRectangleEditorOpen: false,
    selectedRectangle: null,
  })),
  addRectangleNode: () => {
    const pos = { x: 200 + Math.random() * 300, y: 150 + Math.random() * 200 }
    get().addRectangleNodeAt(pos)
  },
  addRectangleNodeAt: (pos) => {
    const id = `rect-${Date.now()}`
    const data: RectangleNodeData = { id, label: '', color: '#4f46e5' }
    const node: Node = { id, type: 'rectangle', position: pos, style: { width: 200, height: 120 }, data: d(data) }
    set((s) => ({ nodes: [...s.nodes, node] }))
    get().openRectangleEditor(data)
  },

  // ── Link ──────────────────────────────────────────────────────
  isLinkEditorOpen: false,
  selectedLink: null,
  openLinkEditor: (data) => set({ selectedLink: data, isLinkEditorOpen: true }),
  closeLinkEditor: () => set({ isLinkEditorOpen: false, selectedLink: null }),
  saveLinkNode: (data) => set((s) => ({
    nodes: s.nodes.map((n) => n.id === data.id ? { ...n, data: d(data) } : n),
    isLinkEditorOpen: false,
    selectedLink: null,
  })),
  deleteLinkNode: (id) => set((s) => ({
    nodes: s.nodes.filter((n) => n.id !== id),
    edges: s.edges.filter((e) => e.source !== id && e.target !== id),
    isLinkEditorOpen: false,
    selectedLink: null,
  })),
  addLinkNode: () => {
    const pos = { x: 200 + Math.random() * 300, y: 150 + Math.random() * 200 }
    get().addLinkNodeAt(pos)
  },
  addLinkNodeAt: (pos) => {
    const id = `link-${Date.now()}`
    const data: LinkNodeData = { id, title: 'New Link', url: '' }
    const node: Node = { id, type: 'link', position: pos, data: d(data) }
    set((s) => ({ nodes: [...s.nodes, node] }))
    get().openLinkEditor(data)
  },

  // ── Embed ─────────────────────────────────────────────────────
  isEmbedEditorOpen: false,
  selectedEmbed: null,
  openEmbedEditor: (data) => set({ selectedEmbed: data, isEmbedEditorOpen: true }),
  closeEmbedEditor: () => set({ isEmbedEditorOpen: false, selectedEmbed: null }),
  saveEmbedNode: (data) => set((s) => ({
    nodes: s.nodes.map((n) => n.id === data.id ? { ...n, data: d(data) } : n),
    isEmbedEditorOpen: false,
    selectedEmbed: null,
  })),
  deleteEmbedNode: (id) => set((s) => ({
    nodes: s.nodes.filter((n) => n.id !== id),
    edges: s.edges.filter((e) => e.source !== id && e.target !== id),
    isEmbedEditorOpen: false,
    selectedEmbed: null,
  })),
  addEmbedNode: () => {
    const pos = { x: 200 + Math.random() * 300, y: 100 + Math.random() * 200 }
    get().addEmbedNodeAt(pos)
  },
  addEmbedNodeAt: (pos) => {
    const id = `embed-${Date.now()}`
    const data: EmbedNodeData = { id, url: '', embedUrl: '', title: 'Embed', platform: 'unknown' }
    const node: Node = { id, type: 'embed', position: pos, style: { width: 320, height: 460 }, data: d(data) }
    set((s) => ({ nodes: [...s.nodes, node] }))
    get().openEmbedEditor(data)
  },

  // ── Free Arrow ────────────────────────────────────────────────
  addFreeArrow: () => {
    const pos = { x: 300 + Math.random() * 200, y: 200 + Math.random() * 200 }
    get().addFreeArrowAt(pos)
  },
  addFreeArrowAt: (pos) => {
    const ts = Date.now()
    const startId = `arrow-start-${ts}`
    const endId   = `arrow-end-${ts}`
    const edgeId  = `arrow-edge-${ts}`
    const startData: ArrowAnchorNodeData = { id: startId, role: 'start' }
    const endData:   ArrowAnchorNodeData = { id: endId,   role: 'end' }
    const startNode: Node = { id: startId, type: 'arrowAnchor', position: pos,                              data: d(startData) }
    const endNode:   Node = { id: endId,   type: 'arrowAnchor', position: { x: pos.x + 160, y: pos.y },     data: d(endData) }
    const edge: Edge = {
      id: edgeId,
      source: startId,
      sourceHandle: 'arrow-source',
      target: endId,
      targetHandle: 'arrow-target',
      type: get().edgeType,
      style: { stroke: '#94a3b8', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
    }
    set((s) => ({ nodes: [...s.nodes, startNode, endNode], edges: [...s.edges, edge] }))
  },
}))
