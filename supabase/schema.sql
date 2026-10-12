-- 史间玩家账号与进度（在 Supabase SQL Editor 执行一次）
create extension if not exists pgcrypto;

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  username text unique not null check (username ~ '^[A-Za-z0-9_]{3,32}$'),
  password_hash text not null,
  progress jsonb not null default '{}'::jsonb,
  unlocks jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.players enable row level security;

create or replace function public.register_player(p_username text, p_password text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare p public.players;
begin
  if length(p_password) < 6 then raise exception '密码至少 6 位'; end if;
  insert into public.players(username, password_hash)
  values (lower(trim(p_username)), crypt(p_password, gen_salt('bf')))
  returning * into p;
  return jsonb_build_object('id', p.id, 'username', p.username, 'progress', p.progress, 'unlocks', p.unlocks);
exception when unique_violation then
  raise exception '用户名已存在';
end $$;

create or replace function public.login_player(p_username text, p_password text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare p public.players;
begin
  select * into p from public.players
  where username = lower(trim(p_username)) and password_hash = crypt(p_password, password_hash);
  if not found then raise exception '用户名或密码错误'; end if;
  return jsonb_build_object('id', p.id, 'username', p.username, 'progress', p.progress, 'unlocks', p.unlocks);
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
