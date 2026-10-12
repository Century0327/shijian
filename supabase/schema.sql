-- 史间玩家账号与进度（在 Supabase SQL Editor 执行一次）
create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  username text unique not null check (username ~ '^[A-Za-z0-9_]{3,32}$'),
  display_name text not null default '穿越者',
  avatar text not null default '佚',
  signature text not null default '',
  password_hash text not null,
  progress jsonb not null default '{}'::jsonb,
  unlocks jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.players enable row level security;
alter table public.players add column if not exists display_name text not null default '穿越者';
alter table public.players add column if not exists avatar text not null default '佚';
alter table public.players add column if not exists signature text not null default '';

create or replace function public.register_player(p_username text, p_password text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare p public.players;
begin
  if length(p_password) < 6 then raise exception '密码至少 6 位'; end if;
  insert into public.players(username, password_hash)
  values (lower(trim(p_username)), extensions.crypt(p_password, extensions.gen_salt('bf')))
  returning * into p;
  return jsonb_build_object('id', p.id, 'username', p.username, 'display_name', p.display_name, 'avatar', p.avatar, 'signature', p.signature, 'progress', p.progress, 'unlocks', p.unlocks);
exception when unique_violation then
  raise exception '用户名已存在';
end $$;

create or replace function public.login_player(p_username text, p_password text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare p public.players;
begin
  select * into p from public.players
  where username = lower(trim(p_username)) and password_hash = extensions.crypt(p_password, password_hash);
  if not found then raise exception '用户名或密码错误'; end if;
  return jsonb_build_object('id', p.id, 'username', p.username, 'display_name', p.display_name, 'avatar', p.avatar, 'signature', p.signature, 'progress', p.progress, 'unlocks', p.unlocks);
end $$;

create or replace function public.update_player_profile(p_id uuid, p_display_name text, p_avatar text, p_signature text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare p public.players;
begin
  update public.players set display_name = coalesce(nullif(trim(p_display_name), ''), '穿越者'), avatar = coalesce(nullif(trim(p_avatar), ''), '佚'), signature = coalesce(trim(p_signature), ''), updated_at = now() where id = p_id returning * into p;
  if not found then raise exception '账号不存在'; end if;
  return jsonb_build_object('id', p.id, 'username', p.username, 'display_name', p.display_name, 'avatar', p.avatar, 'signature', p.signature);
end $$;

create or replace function public.save_player_state(p_id uuid, p_progress jsonb, p_unlocks jsonb)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  update public.players set progress = p_progress, unlocks = p_unlocks, updated_at = now()
  where id = p_id;
  return found;
end $$;

grant execute on function public.register_player(text,text) to anon, authenticated;
grant execute on function public.login_player(text,text) to anon, authenticated;
grant execute on function public.save_player_state(uuid,jsonb,jsonb) to anon, authenticated;
grant execute on function public.update_player_profile(uuid,text,text,text) to anon, authenticated;
notify pgrst, 'reload schema';
