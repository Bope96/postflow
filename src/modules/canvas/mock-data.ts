import type { Node, Edge } from '@xyflow/react'
import type { MediaNodeData, CaptionNodeData, ScheduleGroupNodeData } from '@/lib/canvas-types'
import type { StickyNote } from '@/lib/types'

// Reproduces the layout from the sketch:
// Caption (left) → platform rows in Schedule Groups (center)
// Media/Video (right) → Schedule Groups (center)

export const MOCK_NODES: Node[] = [
  // ── Captions (left) ──────────────────────────────────────────
  {
    id: 'caption-1',
    type: 'caption',
    position: { x: 60, y: 160 },
    data: {
      id: 'caption-1',
      label: 'Caption',
      text: 'Excited to share something we\'ve been working on for months 🚀 Drop a comment if you want early access!',
    } satisfies CaptionNodeData as unknown as Record<string, unknown>,
  },
  {
    id: 'caption-2',
    type: 'caption',
    position: { x: 60, y: 420 },
    data: {
      id: 'caption-2',
      label: 'Caption 2',
      text: 'Big announcement coming your way. Stay tuned — this one\'s going to change everything.',
    } satisfies CaptionNodeData as unknown as Record<string, unknown>,
  },

  // ── Schedule Groups (center) ──────────────────────────────────
  {
    id: 'sg-1',
    type: 'scheduleGroup',
    position: { x: 380, y: 60 },
    data: {
      id: 'sg-1',
      label: 'Schedule Time 2/2',
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).setHours(9, 0, 0, 0).toString(),
      accounts: [
        { id: 'acc-yt',  platformId: 'youtube',    accountName: 'YouTube Shorts',         status: 'pending' },
        { id: 'acc-ig',  platformId: 'instagram',  accountName: 'Instagram - @myhandle',  status: 'pending' },
        { id: 'acc-fb1', platformId: 'facebook',   accountName: 'Facebook 1',             status: 'pending' },
        { id: 'acc-fb2', platformId: 'facebook',   accountName: 'Facebook 2 (account name)', status: 'pending' },
        { id: 'acc-tk',  platformId: 'tiktok',     accountName: 'TikTok',                 status: 'pending' },
      ],
    } satisfies ScheduleGroupNodeData as unknown as Record<string, unknown>,
  },
  {
    id: 'sg-2',
    type: 'scheduleGroup',
    position: { x: 380, y: 640 },
    data: {
      id: 'sg-2',
      label: 'Schedule Time 2/3',
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).setHours(9, 0, 0, 0).toString(),
      accounts: [
        { id: 'acc-li', platformId: 'linkedin', accountName: 'LinkedIn', status: 'pending' },
      ],
    } satisfies ScheduleGroupNodeData as unknown as Record<string, unknown>,
  },

  // ── Media (right) ─────────────────────────────────────────────
  {
    id: 'media-1',
    type: 'media',
    position: { x: 760, y: 200 },
    data: {
      id: 'media-1',
      title: 'Sample Video',
      mediaType: 'video',
      fileName: 'sample-video.mp4',
    } satisfies MediaNodeData as unknown as Record<string, unknown>,
  },

  // ── Sticky Notes ──────────────────────────────────────────────
  {
    id: 'note-1',
    type: 'stickyNote',
    position: { x: 760, y: 520 },
    data: {
      id: 'note-1',
      workspaceId: 'ws-1',
      authorId: 'user-1',
      authorName: 'Shehan',
      content: 'Need to add captions for LinkedIn separately — more formal tone.',
      color: 'yellow',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as unknown as Record<string, unknown>,
  },
]

export const MOCK_EDGES: Edge[] = [
  // Media → Schedule Group 1 (whole group)
  { id: 'e-m1-sg1', source: 'media-1', target: 'sg-1', targetHandle: 'group-target',
    type: 'smoothstep', style: { stroke: '#f59e0b', strokeWidth: 2 } },
  // Media → Schedule Group 2 (whole group)
  { id: 'e-m1-sg2', source: 'media-1', target: 'sg-2', targetHandle: 'group-target',
    type: 'smoothstep', style: { stroke: '#f59e0b', strokeWidth: 2 } },

  // Caption 1 → YouTube Shorts, Instagram, Facebook 1, Facebook 2
  { id: 'e-c1-yt',  source: 'caption-1', target: 'sg-1', targetHandle: 'acc-yt',
    type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
  { id: 'e-c1-ig',  source: 'caption-1', target: 'sg-1', targetHandle: 'acc-ig',
    type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
  { id: 'e-c1-fb1', source: 'caption-1', target: 'sg-1', targetHandle: 'acc-fb1',
    type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
  { id: 'e-c1-fb2', source: 'caption-1', target: 'sg-1', targetHandle: 'acc-fb2',
    type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 1.5 } },

  // Caption 2 → TikTok, LinkedIn
  { id: 'e-c2-tk', source: 'caption-2', target: 'sg-1', targetHandle: 'acc-tk',
    type: 'smoothstep', style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  { id: 'e-c2-li', source: 'caption-2', target: 'sg-2', targetHandle: 'acc-li',
    type: 'smoothstep', style: { stroke: '#a855f7', strokeWidth: 1.5 } },
]
