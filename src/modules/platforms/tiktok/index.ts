import type { PlatformConnector } from '../_base/types'

export const tiktokConnector: PlatformConnector = {
  id: 'tiktok',
  name: 'TikTok',
  color: '#010101',
  bgColor: '#f3f4f6',
  textColor: '#111827',
  isStub: true,
  isEnabled: true,
  supportedMediaTypes: ['video'],
  characterLimit: 2200,
  requiresApiSetup: true,
  apiSetupUrl: 'https://developers.tiktok.com/',

  async connect(_userId) {
    throw new Error('TikTok not connected yet. Go to Settings → Platforms to connect.')
  },
  async disconnect(_userId) {
    throw new Error('Not implemented')
  },
  async publishPost(_post, _accountId) {
    return { success: false, error: 'TikTok not connected yet.' }
  },
  async getConnectedAccounts(_userId) {
    return []
  },
}
