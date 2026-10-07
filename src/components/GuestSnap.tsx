"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useAudio } from "@/components/AudioProvider";
import { DraftMark } from "@/components/DraftMark";
import { Modal } from "@/components/Modal";
import { PhotoSlot } from "@/components/PhotoSlot";
import { Reveal } from "@/components/Reveal";
import { SectionIcon } from "@/components/SectionIcons";
import { useToast } from "@/components/Toast";
import { wedding } from "@/config/wedding";
import { preparePhoto, snapPath, videoExt, videoThumbnail } from "@/lib/media";
import { lockScroll } from "@/lib/scroll";
import { deleteFiles, publicUrl, rpc, selectRows, supabaseReady, uploadFile } from "@/lib/supabase";

type Snap = {
  id: number;
  kind: "photo" | "video";
  path: string;
  thumb_path: string | null;
  created_at: string;
};

type Progress = { index: number; total: number; ratio: number };

const FIELD =
  "mt-2 w-full rounded-[8px] border border-line bg-white px-4 py-3 text-[length:calc(16px*var(--fs))] text-ink outline-none transition-colors placeholder:text-faint/70 focus:border-accent-soft";

/** 같은 하객이 여러 번 올릴 때 비밀번호를 다시 치지 않게 이 탭에서만 기억한다. */
const PW_KEY = "wedding:snap-pw";

/** 올리다 공간이 찼을 때 Supabase 함수가 돌려주는 이유 */
class StorageFull extends Error {}

