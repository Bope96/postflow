import type { EmbedNodeData } from './canvas-types'

export type EmbedPlatform = EmbedNodeData['platform']

interface ParsedEmbed {
  platform: EmbedPlatform
  embedUrl: string
  title: string
}

export function parseEmbedUrl(url: string): ParsedEmbed | null {
  const clean = url.trim()

  // TikTok: https://www.tiktok.com/@user/video/1234567890
  //         https://vm.tiktok.com/SHORTCODE/
  const tiktok = clean.match(/tiktok\.com\/@[\w.]+\/video\/(\d+)/)
  if (tiktok) {
    return {
      platform: 'tiktok',
      embedUrl: `https://www.tiktok.com/embed/v2/${tiktok[1]}`,
      title: 'TikTok video',
    }
  }

  // YouTube: https://www.youtube.com/watch?v=ID
  //          https://youtu.be/ID
  //          https://www.youtube.com/shorts/ID
  const yt1 = clean.match(/youtube\.com\/(?:watch\?v=|shorts\/)([\w-]+)/)
  const yt2 = clean.match(/youtu\.be\/([\w-]+)/)
  const ytId = yt1?.[1] ?? yt2?.[1]
  if (ytId) {
    return {
      platform: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=0`,
      title: 'YouTube video',
    }
  }

  // Instagram post / reel: https://www.instagram.com/p/CODE/
  //                         https://www.instagram.com/reel/CODE/
  const ig = clean.match(/instagram\.com\/(?:p|reel)\/([\w-]+)/)
  if (ig) {
    return {
      platform: 'instagram',
      embedUrl: `https://www.instagram.com/p/${ig[1]}/embed/`,
      title: 'Instagram post',
    }
  }

  // Facebook video: https://www.facebook.com/*/videos/ID
  const fb = clean.match(/facebook\.com\/(?:.*\/)?videos\/(\d+)/)
  if (fb) {
    const encoded = encodeURIComponent(clean)
    return {
      platform: 'facebook',
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=false&width=320`,
      title: 'Facebook video',
    }
  }

  return null
}

export const PLATFORM_COLOR: Record<EmbedPlatform, string> = {
  tiktok:    '#010101',
  youtube:   '#FF0000',
  instagram: '#E1306C',
  facebook:  '#1877F2',
  unknown:   '#475569',
}

export const PLATFORM_LABEL: Record<EmbedPlatform, string> = {
  tiktok:    'TikTok',
  youtube:   'YouTube',
  instagram: 'Instagram',
  facebook:  'Facebook',
  unknown:   'Embed',
}
