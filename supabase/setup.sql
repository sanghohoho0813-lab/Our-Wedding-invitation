-- ─────────────────────────────────────────────────────────────
--  청첩장 Supabase 설정 — SQL Editor 에 통째로 붙여넣고 Run 한 번
--  (여러 번 실행해도 안전합니다)
--
--  만들어지는 것
--    1) cheers       : 축하 메시지 (신랑측/신부측 · 이름 · 메시지)
--    2) snaps        : 하객이 올린 사진 · 영상 목록
--    3) guest-snaps  : 사진 · 영상 파일 보관함 (공개, 파일당 50MB 까지)
--
--  누구나 읽기 · 새로 쓰기만 할 수 있고, 고치기 · 지우기는 안 됩니다.
--  지울 글이나 사진이 있으면 Supabase 화면(Table Editor / Storage)에서 직접 지우세요.
-- ─────────────────────────────────────────────────────────────

-- 1) 축하 메시지 ------------------------------------------------
create table if not exists public.cheers (
  id          bigint generated always as identity primary key,
  side        text not null check (side in ('groom', 'bride')),
  name        text not null check (char_length(name) between 1 and 20),
  message     text not null check (char_length(message) between 1 and 500),
  created_at  timestamptz not null default now()
);

alter table public.cheers enable row level security;
grant select, insert on public.cheers to anon, authenticated;

drop policy if exists "누구나 읽기" on public.cheers;
create policy "누구나 읽기" on public.cheers
  for select to anon, authenticated using (true);

drop policy if exists "누구나 남기기" on public.cheers;
create policy "누구나 남기기" on public.cheers
  for insert to anon, authenticated with check (true);

-- 2) 사진 · 영상 목록 -------------------------------------------
create table if not exists public.snaps (
  id          bigint generated always as identity primary key,
  kind        text not null check (kind in ('photo', 'video')),
  path        text not null check (path ~ '^[0-9]{8}/[a-z0-9-]+\.(jpg|mp4|mov|webm|3gp)$'),
  thumb_path  text check (thumb_path is null or thumb_path ~ '^[0-9]{8}/[a-z0-9-]+\.jpg$'),
  created_at  timestamptz not null default now()
);

alter table public.snaps enable row level security;
grant select, insert on public.snaps to anon, authenticated;

drop policy if exists "누구나 보기" on public.snaps;
create policy "누구나 보기" on public.snaps
  for select to anon, authenticated using (true);

drop policy if exists "누구나 올리기" on public.snaps;
create policy "누구나 올리기" on public.snaps
  for insert to anon, authenticated with check (true);

-- 3) 파일 보관함 -------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'guest-snaps',
  'guest-snaps',
  true,
  52428800, -- 50MB
  array['image/jpeg', 'video/mp4', 'video/quicktime', 'video/webm', 'video/3gpp']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "하객 사진 올리기" on storage.objects;
create policy "하객 사진 올리기" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'guest-snaps');
