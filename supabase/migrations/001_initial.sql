-- PostFlow initial schema
-- Run this in Supabase SQL editor or via the Supabase CLI

-- Workspaces
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team membership
CREATE TABLE IF NOT EXISTS workspace_members (
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin', 'editor', 'viewer')) DEFAULT 'editor',
  PRIMARY KEY (workspace_id, user_id)
);

-- Canvas items (posts + sticky notes combined)
CREATE TABLE IF NOT EXISTS canvas_items (
  id TEXT PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('post', 'sticky_note')) NOT NULL,
  x FLOAT NOT NULL DEFAULT 0,
  y FLOAT NOT NULL DEFAULT 0,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scheduled publish queue
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canvas_item_id TEXT REFERENCES canvas_items(id) ON DELETE CASCADE,
  platform_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  published_at TIMESTAMPTZ,
  status TEXT CHECK (status IN ('pending', 'published', 'failed')) DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Connected social accounts (OAuth tokens)
CREATE TABLE IF NOT EXISTS platform_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform_id TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_handle TEXT,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform_id, account_handle)
);

-- Row level security (RLS) — users only see their own workspace data
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvas_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workspace_owner_access" ON workspaces
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "member_access" ON workspace_members
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "canvas_member_access" ON canvas_items
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "own_connections" ON platform_connections
  FOR ALL USING (user_id = auth.uid());