/** 크게 보기 — 사진은 화면에 맞춰, 영상은 재생 막대와 함께 */
function SnapViewer({
  snaps,
  index,
  onIndex,
  onClose,
  onDeleted,
}: {
  snaps: Snap[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  onDeleted: (id: number) => void;
}) {
  const snap = snaps[index];
  const { showToast } = useToast();
  /** 지우기 칸 — 올릴 때 정한 비밀번호(또는 관리자 비밀번호)로만 지워진다. */
  const [deleting, setDeleting] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // 다른 사진으로 넘기면 지우기 칸을 닫는다.
  useEffect(() => {
    setDeleting(false);
    setPassword("");
  }, [index]);

  const confirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!snap || busy) return;
    if (!password) return showToast("비밀번호를 입력해 주세요.");
    setBusy(true);
    try {
      const res = await rpc<{ ok: boolean; paths?: string[] }>("delete_snap", {
        p_id: snap.id,
        p_password: password,
      });
      if (!res.ok) return showToast("비밀번호가 맞지 않아요.");
      await deleteFiles(res.paths ?? []);
      showToast("지웠어요.");
      onDeleted(snap.id);
    } catch {
      showToast("잠시 후 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  };
  const { isPlaying, toggle } = useAudio();
  /** 하객 영상의 소리를 켜느라 배경음악을 잠시 멈췄는가 — 닫으면 다시 켠다. */
  const pausedBgm = useRef(false);
  const bgmOn = useRef(isPlaying);
  bgmOn.current = isPlaying;

  useEffect(() => lockScroll(), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && index > 0) onIndex(index - 1);
      if (e.key === "ArrowRight" && index < snaps.length - 1) onIndex(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, snaps.length, onIndex, onClose]);

  // 닫을 때 멈춰 둔 배경음악을 다시 켠다.
  useEffect(
    () => () => {
      if (pausedBgm.current && !bgmOn.current) toggle();
    },
    [toggle],
  );

  /** 영상 소리가 켜진 채 재생되면 배경음악과 겹치지 않게 잠시 멈춘다. */
  const onVideoSound = (video: HTMLVideoElement) => {
    if (!video.paused && !video.muted && bgmOn.current) {
      pausedBgm.current = true;
      toggle();
    }
  };

  if (!snap) return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[96] flex items-center justify-center bg-black/92"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label="하객이 올린 사진 · 영상"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {snap.kind === "photo" ? (
        // eslint-disable-next-line @next/next/no-img-element -- 하객이 올린 외부 파일
        <img
          key={snap.id}
          src={publicUrl(snap.path)}
          alt="하객이 올린 사진"
          className="max-h-full max-w-full select-none object-contain"
          draggable={false}
        />
      ) : (
        <video
          key={snap.id}
          src={publicUrl(snap.path)}
          poster={snap.thumb_path ? publicUrl(snap.thumb_path) : undefined}
          controls
          autoPlay
          muted
          playsInline
          onPlay={(e) => onVideoSound(e.currentTarget)}
          onVolumeChange={(e) => onVideoSound(e.currentTarget)}
          className="max-h-full max-w-full"
        />
      )}

      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="absolute right-3 top-[calc(env(safe-area-inset-top)+10px)] flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white"
      >
        <X size={20} strokeWidth={1.6} aria-hidden="true" />
      </button>

      {index > 0 && (
        <button
          type="button"
          onClick={() => onIndex(index - 1)}
          aria-label="이전"
          className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white"
        >
          <ChevronLeft size={22} strokeWidth={1.6} aria-hidden="true" />
        </button>
      )}
      {index < snaps.length - 1 && (
        <button
          type="button"
          onClick={() => onIndex(index + 1)}
          aria-label="다음"
          className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white"
        >
          <ChevronRight size={22} strokeWidth={1.6} aria-hidden="true" />
        </button>
      )}

      <button
        type="button"
        onClick={() => setDeleting((v) => !v)}
        aria-expanded={deleting}
        className="absolute left-3 top-[calc(env(safe-area-inset-top)+10px)] flex h-11 items-center gap-1.5 rounded-full bg-white/15 px-4 text-[length:calc(13px*var(--fs))] text-white"
      >
        <Trash2 size={15} strokeWidth={1.6} aria-hidden="true" />
        삭제
      </button>

      {deleting ? (
        <form
          onSubmit={confirmDelete}
          className="absolute inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+12px)] mx-auto max-w-[420px] rounded-[12px] bg-white p-4"
        >
          <label htmlFor="snap-delete-pw" className="text-[length:calc(13px*var(--fs))] text-muted">
            올릴 때 정한 비밀번호
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="snap-delete-pw"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              maxLength={30}
              className="min-w-0 flex-1 rounded-[8px] border border-line px-3 py-2.5 text-[length:calc(16px*var(--fs))] text-ink outline-none focus:border-accent-soft"
            />
            <button
              type="submit"
              disabled={busy}
              className="shrink-0 rounded-[8px] bg-ink px-4 text-[length:calc(14px*var(--fs))] text-white disabled:opacity-60"
            >
              {busy ? "확인 중…" : "지우기"}
            </button>
          </div>
        </form>
      ) : (
        <p className="absolute bottom-[calc(env(safe-area-inset-bottom)+14px)] text-[length:calc(12.5px*var(--fs))] tracking-[0.06em] text-white/70">
          {index + 1} / {snaps.length}
        </p>
      )}
    </motion.div>,
    document.body,
  );
}

/**
 * 하객 참여형 게스트스냅.
 *
 * 하객이 올린 사진 · 영상은 Supabase 보관함(guest-snaps)에 저장되고
 * 이 섹션 아래에 모여 누구나 함께 본다. (lib/supabase.ts, supabase/setup.sql)
 */
