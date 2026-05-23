import type { PlatformConnector } from './types'
import { instagramConnector } from '../instagram'
import { facebookConnector } from '../facebook'
import { linkedinConnector } from '../linkedin'
import { tiktokConnector } from '../tiktok'
import { pinterestConnector } from '../pinterest'
import { youtubeConnector } from '../youtube'
import { twitterXConnector } from '../twitter-x'

// Central registry — all platform modules register here.
// To add a new platform: create its folder, implement PlatformConnector, import and add below.
// To disable a platform: set isEnabled: false in its connector, or remove it from this array.
export const PLATFORM_REGISTRY: PlatformConnector[] = [
  instagramConnector,
  facebookConnector,
  linkedinConnector,
  tiktokConnector,
  pinterestConnector,
  youtubeConnector,
  twitterXConnector,
]

export function getPlatform(id: string): PlatformConnector | undefined {
  return PLATFORM_REGISTRY.find((p) => p.id === id)
}

export function getEnabledPlatforms(): PlatformConnector[] {
  return PLATFORM_REGISTRY.filter((p) => p.isEnabled)
}
