# Social Media Scheduler — Implementation Plan

## Context

Shehan wants a web-based social media scheduler for a small team (2–10 people). The core experience is an **infinite canvas** (like Miro) where posts appear as draggable cards and team members can leave sticky notes. Platforms are added one by one as self-contained modules ("building blocks") — removing or adding one never breaks the rest. The app starts with mock data and no real API connections; real platform connectors are plugged in one at a time later.

**Decisions locked in:**
- Web app, run locally first, deploy to Vercel + Supabase later (free tier)
- Individual logins (Supabase Auth)
- Canvas-first UI; calendar view is a future module (saved for later)
- Skip Twitter/X for now (their API costs ~$100/month); build a stub so it's easy to add
- Platforms to build: Instagram, Facebook, LinkedIn, TikTok, Pinterest, YouTube/Shorts + Twitter-X stub

---

## Tech Stack

| Layer | Tool | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | Full-stack React; one codebase for UI + API |
| Language | TypeScript | Catches errors early; AI models work better with typed code |
| Styling | Tailwind CSS + shadcn/ui | Fast, consistent, easy to modify |
| Canvas | React Flow (`@xyflow/react`) | Built for draggable node canvases |
| State | Zustand | Simple global state; no boilerplate |
| Database + Auth | Supabase | Free tier, built-in login, real-time updates |
| Hosting (later) | Vercel (frontend) + Supabase (DB) | Both free tiers cover a small team |

---

## Folder Structure (Building Block Architecture)

Each module is fully self-contained: its own types, components, hooks, and API routes. Deleting a module folder removes the feature cleanly.

```
social-media-scheduler/
├── CLAUDE.md                         ← AI assistant guide (see below)
├── .env.local.example                ← Environment variable template
├── supabase/
│   └── migrations/                   ← Database schema files
└── src/
    ├── app/                          ← Next.js pages + API routes
    │   ├── (auth)/login/page.tsx
    │   ├── (auth)/signup/page.tsx
    │   ├── canvas/page.tsx           ← Main screen
    │   ├── settings/platforms/       ← Connect social accounts
    │   ├── settings/team/            ← Invite / manage team
    │   └── api/                      ← API endpoints
    ├── modules/                      ← BUILDING BLOCKS (add/remove freely)
    │   ├── auth/                     ← Login, session, user profile
    │   ├── canvas/                   ← Infinite canvas engine
    │   ├── posts/                    ← Post creation, editing, drafts
    │   ├── scheduler/                ← Queue, publish timing, status
    │   ├── sticky-notes/             ← Team sticky notes on canvas
    │   ├── team/                     ← Invites, roles (admin/editor/viewer)
    │   └── platforms/
    │       ├── _base/                ← Shared interface ALL platforms implement
    │       ├── instagram/
    │       ├── facebook/
    │       ├── linkedin/
    │       ├── tiktok/
    │       ├── pinterest/
    │       ├── youtube/
    │       └── twitter-x/            ← Stub only (no API wired up yet)
    ├── components/                   ← Shared UI (buttons, modals, etc.)
    └── lib/                          ← Supabase client, utilities, types
```

---

## The Platform Interface (How Building Blocks Work)

Every platform module exports exactly this shape. Adding a new platform = create a folder, implement this interface, register it. Removing = delete the folder and unregister it. Nothing else breaks.

```typescript
// src/modules/platforms/_base/types.ts
interface PlatformConnector {
  id: string                          // e.g. "instagram"
  name: string                        // e.g. "Instagram"
  color: string                       // Brand color for card UI
  icon: ReactNode
  isEnabled: boolean                  // Toggle without deleting
  supportedMediaTypes: MediaType[]    // image | video | text | reel | short
  connect(userId: string): Promise<void>
  disconnect(userId: string): Promise<void>
  publishPost(post: Post): Promise<PublishResult>
  getConnectedAccounts(userId: string): Promise<Account[]>
}
```

A central registry (`platforms/_base/registry.ts`) holds all active connectors. The canvas and scheduler read from this registry — they never import platforms directly.

---

## Database Schema (Supabase)