export function GuestSnap({ variant = "default" }: { variant?: "default" | "dev" }) {
  const { guestSnap } = wedding;
  /** 개발자 버전(/dev)에서는 같은 데이터를 터미널 모양으로 보여준다. */
  const dev = variant === "dev";
  const { showToast } = useToast();
  const ready = supabaseReady();

  const inputRef = useRef<HTMLInputElement>(null);
  const [snaps, setSnaps] = useState<Snap[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [viewIndex, setViewIndex] = useState<number | null>(null);
  /** 올리기 전에 지우기용 비밀번호를 정하는 창 */
  const [askOpen, setAskOpen] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    try {
      setPassword(sessionStorage.getItem(PW_KEY) ?? "");
    } catch {}
  }, []);

  const reload = useCallback(async () => {
    try {
      setSnaps(
        await selectRows<Snap>(
          "snaps",
          "select=id,kind,path,thumb_path,created_at&order=created_at.desc&limit=1000",
        ),
      );
    } catch {
      // 목록을 못 불러와도 올리기는 할 수 있게 둔다.
    }
  }, []);

  useEffect(() => {
    if (guestSnap.enabled && ready) void reload();
  }, [guestSnap.enabled, ready, reload]);

  const closeViewer = useCallback(() => setViewIndex(null), []);

  if (!guestSnap.enabled) return null;

  const visible = showAll ? snaps : snaps.slice(0, guestSnap.pageSize);
  const uploading = progress !== null;

  /** 비밀번호를 정한 뒤 사진 · 영상 고르기를 연다. (이 탭이 사용자 동작이라 파일 창이 열린다) */
  const pickFiles = () => {
    if (password.length < 4) return showToast("비밀번호를 4자 이상 정해 주세요.");
    try {
      sessionStorage.setItem(PW_KEY, password);
    } catch {}
    setAskOpen(false);
    inputRef.current?.click();
  };

  /** 고른 파일을 하나씩 올린다. 실패한 것만 건너뛰고 나머지는 계속 올린다. */
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    const limit = guestSnap.maxTotalMb * 1024 * 1024;
    let ok = 0;
    let skipped = 0;
    let full = false;

    // 지금까지 쓴 공간 — 한도를 넘길 파일은 올리기 전에 멈춘다. (무료 요금제 보호)
    let used = 0;
    try {
      used = await rpc<number>("snap_space", {});
    } catch {}

    for (const [i, file] of list.entries()) {
      setProgress({ index: i + 1, total: list.length, ratio: 0 });
      const onProgress = (ratio: number) => setProgress({ index: i + 1, total: list.length, ratio });

      try {
        if (file.type.startsWith("video/") || /\.(mov|mp4|m4v|webm|3gp)$/i.test(file.name)) {
          if (file.size > guestSnap.maxVideoMb * 1024 * 1024) {
            skipped += 1;
            showToast(`영상은 ${guestSnap.maxVideoMb}MB 까지 올릴 수 있어요.`);
            continue;
          }
          const thumb = await videoThumbnail(file);
          const size = file.size + (thumb?.size ?? 0);
          if (used + size > limit) throw new StorageFull();

          const path = snapPath(videoExt(file));
          await uploadFile(path, new Blob([file], { type: file.type || "video/mp4" }), onProgress);
          let thumbPath: string | null = null;
          if (thumb) {
            thumbPath = snapPath("jpg", "-thumb");
            await uploadFile(thumbPath, thumb).catch(() => (thumbPath = null));
          }
          await addSnap("video", path, thumbPath, size);
          used += size;
        } else {
          const photo = await preparePhoto(file);
          if (!photo) {
            skipped += 1;
            showToast("열 수 없는 사진 형식이 있어 건너뛰었어요.");
            continue;
          }
          const size = photo.full.size + photo.thumb.size;
          if (used + size > limit) throw new StorageFull();

          const path = snapPath("jpg");
          const thumbPath = snapPath("jpg", "-thumb");
          await uploadFile(path, photo.full, onProgress);
          await uploadFile(thumbPath, photo.thumb);
          await addSnap("photo", path, thumbPath, size);
          used += size;
        }
        ok += 1;
      } catch (err) {
        if (err instanceof StorageFull) {
          full = true;
          skipped += list.length - i;
          break;
        }
        skipped += 1;
      }
    }

    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
    await reload();

    if (full) showToast("사진 · 영상을 담을 공간이 가득 찼어요. 고맙습니다!");
    else if (ok > 0 && skipped === 0) showToast(`${ok}개를 올렸어요. 고맙습니다!`);
    else if (ok > 0) showToast(`${ok}개를 올렸고 ${skipped}개는 올리지 못했어요.`);
    else showToast("올리지 못했어요. 잠시 후 다시 시도해 주세요.");
  };

  /** 목록에 등록 — 비밀번호는 Supabase 안에서 암호화되어 저장된다. */
  const addSnap = async (kind: Snap["kind"], path: string, thumbPath: string | null, size: number) => {
    try {
      await rpc<number>("add_snap", {
        p_kind: kind,
        p_path: path,
        p_thumb_path: thumbPath,
        p_size: size,
        p_password: password,
      });
    } catch (err) {
      if (err instanceof Error && err.message.includes("storage_full")) throw new StorageFull();
      throw err;
    }
  };

  /** 올리기 버튼 · 진행 막대 — 기본 / 개발자 버전이 함께 쓴다. */
  const uploadControl = ready ? (
            <>
              <input
                ref={inputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={(e) => void handleFiles(e.target.files)}
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => setAskOpen(true)}
                className={
                  dev
                    ? "w-full rounded-[6px] border border-dev-green/60 bg-dev-green/10 px-4 py-3 text-left text-[length:calc(14px*var(--fs))] text-dev-green active:bg-dev-green/20 disabled:opacity-70"
                    : "btn-solid glow-hint mt-7 w-full active:btn-solid-active disabled:opacity-70"
                }
              >
                {uploading
                  ? dev
                    ? `> uploading ${progress.index}/${progress.total} … ${Math.round(progress.ratio * 100)}%`
                    : `올리는 중… ${progress.index} / ${progress.total}`
                  : dev
                    ? `> git push origin photos  # ${guestSnap.buttonLabel}`
                    : guestSnap.buttonLabel}
              </button>
              {uploading && (
                <div
                  className={`mt-3 h-1.5 w-full overflow-hidden rounded-full ${dev ? "bg-dev-line" : "bg-paper-deep"}`}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress.ratio * 100)}
                >
                  <div
                    className={`h-full rounded-full transition-[width] duration-200 ${dev ? "bg-dev-green" : "bg-accent-soft"}`}
                    style={{ width: `${Math.round(progress.ratio * 100)}%` }}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              {/* 아직 열리지 않은 기능이므로 눌리는 버튼처럼 보이게 하지 않는다. */}
              <p
                aria-disabled="true"
                className="mt-7 w-full rounded-[8px] border border-dashed border-line py-4 text-[length:calc(14.5px*var(--fs))] tracking-[-0.01em] text-faint"
              >
                {guestSnap.buttonLabel}
              </p>
              <p className="mt-3 text-[length:calc(12.5px*var(--fs))] tracking-[-0.01em] text-accent">
                {guestSnap.pendingLabel}
              </p>
            </>
          );

  return (
    <section
      className={dev ? "" : "edge band pb-24"}
      aria-labelledby={dev ? undefined : "guestsnap-heading"}
      aria-label={dev ? guestSnap.heading : undefined}
    >
      {dev ? (
        <Reveal>{uploadControl}</Reveal>
      ) : (
        <>
          <Reveal className="text-center">
            <SectionIcon name="camera" />
            <h2 id="guestsnap-heading" className="section-title">
              {guestSnap.heading}
            </h2>
            <p className="mt-4 text-[length:calc(14.5px*var(--fs))] leading-relaxed tracking-[-0.01em] text-muted">
              {guestSnap.subheading}
            </p>
          </Reveal>

          <Reveal delay={0.06} className="mt-8">
            <PhotoSlot src={guestSnap.image} alt={guestSnap.imageAlt} ratio="4 / 3" />
          </Reveal>

          <Reveal delay={0.08}>
            <div className="card mt-6 px-6 py-8 text-center">
              {guestSnap.notes.map((line, i) =>
                line === "" ? (
                  <div key={i} className="h-4" aria-hidden="true" />
                ) : (
                  <p key={i} className="text-[length:calc(14px*var(--fs))] leading-[1.85] tracking-[-0.01em] text-[#4a473f]">
                    {line}
                  </p>
                ),
              )}

              {guestSnap.reward.enabled && guestSnap.reward.text && (
                <div className="mt-7 border-t border-line pt-7">
                  <p className="text-[length:calc(14px*var(--fs))] leading-[1.85] tracking-[-0.01em] text-accent">
                    {guestSnap.reward.text}
                  </p>
                  {guestSnap.reward.draft && (
                    <DraftMark status={guestSnap.reward.draft} className="mt-2.5" />
                  )}
                </div>
              )}

              {uploadControl}
            </div>
          </Reveal>
        </>
      )}

      {snaps.length > 0 && (
        <div className="mt-8">
          <p
            className={
              dev
                ? "text-[length:calc(13px*var(--fs))] text-dev-faint"
                : "text-center text-[length:calc(13px*var(--fs))] tracking-[0.04em] text-accent"
            }
          >
            {dev ? `total ${snaps.length}  # 함께 남긴 순간들` : `함께 남긴 순간들 · ${snaps.length}`}
          </p>
          <ul className="mt-4 grid grid-cols-3 gap-1.5">
            {visible.map((snap, i) => (
              <li key={snap.id}>
                <button
                  type="button"
                  onClick={() => setViewIndex(i)}
                  aria-label={snap.kind === "video" ? "하객이 올린 영상 보기" : "하객이 올린 사진 크게 보기"}
                  className="relative block aspect-square w-full overflow-hidden rounded-[3px] bg-paper-deep"
                >
                  {(snap.thumb_path || snap.kind === "photo") && (
                    // eslint-disable-next-line @next/next/no-img-element -- 하객이 올린 외부 파일
                    <img
                      src={publicUrl(snap.thumb_path ?? snap.path)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  {snap.kind === "video" && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/15">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/85">
                        <Play size={15} strokeWidth={1.8} className="ml-0.5 text-ink" aria-hidden="true" />
                      </span>
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          {snaps.length > guestSnap.pageSize && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                aria-expanded={showAll}
                className={
                  dev
                    ? "tap px-3 text-[length:calc(13px*var(--fs))] text-dev-cyan underline underline-offset-4"
                    : "btn-outline active:bg-paper-deep"
                }
              >
                {showAll
                  ? dev
                    ? "--collapse"
                    : "접기"
                  : dev
                    ? `--more (${snaps.length - guestSnap.pageSize})`
                    : `더보기 (${snaps.length - guestSnap.pageSize})`}
              </button>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {viewIndex !== null && (
          <SnapViewer
            key="viewer"
            snaps={visible}
            index={viewIndex}
            onIndex={setViewIndex}
            onClose={closeViewer}
            onDeleted={(id) => {
              setSnaps((prev) => prev.filter((x) => x.id !== id));
              setViewIndex(null);
            }}
          />
        )}
      </AnimatePresence>

      <Modal open={askOpen} onClose={() => setAskOpen(false)} title={guestSnap.buttonLabel}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            pickFiles();
          }}
          className="space-y-6"
        >
          <div>
            <label htmlFor="snap-password" className="text-[length:calc(13.5px*var(--fs))] text-muted">
              비밀번호 <span className="text-faint">(내가 올린 것을 지울 때 필요해요)</span>
            </label>
            <input
              id="snap-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              maxLength={30}
              placeholder="4자 이상"
              className={FIELD}
            />
          </div>
          <button type="submit" className="btn-solid w-full">
            사진 · 영상 고르기
          </button>
        </form>
      </Modal>
    </section>
  );
}
