"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useAudio } from "@/components/AudioProvider";
import { DraftMark } from "@/components/DraftMark";
import { PhotoSlot } from "@/components/PhotoSlot";
import { Reveal } from "@/components/Reveal";
import { SectionIcon } from "@/components/SectionIcons";
import { useToast } from "@/components/Toast";
import { wedding } from "@/config/wedding";
import { preparePhoto, snapPath, videoExt, videoThumbnail } from "@/lib/media";
import { lockScroll } from "@/lib/scroll";
import { insertRow, publicUrl, selectRows, supabaseReady, uploadFile } from "@/lib/supabase";

type Snap = {
  id: number;
  kind: "photo" | "video";
  path: string;
  thumb_path: string | null;
  created_at: string;
};

type Progress = { index: number; total: number; ratio: number };

/** 크게 보기 — 사진은 화면에 맞춰, 영상은 재생 막대와 함께 */
function SnapViewer({
  snaps,
  index,
  onIndex,
  onClose,
}: {
  snaps: Snap[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const snap = snaps[index];
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

      <p className="absolute bottom-[calc(env(safe-area-inset-bottom)+14px)] text-[12.5px] tracking-[0.06em] text-white/70">
        {index + 1} / {snaps.length}
      </p>
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
export function GuestSnap() {
  const { guestSnap } = wedding;
  const { showToast } = useToast();
  const ready = supabaseReady();

  const inputRef = useRef<HTMLInputElement>(null);
  const [snaps, setSnaps] = useState<Snap[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [viewIndex, setViewIndex] = useState<number | null>(null);

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

  /** 고른 파일을 하나씩 올린다. 실패한 것만 건너뛰고 나머지는 계속 올린다. */
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    let ok = 0;
    let skipped = 0;

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
          const ext = videoExt(file);
          const mime = file.type || "video/mp4";
          const path = snapPath(ext);
          await uploadFile(path, new Blob([file], { type: mime }), onProgress);

          let thumbPath: string | null = null;
          const thumb = await videoThumbnail(file);
          if (thumb) {
            thumbPath = snapPath("jpg", "-thumb");
            await uploadFile(thumbPath, thumb).catch(() => (thumbPath = null));
          }
          await insertRow("snaps", { kind: "video", path, thumb_path: thumbPath });
        } else {
          const photo = await preparePhoto(file);
          if (!photo) {
            skipped += 1;
            showToast("열 수 없는 사진 형식이 있어 건너뛰었어요.");
            continue;
          }
          const path = snapPath("jpg");
          const thumbPath = snapPath("jpg", "-thumb");
          await uploadFile(path, photo.full, onProgress);
          await uploadFile(thumbPath, photo.thumb);
          await insertRow("snaps", { kind: "photo", path, thumb_path: thumbPath });
        }
        ok += 1;
      } catch {
        skipped += 1;
      }
    }

    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
    await reload();

    if (ok > 0 && skipped === 0) showToast(`${ok}개를 올렸어요. 고맙습니다!`);
    else if (ok > 0) showToast(`${ok}개를 올렸고 ${skipped}개는 올리지 못했어요.`);
    else showToast("올리지 못했어요. 잠시 후 다시 시도해 주세요.");
  };

  return (
    <section className="edge band pb-24" aria-labelledby="guestsnap-heading">
      <Reveal className="text-center">
        <SectionIcon name="camera" />
        <h2 id="guestsnap-heading" className="section-title">
          {guestSnap.heading}
        </h2>
        <p className="mt-4 text-[14.5px] leading-relaxed tracking-[-0.01em] text-muted">
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
              <p key={i} className="text-[14px] leading-[1.85] tracking-[-0.01em] text-[#4a473f]">
                {line}
              </p>
            ),
          )}

          {guestSnap.reward.enabled && guestSnap.reward.text && (
            <div className="mt-7 border-t border-line pt-7">
              <p className="text-[14px] leading-[1.85] tracking-[-0.01em] text-accent">
                {guestSnap.reward.text}
              </p>
              {guestSnap.reward.draft && (
                <DraftMark status={guestSnap.reward.draft} className="mt-2.5" />
              )}
            </div>
          )}

          {ready ? (
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
                onClick={() => inputRef.current?.click()}
                className="btn-solid glow-hint mt-7 w-full active:btn-solid-active disabled:opacity-70"
              >
                {uploading
                  ? `올리는 중… ${progress.index} / ${progress.total}`
                  : guestSnap.buttonLabel}
              </button>
              {uploading && (
                <div
                  className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-paper-deep"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress.ratio * 100)}
                >
                  <div
                    className="h-full rounded-full bg-accent-soft transition-[width] duration-200"
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
                className="mt-7 w-full rounded-[8px] border border-dashed border-line py-4 text-[14.5px] tracking-[-0.01em] text-faint"
              >
                {guestSnap.buttonLabel}
              </p>
              <p className="mt-3 text-[12.5px] tracking-[-0.01em] text-accent">
                {guestSnap.pendingLabel}
              </p>
            </>
          )}
        </div>
      </Reveal>

      {snaps.length > 0 && (
        <div className="mt-8">
          <p className="text-center text-[13px] tracking-[0.04em] text-accent">
            함께 남긴 순간들 · {snaps.length}
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
                className="btn-outline active:bg-paper-deep"
              >
                {showAll ? "접기" : `더보기 (${snaps.length - guestSnap.pageSize})`}
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
          />
        )}
      </AnimatePresence>
    </section>
  );
}
