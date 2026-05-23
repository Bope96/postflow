import { PLATFORM_REGISTRY } from '@/modules/platforms/_base/registry'
import { ExternalLink } from 'lucide-react'

export default function PlatformsPage() {
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-100 mb-2">Platforms</h1>
      <p className="text-slate-400 mb-8">
        Connect your social media accounts. Each platform needs a developer app set up first.
      </p>

      <div className="space-y-3">
        {PLATFORM_REGISTRY.map((platform) => (
          <div
            key={platform.id}
            className="rounded-xl p-5 flex items-center gap-4"
            style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: `${platform.color}22`, border: `2px solid ${platform.color}44`, color: platform.color }}
            >
              {platform.name.slice(0, 2)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-slate-100">{platform.name}</p>
                {!platform.isEnabled && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#1e293b', color: '#64748b', border: '1px solid #334155' }}>
                    Disabled
                  </span>
                )}
                {platform.id === 'twitter-x' && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#431407', color: '#fb923c' }}>
                    ~$100/month API
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                {platform.supportedMediaTypes.join(', ')} •{' '}
                {platform.characterLimit ? `${platform.characterLimit.toLocaleString()} char limit` : 'no limit'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ backgroundColor: '#431407', color: '#fdba74' }}>
                Not connected
              </span>
              {platform.apiSetupUrl && (
                <a
                  href={platform.apiSetupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Setup <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl p-5" style={{ backgroundColor: '#1e3a5f', border: '1px solid #1d4ed8' }}>
        <p className="text-sm font-medium text-blue-200 mb-1">How to connect a platform</p>
        <p className="text-sm text-blue-300">
          Click &quot;Setup&quot; next to a platform to create a developer app on their website.
          Once you have API credentials, open <code className="px-1 rounded text-blue-100" style={{ backgroundColor: '#1d4ed8' }}>CLAUDE.md</code> in
          the project folder and follow the &quot;Adding a Platform&quot; guide to wire it up.
        </p>
      </div>
    </div>
  )
}
