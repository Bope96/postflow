import type { PlatformConnector } from '../_base/types'

// STUB — Twitter/X API costs ~$100/month. Enable when ready.
// API setup: https://developer.twitter.com/
export const twitterXConnector: PlatformConnector = {
  id: 'twitter-x',
  name: 'X (Twitter)',
  color: '#000000',
  bgColor: '#f3f4f6',
  textColor: '#111827',
  isStub: true,
  isEnabled: false, // Disabled until API subscription is active
  supportedMediaTypes: ['image', 'video', 'text'],
  characterLimit: 280,
  requiresApiSetup: true,
  apiSetupUrl: 'https://developer.twitter.com/',

  async connect(_userId) {
    throw new Error('X (Twitter) API requires a paid subscription (~$100/month). See Settings → Platforms.')
  },
  async disconnect(_userId) {
    throw new Error('Not implemented')
  },
  async publishPost(_post, _accountId) {
    return { success: false, error: 'X (Twitter) not enabled.' }
  },
  async getConnectedAccounts(_userId) {
    return []
  },
}
