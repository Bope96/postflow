# PostFlow — AI Assistant Guide

This file is the single source of truth for any AI model (Claude, Codex, GPT-4, etc.) working on this project. Read it fully before making changes.

---

## What This App Is

**PostFlow** is a social media scheduler for a small team (2–10 people). The main screen is an infinite canvas (like Miro) where posts appear as draggable node cards connected by arrows. Team members can leave sticky notes, embed social media videos inline, draw shapes, and add link cards.

**Owner:** Shehan (shehanbope@gmail.com) — not a software engineer; explain decisions in plain language.

**Current state:** Fully functional with demo/mock data. Supabase auth and persistence are stubbed but not connected.

---

## Tech Stack

| Layer | Tool | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Canvas | React Flow (`@xyflow/react`) | 12.x |
| State | Zustand | 5.x |
| Icons | Lucide React | latest |
| Date utils | date-fns | 4.x |
| Database + Auth | Supabase | 2.x (NOT YET CONNECTED) |

---

## Running the App

```bash
npm install
npm run dev
# Open http://localhost:3000
```

Works immediately with demo data. No database setup required.

---

## Folder Map

```
src/
├── app/
│   ├── (app)/
│   │   ├── canvas/page.tsx           Main canvas screen (ReactFlowProvider lives here)
│   │   └── settings/
│   │       ├── page.tsx              General settings + minimap toggle
│   │       ├── platforms/page.tsx    Platform connection stubs
│   │       └── team/page.tsx         Team management stub
│   ├── layout.tsx                    Root HTML shell (Geist font)
│   └── globals.css                   Dark mode + React Flow overrides
│
├── lib/
│   ├── types.ts                      Shared types: PlatformId, Post, StickyNote, etc.
│   ├── canvas-types.ts               Canvas node data types (MediaNodeData, etc.)
│   ├── embed-utils.ts                URL parser for TikTok/YouTube/Instagram/Facebook embeds
│   ├── supabase/client.ts            Browser Supabase client
│   └── supabase/server.ts            Server Supabase client
│
├── modules/
│   ├── canvas/
│   │   ├── store.ts                  Zustand store — ALL canvas state and actions
│   │   ├── mock-data.ts              Demo nodes and edges shown on first load
│   │   └── components/
│   │       ├── Canvas.tsx            React Flow wrapper, drag/drop, context menu, keyboard shortcuts
│   │       ├── CanvasToolbar.tsx     Toolbar: node buttons + platforms submenu + arrow style picker
│   │       ├── ContextMenu.tsx       Right-click menu (canvas, node, edge)
│   │       ├── nodes/
│   │       │   ├── MediaNode.tsx         Video/image card (amber)
│   │       │   ├── CaptionNode.tsx       Caption text card (indigo)
│   │       │   ├── ScheduleGroupNode.tsx Platform schedule card with account dropdowns (green)
│   │       │   ├── StickyNoteNode.tsx    Pastel sticky note
│   │       │   ├── RectangleNode.tsx     Resizable colored shape (ConnectionMode.Loose)
│   │       │   ├── LinkNode.tsx          URL card with open-link button
│   │       │   ├── ArrowAnchorNode.tsx   Tiny dot — two make a free-floating arrow
│   │       │   └── EmbedNode.tsx         Inline video player (TikTok/YouTube/Instagram/Facebook)
│   │       └── editors/
│   │           ├── MediaEditor.tsx
│   │           ├── CaptionEditor.tsx
│   │           ├── ScheduleGroupEditor.tsx
│   │           ├── RectangleEditor.tsx
│   │           ├── LinkEditor.tsx
│   │           └── EmbedEditor.tsx
│   ├── sticky-notes/
│   │   └── components/NoteEditor.tsx
│   └── platforms/
│       ├── _base/types.ts            PlatformConnector interface
│       ├── _base/registry.ts         PLATFORM_REGISTRY — always import platforms from here
│       ├── _base/mock-accounts.ts    Mock account names per platform (replace with OAuth later)
│       ├── instagram/index.ts
│       ├── facebook/index.ts
│       ├── linkedin/index.ts
│       ├── tiktok/index.ts
│       ├── pinterest/index.ts
│       ├── youtube/index.ts
│       └── twitter-x/index.ts        STUB — isEnabled: false (~$100/month API)
│
└── components/layout/Sidebar.tsx
```

---

## Canvas Node Types

| Type | Color | Purpose |
|---|---|---|
| `media` | Amber | Video or image file with preview |
| `caption` | Indigo | Caption text connected to platform rows via arrows |
| `scheduleGroup` | Green | One or more platform accounts + scheduled datetime |
| `stickyNote` | Pastel | Team note with author name and color |
| `rectangle` | Custom | Resizable colored shape for grouping/labelling areas |
| `link` | Indigo | Clickable URL card |
| `arrowAnchor` | Slate | Free-floating arrow endpoint (pairs: start + end + edge) |
| `embed` | Platform color | Inline video player for TikTok, YouTube, Instagram, Facebook |

