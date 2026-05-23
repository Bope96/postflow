export default function TeamPage() {
  const members = [
    { name: 'Shehan', email: 'shehanbope@gmail.com', role: 'Admin', initials: 'S' },
  ]

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-100 mb-2">Team</h1>
      <p className="text-slate-400 mb-8">Manage who has access to your PostFlow workspace.</p>

      <div className="rounded-xl overflow-hidden mb-6" style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #334155' }}>
          <p className="text-sm font-medium text-slate-300">Members</p>
          <span className="text-xs text-slate-500">{members.length} member</span>
        </div>
        {members.map((m) => (
          <div key={m.email} className="px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
              {m.initials}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-100">{m.name}</p>
              <p className="text-xs text-slate-500">{m.email}</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: '#312e81', color: '#a5b4fc' }}>
              {m.role}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-5" style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
        <h2 className="font-semibold text-slate-100 mb-1">Invite team member</h2>
        <p className="text-sm text-slate-500 mb-4">
          Team invites require Supabase to be connected. See Settings for setup instructions.
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="colleague@email.com"
            disabled
            className="flex-1 rounded-lg px-4 py-2 text-sm text-slate-500 cursor-not-allowed"
            style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
          />
          <button
            disabled
            className="px-4 py-2 text-sm font-medium rounded-lg cursor-not-allowed text-slate-600"
            style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
          >
            Invite
          </button>
        </div>
        <p className="text-xs text-amber-500 mt-2">Connect Supabase in Settings to enable team invites.</p>
      </div>
    </div>
  )
}
