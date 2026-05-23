import type { PlatformConnector } from '../_base/types'

export const pinterestConnector: PlatformConnector = {
  id: 'pinterest',
  name: 'Pinterest',
  color: '#E60023',
  bgColor: '#fee2e2',
  textColor: '#991b1b',
  isStub: true,
  isEnabled: true,
  supportedMediaTypes: ['image', 'video'],
  characterLimit: 500,
  requiresApiSetup: true,
  apiSetupUrl: 'https://developers.pinterest.com/',

  async connect(_userId) {
    throw new Error('Pinterest not connected yet. Go to Settings → Platforms to connect.')
  },
  async disconnect(_userId) {
    throw new Error('Not implemented')
  },
  async publishPost(_post, _accountId) {
    return { success: false, error: 'Pinterest not connected yet.' }
  },
  async getConnectedAccounts(_userId) {
    return []
  },
}