```sql
users                -- Managed by Supabase Auth
workspaces           -- id, name, owner_id
workspace_members    -- workspace_id, user_id, role (admin|editor|viewer)
canvas_items         -- id, workspace_id, type (post|sticky_note), x, y, width, height, data (jsonb)
posts                -- id, workspace_id, author_id, content, media_urls[], status (draft|scheduled|published|failed), platforms[]
scheduled_posts      -- id, post_id, platform_id, account_id, scheduled_at, published_at, status
platform_connections -- id, user_id, platform_id, account_name, access_token (encrypted), expires_at
```

---

## Build Phases

### Phase 1 — Foundation
- `npx create-next-app` with TypeScript + Tailwind
- Supabase project setup (local dev with `supabase start`)
- Auth module: login, signup, session, protected routes
- Basic layout: sidebar, top nav, user avatar

### Phase 2 — Canvas
- Install React Flow; create infinite canvas page
- `PostNode` — card showing platform icon, caption preview, scheduled time, status badge
- `StickyNoteNode` — colored note with author name, editable text
- Controls: zoom in/out, fit view, add post button, add note button
- Canvas state persisted to Supabase (`canvas_items` table)

### Phase 3 — Post Management
- Post creation drawer (caption, media upload, select platforms, select accounts)
- Post editor (edit draft, change schedule)
- Status flow: Draft → Scheduled → Published / Failed
- Posts show on canvas as nodes at user-defined positions

### Phase 4 — Scheduler
- Scheduling engine: reads `scheduled_posts`, fires at the right time
- In local dev: polling every minute via a Next.js API route
- Status updates back to canvas in real-time (Supabase Realtime)

### Phase 5 — Platform Connectors (one by one)
Each platform follows the same steps:
1. Create developer app on the platform's portal
2. Implement `PlatformConnector` interface in the module folder
3. Add OAuth flow (connect account button → redirect → callback → store token)
4. Wire up `publishPost()`
5. Register in the platform registry

**Recommended order:** Instagram → Facebook (same Meta API, two-for-one) → LinkedIn → YouTube → TikTok → Pinterest → Twitter-X (when ready to pay)

### Phase 6 — Team Features
- Invite team member by email (Supabase invite)
- Roles: Admin (full access), Editor (create/edit posts), Viewer (read-only)
- Assign a post to a team member
- Sticky note attribution (shows who wrote it)

### Phase 7 — Calendar View (deferred)
- Toggle between canvas mode and calendar/week view
- Same posts, two perspectives
- Implement as a separate module; canvas module is untouched

---

## CLAUDE.md Contents (planned)

The CLAUDE.md file in the project root will include:
- **Project overview** — what this app is and who it's for
- **Tech stack** with version numbers
- **Folder map** with one-line descriptions
- **How to add a new platform** — step-by-step with file paths
- **How to add a new module** — the pattern to follow
- **Environment variables** — what each one does
- **Dev commands** — `npm run dev`, `supabase start`, etc.
- **Database schema** — tables and key columns
- **Key conventions** — naming, file structure, coding patterns
- **What NOT to touch** — e.g. `_base/` registry pattern

This means any AI model (Claude, Codex, Gemini, GPT-4) can pick up the project cold and contribute correctly.

---

## Verification Plan

After each phase:
1. `npm run dev` — app loads without errors
2. `npm run build` — TypeScript compiles cleanly
3. Manual test: create a post on canvas, drag it, add sticky note, check Supabase dashboard for saved data
4. Auth test: invite a second user, confirm they see the same canvas

---

## Cost Summary

| Service | Free Tier | Paid (if needed) |
|---|---|---|
| Vercel (hosting) | Free — 100GB bandwidth/month | $20/month Pro |
| Supabase (DB + Auth) | Free — 500MB DB, 50k users | $25/month Pro |
| Social APIs | Free (Meta, LinkedIn, TikTok, Pinterest, YouTube) | Twitter/X ~$100/month |
| **Total to start** | **$0/month** | Scale up later |

---

## Change Log

| Date | Change |
|---|---|
| 2026-05-22 | Initial plan created |
