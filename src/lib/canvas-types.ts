// Canvas node data types — the building blocks of the PostFlow canvas

export interface MediaNodeData {
  id: string
  title: string
  mediaType: 'video' | 'image' | 'unknown'
  fileName?: string
  previewUrl?: string  // object URL from uploaded file
}

export interface CaptionNodeData {
  id: string
  label: string   // display label e.g. "Caption", "Caption 2"
  text: string    // the actual caption text
}

export interface ScheduledAccount {
  id: string          // unique handle ID for React Flow connections
  platformId: string
  accountName: string // e.g. "Facebook - Personal Page", "Instagram - @handle"
  status: 'pending' | 'published' | 'failed'
}

export interface ScheduleGroupNodeData {
  id: string
  label: string       // e.g. "Schedule Time 2/2"
  scheduledAt: string // ISO datetime
  accounts: ScheduledAccount[]
}

export interface RectangleNodeData {
  id: string
  label: string
  color: string  // hex fill color
}

export interface LinkNodeData {
  id: string
  title: string
  url: string
}

export interface ArrowAnchorNodeData {
  id: string
  role: 'start' | 'end'
}

export interface EmbedNodeData {
  id: string
  url: string        // original URL pasted by user
  embedUrl: string   // resolved iframe src
  title: string
  platform: 'tiktok' | 'youtube' | 'instagram' | 'facebook' | 'unknown'
}
