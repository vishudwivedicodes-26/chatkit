-- Enable pgcrypto for UUIDs and hashing
create extension if not exists pgcrypto;

-- Profiles Table
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null,
  username text unique not null,
  uid text unique not null,
  bio text default '',
  avatar_id text not null,
  public_key text not null,
  online_at timestamptz default now(),
  created_at timestamptz default now(),
  encrypted_private_key text -- Non-plaintext E2E secret
);

-- Friendships Table
create table if not exists friendships (
  id uuid default gen_random_uuid() primary key,
  user1_id uuid references auth.users on delete cascade,
  user2_id uuid references auth.users on delete cascade,
  status text check (status in ('pending', 'accepted', 'rejected')) default 'pending',
  created_at timestamptz default now(),
  unique(user1_id, user2_id)
);

-- Messages Table
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references auth.users on delete cascade,
  receiver_id uuid references auth.users on delete cascade,
  content text not null, -- Ciphertext
  nonce text not null,
  type text default 'text' check (type in ('text', 'image', 'video', 'file', 'voice')),
  metadata jsonb default '{}'::jsonb,
  is_saved boolean default false,
  created_at timestamptz default now(),
  delivered_at timestamptz,
  read_at timestamptz
);

-- Message Reactions
create table if not exists message_reactions (
  id uuid default gen_random_uuid() primary key,
  message_id uuid references messages on delete cascade,
  user_id uuid references auth.users on delete cascade,
  emoji text not null,
  created_at timestamptz default now(),
  unique(message_id, user_id)
);

-- Pinned Messages
create table if not exists pinned_messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  chat_user_id uuid references auth.users on delete cascade,
  message_id uuid references messages on delete cascade,
  created_at timestamptz default now()
);

-- Session Logs (Admin Only)
create table if not exists session_logs (
  id uuid default gen_random_uuid() primary key,
  uid text not null,
  ip_hash text not null,
  user_agent text,
  duration_minutes int default 0,
  pages_visited text[],
  messages_sent_count int default 0,
  session_start timestamptz default now(),
  session_end timestamptz
);

-- RLS (Row Level Security)
alter table profiles enable row level security;
alter table friendships enable row level security;
alter table messages enable row level security;
alter table message_reactions enable row level security;
alter table pinned_messages enable row level security;
alter table session_logs enable row level security;

-- Example Policy: Profiles are viewable by everyone (for search/discovery)
create policy "Public profiles are viewable by everyone" on profiles
  for select using (true);

-- Allow users to insert their own profile
create policy "Users can insert their own profile" on profiles
  for insert with check (auth.uid() = id);

-- Allow users to update their own profile
create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

-- Messages are viewable by sender or receiver
create policy "Messages are viewable by sender or receiver" on messages
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- Allow users to insert their own messages
create policy "Users can insert their own messages" on messages
  for insert with check (auth.uid() = sender_id);

-- Friendships
create policy "Users can view their friendships" on friendships
  for select using (auth.uid() = user1_id or auth.uid() = user2_id);

create policy "Users can create friendships" on friendships
  for insert with check (auth.uid() = user1_id or auth.uid() = user2_id);

create policy "Users can update their own friendships" on friendships
  for update using (auth.uid() = user1_id or auth.uid() = user2_id);

-- Reactions and Pinned Messages
create policy "Users can react to messages" on message_reactions
  for insert with check (auth.uid() = user_id);

create policy "Everyone can view reactions" on message_reactions
  for select using (true);

create policy "Users can manage pinned messages" on pinned_messages
  for all using (auth.uid() = user_id);

-- Cron Job for 15-hour Purge (Run this in Supabase SQL Editor)
-- select cron.schedule('purge-messages', '0 */15 * * *', $$
--   delete from messages where is_saved = false and created_at < now() - interval '15 hours';
-- $$);