## Canvas Interaction Model

- **Left-click drag** on empty canvas = rubber-band select (SelectionMode.Partial)
- **Space + drag** = pan
- **Scroll wheel** = zoom
- **Right-click** = context menu (smart by target: canvas / node / edge)
- **Ctrl+C** = copy selected nodes to internal clipboard
- **Ctrl+V / paste** = smart paste anywhere:
  - Screenshot/image → MediaNode
  - TikTok/YouTube/Instagram/Facebook URL → EmbedNode
  - Any other URL → LinkNode
  - Plain text → StickyNote
  - Copied canvas nodes → paste at position
- **Ctrl+D** = duplicate selected nodes (with internal edges)
- **Delete** = remove selected nodes/edges
- **ConnectionMode.Loose** = any handle can connect to any other handle (needed for RectangleNode)

---

## How to Add a New Platform

1. Create `src/modules/platforms/your-platform/index.ts`
2. Implement `PlatformConnector` from `_base/types.ts` (copy any existing connector)
3. Add your platform's ID to `PlatformId` in `src/lib/types.ts`
4. Add mock accounts to `_base/mock-accounts.ts`
5. Import and add to `PLATFORM_REGISTRY` in `_base/registry.ts`

It will automatically appear in the toolbar Platforms submenu, ScheduleGroupEditor, and settings.

---

## How to Add a New Node Type

1. Add `YourNodeData` interface to `src/lib/canvas-types.ts`
2. Create `src/modules/canvas/components/nodes/YourNode.tsx`
3. Create `src/modules/canvas/components/editors/YourEditor.tsx` (optional)
4. Add store state + actions to `src/modules/canvas/store.ts` (follow existing pattern)
5. Register in `nodeTypes` object in `Canvas.tsx`
6. Add to `handleEditNode` and `handleDeleteNode` dispatchers in `Canvas.tsx`
7. Add toolbar button in `CanvasToolbar.tsx`
8. Mount editor in `src/app/(app)/canvas/page.tsx`

---

## How to Add a New Feature Module

1. Create `src/modules/your-feature/` folder
2. Build components, hooks inside it
3. Add a Zustand store at `store.ts` if it needs global state
4. Import and render in the relevant page under `src/app/(app)/`

---

## Environment Variables

Copy `.env.local.example` → `.env.local`. The app works without any env vars (uses mock data).

| Variable | Required for |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Real data persistence |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Real data persistence |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side Supabase calls |

---

## Database Schema

See `supabase/migrations/001_initial.sql`. Tables: `workspaces`, `workspace_members`, `canvas_items`, `scheduled_posts`, `platform_connections`.

The schema already supports multi-tenancy (workspaces) and team roles (admin/editor/viewer) — ready for SaaS.

---

## Embed Platform Notes

Embeds use each platform's official iframe URL. Parsed in `src/lib/embed-utils.ts`.

| Platform | Works on localhost? | Notes |
|---|---|---|
| YouTube | ✅ Yes | Most reliable |
| YouTube Shorts | ✅ Yes | Same embed URL pattern |
| Facebook video | ✅ Yes | |
| TikTok | ❌ No | Restricts unknown origins. Works on deployed URL. |
| Instagram | ❌ No | Same restriction as TikTok. Works after deploy. |

---

## Deferred Features (Build Next)

**Phase 1 — Make it real:**
- Supabase Auth (login/signup/team invites)
- Supabase persistence (replace mock data)
- Deploy to Vercel

**Phase 2 — Platform connections (one by one):**
- Instagram OAuth (Meta Developer App)
- Facebook OAuth (same Meta app, two-for-one)
- LinkedIn OAuth
- YouTube OAuth (Google Cloud Console)
- TikTok OAuth
- Pinterest OAuth
- Twitter/X (enable when API plan is active)

**Phase 3 — SaaS:**
- Stripe billing (free/pro/team tiers)
- Workspace invites
- Publishing engine (background job via Vercel Cron)
- Calendar view

**Phase 4 — Growth:**
- AI caption generation (OpenAI/Claude API)
- Analytics per post
- Post approval workflow

---

## Conventions

- `'use client'` required for any component using state, effects, or browser APIs
- Canvas-specific types live in `src/lib/canvas-types.ts`, shared app types in `src/lib/types.ts`
- Tailwind CSS only — no CSS modules or styled-components
- Platform connectors must implement `PlatformConnector` from `_base/types.ts`
- Never import platform modules directly in canvas/scheduler — always use the registry
- Node data must be cast via `as unknown as Record<string, unknown>` when stored in React Flow (RF v12 constraint)
- Zustand store uses a helper `d(data)` for this cast — use it consistently
