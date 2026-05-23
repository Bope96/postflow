import type { PlatformConnector } from '../_base/types'

export const facebookConnector: PlatformConnector = {
  id: 'facebook',
  name: 'Facebook',
  color: '#1877F2',
  bgColor: '#dbeafe',
  textColor: '#1e3a8a',
  isStub: true,
  isEnabled: true,
  supportedMediaTypes: ['image', 'video', 'text'],
  characterLimit: 63206,
  requiresApiSetup: true,
  apiSetupUrl: 'https://developers.facebook.com/',

  async connect(_userId) {
    throw new Error('Facebook not connected yet. Go to Settings → Platforms to connect.')
  },
  async disconnect(_userId) {
    throw new Error('Not implemented')
  },
  async publishPost(_post, _accountId) {
    return { success: false, error: 'Facebook not connected yet.' }
  },
  async getConnectedAccounts(_userId) {
    return []
  },
}
