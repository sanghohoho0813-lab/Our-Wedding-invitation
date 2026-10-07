-- ─────────────────────────────────────────────────────────────
--  02. 삭제 비밀번호 · 관리자 비밀번호 · 사진 공간 한도
--  setup.sql 을 이미 실행한 뒤에 이 파일을 SQL Editor 에서 Run 하세요.
--  (여러 번 실행해도 안전합니다)
--
--  ★ 실행 전에 맨 아래 '여기에_관리자_비밀번호' 를 두 분만 아는 비밀번호로 바꾸세요.
--
--  바뀌는 것
--    - 축하 메시지 · 사진/영상은 남길 때 정한 비밀번호로만 지울(메시지는 고칠) 수 있다.
--    - 관리자 비밀번호로는 무엇이든 지우고 고칠 수 있다. (신랑 · 신부용)
--    - 비밀번호는 암호화(bcrypt)해서 저장하고, 화면 쪽에서는 절대 읽을 수 없다.
--    - 하객은 표에 직접 쓰거나 지울 수 없고, 아래 함수를 통해서만 할 수 있다.
--      (함수 안에서 비밀번호를 확인하므로 남의 것은 손댈 수 없다)
--    - 사진 · 영상이 900MB 를 넘으면 더 올리지 않는다. (무료 요금제 1GB 한도 보호)
-- ─────────────────────────────────────────────────────────────

create extension if not exists pgcrypto with schema extensions;
create schema if not exists private;

-- 관리자 비밀번호 (한 줄만 저장)
create table if not exists private.admin_secret (
  id    int primary key default 1 check (id = 1),
  hash  text not null
);

-- 지워도 되는 파일 목록 — 비밀번호 확인을 통과한 사진의 파일만 여기 올라간다.
create table if not exists private.snap_trash (
  path        text primary key,
  deleted_at  timestamptz not null default now()
);

-- 표에 비밀번호 칸 · 파일 크기 칸 추가 (이미 남겨진 글/사진은 관리자만 지울 수 있다)
alter table public.cheers add column if not exists password_hash text;
alter table public.snaps  add column if not exists password_hash text;
alter table public.snaps  add column if not exists size_bytes bigint not null default 0;

-- 하객은 비밀번호 칸을 볼 수 없고, 표에 직접 쓰지 못한다.
revoke all on public.cheers from anon, authenticated;
grant select (id, side, name, message, created_at) on public.cheers to anon, authenticated;
drop policy if exists "누구나 남기기" on public.cheers;

revoke all on public.snaps from anon, authenticated;
grant select (id, kind, path, thumb_path, created_at) on public.snaps to anon, authenticated;
drop policy if exists "누구나 올리기" on public.snaps;

-- ── 내부 확인 함수 (하객이 직접 부를 수 없음) ─────────────────
create or replace function private.password_ok(p_hash text, p_password text)
returns boolean language sql stable set search_path = '' as $$
  select p_hash is not null
     and coalesce(p_password, '') <> ''
     and p_hash = extensions.crypt(p_password, p_hash);
$$;

create or replace function private.is_admin(p_password text)
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce(p_password, '') not in ('', '여기에_관리자_비밀번호')
     and exists (
       select 1 from private.admin_secret s
       where s.hash = extensions.crypt(p_password, s.hash)
     );
$$;

create or replace function private.check_new_password(p_password text)
returns void language plpgsql set search_path = '' as $$
begin
  if char_length(coalesce(p_password, '')) not between 4 and 30 then
    raise exception 'password_length';
  end if;
end $$;

-- ── 축하 메시지 ──────────────────────────────────────────────
create or replace function public.add_cheer(p_side text, p_name text, p_message text, p_password text)
returns json language plpgsql security definer set search_path = '' as $$
declare r public.cheers;
begin
  perform private.check_new_password(p_password);
  insert into public.cheers (side, name, message, password_hash)
  values (p_side, trim(p_name), trim(p_message), extensions.crypt(p_password, extensions.gen_salt('bf')))
  returning * into r;
  return json_build_object('id', r.id, 'side', r.side, 'name', r.name,
                           'message', r.message, 'created_at', r.created_at);
end $$;

