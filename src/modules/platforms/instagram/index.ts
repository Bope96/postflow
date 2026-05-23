import type { PlatformConnector } from '../_base/types'

export const instagramConnector: PlatformConnector = {
  id: 'instagram',
  name: 'Instagram',
  color: '#E1306C',
  bgColor: '#fce7f3',
  textColor: '#9d174d',
  isStub: true,
  isEnabled: true,
  supportedMediaTypes: ['image', 'video', 'reel', 'story'],
  characterLimit: 2200,
  requiresApiSetup: true,
  apiSetupUrl: 'https://developers.facebook.com/',

  async connect(_userId) {
    // TODO: Implement Meta OAuth — see CLAUDE.md "Adding a Platform"
    throw new Error('Instagram not connected yet. Go to Settings → Platforms to connect.')
  },
  async disconnect(_userId) {
    throw new Error('Not implemented')
  },
  async publishPost(_post, _accountId) {
    return { success: false, error: 'Instagram not connected yet.' }
  },
  async getConnectedAccounts(_userId) {
    return []
  },
}
