import type { MediaType, PlatformId, Post } from '@/lib/types'

export interface ConnectedAccount {
  id: string
  platformId: PlatformId
  accountName: string
  accountHandle: string
  avatarUrl?: string
}

export interface PublishResult {
  success: boolean
  platformPostId?: string
  url?: string
  error?: string
}

export interface PlatformMeta {
  id: PlatformId
  name: string
  color: string
  bgColor: string
  textColor: string
  isStub: boolean
  isEnabled: boolean
  supportedMediaTypes: MediaType[]
  characterLimit?: number
  requiresApiSetup: boolean
  apiSetupUrl?: string
}

export interface PlatformConnector extends PlatformMeta {
  connect(userId: string): Promise<void>
  disconnect(userId: string): Promise<void>
  publishPost(post: Post, accountId: string): Promise<PublishResult>
  getConnectedAccounts(userId: string): Promise<ConnectedAccount[]>
}
