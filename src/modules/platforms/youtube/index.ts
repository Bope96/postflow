import type { PlatformConnector } from '../_base/types'

export const youtubeConnector: PlatformConnector = {
  id: 'youtube',
  name: 'YouTube',
  color: '#FF0000',
  bgColor: '#fee2e2',
  textColor: '#991b1b',
  isStub: true,
  isEnabled: true,
  supportedMediaTypes: ['video', 'short'],
  characterLimit: 5000,
  requiresApiSetup: true,
  apiSetupUrl: 'https://console.cloud.google.com/',

  async connect(_userId) {
    throw new Error('YouTube not connected yet. Go to Settings → Platforms to connect.')
  },
  async disconnect(_userId) {
    throw new Error('Not implemented')
  },
  async publishPost(_post, _accountId) {
    return { success: false, error: 'YouTube not connected yet.' }
  },
  async getConnectedAccounts(_userId) {
    return []
  },
}
