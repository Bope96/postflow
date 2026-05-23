'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  BackgroundVariant,
  SelectionMode,
  ConnectionMode,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type NodeMouseHandler,
  type Edge,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useCanvasStore } from '../store'
import { MediaNode } from './nodes/MediaNode'
import { CaptionNode } from './nodes/CaptionNode'
import { ScheduleGroupNode } from './nodes/ScheduleGroupNode'
import { StickyNoteNode } from './nodes/StickyNoteNode'
import { RectangleNode } from './nodes/RectangleNode'
import { LinkNode } from './nodes/LinkNode'
import { ArrowAnchorNode } from './nodes/ArrowAnchorNode'
import { EmbedNode } from './nodes/EmbedNode'
import { CanvasToolbar } from './CanvasToolbar'
import { ContextMenu, type ContextMenuState } from './ContextMenu'
import type { MediaNodeData, CaptionNodeData, ScheduleGroupNodeData, RectangleNodeData, LinkNodeData, EmbedNodeData } from '@/lib/canvas-types'
import type { StickyNote } from '@/lib/types'

const nodeTypes = {
  media: MediaNode,
  caption: CaptionNode,
  scheduleGroup: ScheduleGroupNode,
  stickyNote: StickyNoteNode,
  rectangle: RectangleNode,
  link: LinkNode,
  arrowAnchor: ArrowAnchorNode,
  embed: EmbedNode,
}

