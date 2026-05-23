export type PlatformId =
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'tiktok'
  | 'pinterest'
  | 'youtube'
  | 'twitter-x'

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed'

export type MediaType = 'image' | 'video' | 'text' | 'reel' | 'short' | 'story'

export type StickyNoteColor = 'yellow' | 'pink' | 'blue' | 'green' | 'purple'

export type UserRole = 'admin' | 'editor' | 'viewer'

export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
}

export interface Post {
  id: string
  workspaceId: string
  authorId: string
  authorName: string
  content: string
  mediaUrls: string[]
  status: PostStatus
  platforms: PlatformId[]
  scheduledAt?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface StickyNote {
  id: string
  workspaceId: string
  authorId: string
  authorName: string
  content: string
  color: StickyNoteColor
  createdAt: string
  updatedAt: string
}

export interface CanvasPosition {
  x: number
  y: number
}

export interface WorkspaceMember {
  userId: string
  role: UserRole
  user: User
}

export interface Workspace {
  id: string
  name: string
  ownerId: string
}
