'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutGrid,
  Settings,
  Share2,
  Users,
  ChevronRight,
} from 'lucide-react'

const NAV = [
  { href: '/canvas', label: 'Canvas', icon: LayoutGrid },
  { href: '/settings/platforms', label: 'Platforms', icon: Share2 },
  { href: '/settings/team', label: 'Team', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col h-full"
      style={{ backgroundColor: '#0f172a' }}>

      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
          <LayoutGrid size={14} color="white" />
        </div>
        <span className="text-white font-bold text-base tracking-tight">PostFlow</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/canvas' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                active
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon size={16} />
                {label}
              </div>
              {active && <ChevronRight size={14} className="opacity-60" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
            S
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">Shehan</p>
            <p className="text-slate-500 text-xs truncate">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
