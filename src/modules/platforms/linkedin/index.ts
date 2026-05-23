import type { PlatformConnector } from '../_base/types'

export const linkedinConnector: PlatformConnector = {
  id: 'linkedin',
  name: 'LinkedIn',
  color: '#0A66C2',
  bgColor: '#dbeafe',
  textColor: '#1e3a8a',
  isStub: true,
  isEnabled: true,
  supportedMediaTypes: ['image', 'video', 'text'],
  characterLimit: 3000,
  requiresApiSetup: true,
  apiSetupUrl: 'https://www.linkedin.com/developers/',

  async connect(_userId) {
    throw new Error('LinkedIn not connected yet. Go to Settings → Platforms to connect.')
  },
  async disconnect(_userId) {
    throw new Error('Not implemented')
  },
  async publishPost(_post, _accountId) {
    return { success: false, error: 'LinkedIn not connected yet.' }
  },
  async getConnectedAccounts(_userId) {
    return []
  },
}