function CanvasInner() {
  const { screenToFlowPosition } = useReactFlow()
  const nodes = useCanvasStore((s) => s.nodes)
  const edges = useCanvasStore((s) => s.edges)
  const onNodesChange = useCanvasStore((s) => s.onNodesChange) as OnNodesChange
  const onEdgesChange = useCanvasStore((s) => s.onEdgesChange) as OnEdgesChange
  const onConnect = useCanvasStore((s) => s.onConnect) as OnConnect
  const addMediaNodeFromFile = useCanvasStore((s) => s.addMediaNodeFromFile)
  const addPlatformNodeAt = useCanvasStore((s) => s.addPlatformNodeAt)
  const addRectangleNodeAt = useCanvasStore((s) => s.addRectangleNodeAt)
  const addLinkNodeAt = useCanvasStore((s) => s.addLinkNodeAt)
  const addFreeArrowAt = useCanvasStore((s) => s.addFreeArrowAt)
  const addEmbedNodeAt = useCanvasStore((s) => s.addEmbedNodeAt)
  const openRectangleEditor = useCanvasStore((s) => s.openRectangleEditor)
  const openLinkEditor = useCanvasStore((s) => s.openLinkEditor)
  const openEmbedEditor = useCanvasStore((s) => s.openEmbedEditor)
  const deleteRectangleNode = useCanvasStore((s) => s.deleteRectangleNode)
  const deleteLinkNode = useCanvasStore((s) => s.deleteLinkNode)
  const deleteEmbedNode = useCanvasStore((s) => s.deleteEmbedNode)
  const edgeType = useCanvasStore((s) => s.edgeType)
  const showMinimap = useCanvasStore((s) => s.showMinimap)
  const deleteEdge = useCanvasStore((s) => s.deleteEdge)
  const addMediaNodeAt = useCanvasStore((s) => s.addMediaNodeAt)
  const addCaptionNodeAt = useCanvasStore((s) => s.addCaptionNodeAt)
  const addScheduleGroupNodeAt = useCanvasStore((s) => s.addScheduleGroupNodeAt)
  const openMediaEditor = useCanvasStore((s) => s.openMediaEditor)
  const openCaptionEditor = useCanvasStore((s) => s.openCaptionEditor)
  const openScheduleGroupEditor = useCanvasStore((s) => s.openScheduleGroupEditor)
  const openNoteEditor = useCanvasStore((s) => s.openNoteEditor)
  const deleteMediaNode = useCanvasStore((s) => s.deleteMediaNode)
  const deleteCaptionNode = useCanvasStore((s) => s.deleteCaptionNode)
  const deleteScheduleGroupNode = useCanvasStore((s) => s.deleteScheduleGroupNode)
  const deleteNote = useCanvasStore((s) => s.deleteNote)
  const ungroupScheduleNode = useCanvasStore((s) => s.ungroupScheduleNode)
  const groupSelectedNodes = useCanvasStore((s) => s.groupSelectedNodes)
  const duplicateSelectedNodes = useCanvasStore((s) => s.duplicateSelectedNodes)
  const copyNodes = useCanvasStore((s) => s.copyNodes)
  const pasteNodes = useCanvasStore((s) => s.pasteNodes)
  const pasteFromText = useCanvasStore((s) => s.pasteFromText)
  const clipboard = useCanvasStore((s) => s.clipboard)
  const selectedGroupCount = nodes.filter((n) => n.selected && n.type === 'scheduleGroup').length

  // Returns flow-space position at the center of the visible canvas
  const getViewportCenter = useCallback(() => {
    const el = document.querySelector('.react-flow__pane') as HTMLElement | null
    if (!el) return ctxMenuRef.current ?? { x: 300, y: 200 }
    const rect = el.getBoundingClientRect()
    return screenToFlowPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
  }, [screenToFlowPosition])

  // Universal smart paste — handles images, URLs, social media links, plain text
  const smartPaste = useCallback(async (
    clipboardData: DataTransfer | null,
    pos?: { x: number; y: number },
  ) => {
    const target = pos ?? ctxMenuRef.current ?? getViewportCenter()
    const store = useCanvasStore.getState()

    // 1. Internal canvas clipboard (copied nodes) takes priority
    if (!clipboardData && store.clipboard.length > 0) {
      store.pasteNodes(target)
      return
    }

    // 2. Image file from clipboard (e.g. screenshot, Ctrl+V from image editor)
    if (clipboardData) {
      const imageItem = Array.from(clipboardData.items).find((i) => i.type.startsWith('image/'))
      if (imageItem) {
        const file = imageItem.getAsFile()
        if (file) { store.addMediaNodeFromFile(file, target); return }
      }
    }

    // 3. Text content
    const text = clipboardData
      ? clipboardData.getData('text/plain').trim()
      : await navigator.clipboard.readText().then((t) => t.trim()).catch(() => '')

    if (!text) return

    // Internal clipboard might still apply if text path was triggered by keydown
    if (!clipboardData && store.clipboard.length > 0) {
      store.pasteNodes(target)
      return
    }

    store.pasteFromText(text, target)
  }, [getViewportCenter])

  useEffect(() => {
    // Native paste event — fires for Ctrl+V anywhere (catches images too)
    const onPasteEvent = (e: ClipboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      e.preventDefault()
      smartPaste(e.clipboardData, ctxMenuRef.current ?? undefined)
    }

    const onKeydown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault()
        duplicateSelectedNodes()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        const selectedIds = useCanvasStore.getState().nodes.filter((n) => n.selected).map((n) => n.id)
        if (selectedIds.length) copyNodes(selectedIds)
      }
    }

    document.addEventListener('paste', onPasteEvent)
    document.addEventListener('keydown', onKeydown)
    return () => {
      document.removeEventListener('paste', onPasteEvent)
      document.removeEventListener('keydown', onKeydown)
    }
  }, [duplicateSelectedNodes, copyNodes, smartPaste])

  const [ctxMenu, setCtxMenu] = useState<ContextMenuState>(null)
  const ctxMenuRef = useRef<{ x: number; y: number } | null>(null)

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })

    // Node type drag from toolbar
    const nodeType = e.dataTransfer.getData('application/postflow-node')
    if (nodeType === 'rectangle') { addRectangleNodeAt(position); return }
    if (nodeType === 'link')      { addLinkNodeAt(position);      return }
    if (nodeType === 'arrow')     { addFreeArrowAt(position);     return }
    if (nodeType === 'embed')     { addEmbedNodeAt(position);     return }

    // Platform drag from toolbar
    const platformId = e.dataTransfer.getData('application/postflow-platform')
    if (platformId) {
      addPlatformNodeAt(platformId, position)
      return
    }

    // File drag (media)
    const file = e.dataTransfer.files[0]
    if (!file) return
    if (!file.type.startsWith('video') && !file.type.startsWith('image')) return
    addMediaNodeFromFile(file, position)
  }, [screenToFlowPosition, addMediaNodeFromFile, addPlatformNodeAt, addRectangleNodeAt, addLinkNodeAt, addFreeArrowAt, addEmbedNodeAt])

  const onNodeContextMenu: NodeMouseHandler = useCallback((e, node) => {
    e.preventDefault()
    const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY })
    ctxMenuRef.current = pos
    setCtxMenu({ x: e.clientX, y: e.clientY, flowPosition: pos, nodeId: node.id, nodeType: node.type })
  }, [screenToFlowPosition])

  const onEdgeContextMenu = useCallback((e: React.MouseEvent, edge: Edge) => {
    e.preventDefault()
    const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY })
    ctxMenuRef.current = pos
    setCtxMenu({ x: e.clientX, y: e.clientY, edgeId: edge.id })
  }, [screenToFlowPosition])

  const onPaneContextMenu = useCallback((e: React.MouseEvent | MouseEvent) => {
    e.preventDefault()
    const cx = (e as React.MouseEvent).clientX
    const cy = (e as React.MouseEvent).clientY
    const pos = screenToFlowPosition({ x: cx, y: cy })
    ctxMenuRef.current = pos
    setCtxMenu({ x: cx, y: cy, flowPosition: pos })
  }, [screenToFlowPosition])

  const handleEditNode = useCallback((id: string, type: string) => {
    const node = nodes.find((n) => n.id === id)
    if (!node) return
    if (type === 'media') openMediaEditor(node.data as unknown as MediaNodeData)
    else if (type === 'caption') openCaptionEditor(node.data as unknown as CaptionNodeData)
    else if (type === 'scheduleGroup') openScheduleGroupEditor(node.data as unknown as ScheduleGroupNodeData)
    else if (type === 'stickyNote') openNoteEditor(node.data as unknown as StickyNote)
    else if (type === 'rectangle') openRectangleEditor(node.data as unknown as RectangleNodeData)
    else if (type === 'link') openLinkEditor(node.data as unknown as LinkNodeData)
    else if (type === 'embed') openEmbedEditor(node.data as unknown as EmbedNodeData)
  }, [nodes, openMediaEditor, openCaptionEditor, openScheduleGroupEditor, openNoteEditor, openRectangleEditor, openLinkEditor, openEmbedEditor])

  const handleCopyNode = useCallback((id: string) => {
    copyNodes([id])
  }, [copyNodes])

  const handleDuplicateNode = useCallback((id: string) => {
    // Select just this node then duplicate
    const store = useCanvasStore.getState()
    const node = store.nodes.find((n) => n.id === id)
    if (!node) return
    store.copyNodes([id])
    store.pasteNodes({ x: node.position.x + 260, y: node.position.y + 60 })
  }, [])

  const handlePaste = useCallback(() => {
    smartPaste(null, ctxMenuRef.current ?? undefined)
  }, [smartPaste])

  const handleDeleteNode = useCallback((id: string) => {
    const node = nodes.find((n) => n.id === id)
    if (!node) return
    if (node.type === 'media') deleteMediaNode(id)
    else if (node.type === 'caption') deleteCaptionNode(id)
    else if (node.type === 'scheduleGroup') deleteScheduleGroupNode(id)
    else if (node.type === 'stickyNote') deleteNote(id)
    else if (node.type === 'rectangle') deleteRectangleNode(id)
    else if (node.type === 'link') deleteLinkNode(id)
    else if (node.type === 'embed') deleteEmbedNode(id)
    else if (node.type === 'arrowAnchor') useCanvasStore.getState().deleteEdge(
      useCanvasStore.getState().edges.find((e) => e.source === id || e.target === id)?.id ?? ''
    )
  }, [nodes, deleteMediaNode, deleteCaptionNode, deleteScheduleGroupNode, deleteNote, deleteRectangleNode, deleteLinkNode, deleteEmbedNode])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        deleteKeyCode="Delete"
        minZoom={0.15}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        style={{ backgroundColor: '#0f172a' }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
        // Left-click drag = rubber-band selection; pan with Space+drag or scroll wheel
        selectionOnDrag
        selectionMode={SelectionMode.Partial}
        panOnDrag={[1, 2]}
        panActivationKeyCode="Space"
        selectionKeyCode={null}
        connectionMode={ConnectionMode.Loose}
        connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2 }}
        defaultEdgeOptions={{ type: edgeType, style: { stroke: '#6366f1', strokeWidth: 1.5 } }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#1e293b" />
        <Controls position="bottom-right" />
        {showMinimap && (
          <MiniMap
            position="bottom-left"
            nodeColor={(n) => {
              if (n.type === 'media') return '#f59e0b'
              if (n.type === 'caption') return '#6366f1'
              if (n.type === 'scheduleGroup') return '#10b981'
              if (n.type === 'rectangle') return (n.data as Record<string, unknown>).color as string ?? '#4f46e5'
              if (n.type === 'link') return '#6366f1'
              return '#854d0e'
            }}
          />
        )}
        <Panel position="top-left">
          <CanvasToolbar />
        </Panel>
      </ReactFlow>
      <ContextMenu
        menu={ctxMenu}
        onClose={() => setCtxMenu(null)}
        onAddMedia={addMediaNodeAt}
        onAddCaption={addCaptionNodeAt}
        onAddSchedule={addScheduleGroupNodeAt}
        onAddNote={() => openNoteEditor()}
        onEditNode={handleEditNode}
        onDeleteNode={handleDeleteNode}
        onCopyNode={handleCopyNode}
        onDuplicateNode={handleDuplicateNode}
        onPaste={handlePaste}
        hasClipboard={clipboard.length > 0}
        onUngroupSchedule={ungroupScheduleNode}
        onGroupSelected={groupSelectedNodes}
        selectedGroupCount={selectedGroupCount}
        onDeleteEdge={deleteEdge}
      />
    </div>
  )
}

export function Canvas() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#0f172a' }}>
      <CanvasInner />
    </div>
  )
}