create or replace function public.update_cheer(p_id bigint, p_message text, p_password text)
returns json language plpgsql security definer set search_path = '' as $$
declare r public.cheers;
begin
  select * into r from public.cheers where id = p_id;
  if not found then return null; end if;
  if not (private.password_ok(r.password_hash, p_password) or private.is_admin(p_password)) then
    return null;
  end if;
  update public.cheers set message = trim(p_message) where id = p_id returning * into r;
  return json_build_object('id', r.id, 'side', r.side, 'name', r.name,
                           'message', r.message, 'created_at', r.created_at);
end $$;

create or replace function public.delete_cheer(p_id bigint, p_password text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare r public.cheers;
begin
  select * into r from public.cheers where id = p_id;
  if not found then return false; end if;
  if not (private.password_ok(r.password_hash, p_password) or private.is_admin(p_password)) then
    return false;
  end if;
  delete from public.cheers where id = p_id;
  return true;
end $$;

-- ── 사진 · 영상 ──────────────────────────────────────────────
-- 지금까지 쓴 공간 (바이트)
create or replace function public.snap_space()
returns bigint language sql stable security definer set search_path = '' as $$
  select coalesce(sum(size_bytes), 0)::bigint from public.snaps;
$$;

create or replace function public.add_snap(
  p_kind text, p_path text, p_thumb_path text, p_size bigint, p_password text
)
returns bigint language plpgsql security definer set search_path = '' as $$
declare new_id bigint;
begin
  perform private.check_new_password(p_password);
  if (select coalesce(sum(size_bytes), 0) from public.snaps) + greatest(p_size, 0) > 900 * 1024 * 1024 then
    raise exception 'storage_full';
  end if;
  insert into public.snaps (kind, path, thumb_path, size_bytes, password_hash)
  values (p_kind, p_path, p_thumb_path, greatest(p_size, 0),
          extensions.crypt(p_password, extensions.gen_salt('bf')))
  returning id into new_id;
  return new_id;
end $$;

create or replace function public.delete_snap(p_id bigint, p_password text)
returns json language plpgsql security definer set search_path = '' as $$
declare r public.snaps;
begin
  select * into r from public.snaps where id = p_id;
  if not found then return json_build_object('ok', false); end if;
  if not (private.password_ok(r.password_hash, p_password) or private.is_admin(p_password)) then
    return json_build_object('ok', false);
  end if;

  delete from public.snaps where id = p_id;
  insert into private.snap_trash (path) values (r.path) on conflict do nothing;
  if r.thumb_path is not null then
    insert into private.snap_trash (path) values (r.thumb_path) on conflict do nothing;
  end if;

  return json_build_object('ok', true, 'paths', to_json(array_remove(array[r.path, r.thumb_path], null)));
end $$;

-- 보관함 규칙에서 쓰는 확인 — 지우기로 확인된 파일인가
create or replace function public.snap_file_deletable(p_name text)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from private.snap_trash t where t.path = p_name);
$$;

-- 하객이 부를 수 있는 함수
grant execute on function public.add_cheer(text, text, text, text)            to anon, authenticated;
grant execute on function public.update_cheer(bigint, text, text)              to anon, authenticated;
grant execute on function public.delete_cheer(bigint, text)                    to anon, authenticated;
grant execute on function public.snap_space()                                  to anon, authenticated;
grant execute on function public.add_snap(text, text, text, bigint, text)      to anon, authenticated;
grant execute on function public.delete_snap(bigint, text)                     to anon, authenticated;
grant execute on function public.snap_file_deletable(text)                     to anon, authenticated;

-- 확인을 통과한 파일만 보관함에서 지울 수 있다.
drop policy if exists "지운 하객 사진 파일 찾기" on storage.objects;
create policy "지운 하객 사진 파일 찾기" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'guest-snaps' and public.snap_file_deletable(name));

drop policy if exists "지운 하객 사진 파일 정리" on storage.objects;
create policy "지운 하객 사진 파일 정리" on storage.objects
  for delete to anon, authenticated
  using (bucket_id = 'guest-snaps' and public.snap_file_deletable(name));

-- ★ 관리자 비밀번호 — '여기에_관리자_비밀번호' 를 바꾼 뒤 실행하세요.
--   (나중에 바꾸고 싶으면 이 줄만 고쳐서 다시 실행하면 됩니다)
insert into private.admin_secret (id, hash)
values (1, extensions.crypt('여기에_관리자_비밀번호', extensions.gen_salt('bf')))
on conflict (id) do update set hash = excluded.hash;

notify pgrst, 'reload schema';
