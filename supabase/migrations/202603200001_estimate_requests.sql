create extension if not exists pgcrypto;

create table if not exists public.estimate_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  service text not null,
  details text not null default '',
  contact_method text not null default 'Phone',
  decision_partner text,
  photo_path text,
  page_url text
);

create table if not exists public.estimate_rate_limits (
  id uuid primary key default gen_random_uuid(),
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists estimate_rate_limits_ip_created_idx
  on public.estimate_rate_limits (ip_hash, created_at desc);

alter table public.estimate_requests enable row level security;
alter table public.estimate_rate_limits enable row level security;

revoke all on public.estimate_requests from anon, authenticated;
revoke all on public.estimate_rate_limits from anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'estimate-photos',
  'estimate-photos',
  false,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;