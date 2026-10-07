"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { useAudio } from "@/components/AudioProvider";
import { Cheers } from "@/components/Cheers";
import { Cmd, Prompt } from "@/components/dev/Cmd";
import { MatrixRain } from "@/components/dev/MatrixRain";
import { PixelHeart } from "@/components/dev/PixelHeart";
import { GalleryViewer } from "@/components/GalleryViewer";
import { GuestSnap } from "@/components/GuestSnap";
import { useToast } from "@/components/Toast";
import { blurBackground } from "@/config/blur";
import { wedding, type Account, type GalleryImage, type InfoTab, type InterviewItem } from "@/config/wedding";
import { copyText } from "@/lib/clipboard";
import { buildMonthGrid, getDday, parseWeddingDate } from "@/lib/date";
import { scrollToTop } from "@/lib/scroll";
import { kakaoMapHref, naverMapHref, venueLine } from "@/lib/venue";

/** 기본 청첩장의 입장 화면과 같은 열쇠 — 한쪽에서 열었으면 다른 쪽도 열린 것으로 본다. */
const ENTERED_KEY = "wedding:entered";

const { devVersion: dv } = wedding;

/** 계좌 관계 → 환경 변수 이름 */
const RELATION_KEY: Record<string, string> = {
  신랑: "SELF",
  신부: "SELF",
  아버지: "FATHER",
  어머니: "MOTHER",
};

/* ── 작은 조각들 ─────────────────────────────────────────────── */

/** 화면 크기에 맞춘 터미널 글자 — 글자 크기 버튼(--fs)도 따른다. */
const T = {
  base: "text-[length:calc(13.5px*var(--fs))] leading-[1.75]",
  small: "text-[length:calc(12px*var(--fs))] leading-[1.7]",
};

function Section({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-14 scroll-mt-6">
      {children}
    </section>
  );
}

/** 연인이 된 날부터 오늘까지 */
function useUptimeDays() {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    const start = parseWeddingDate(wedding.togetherTime.startDate);
    setDays(Math.floor((Date.now() - start.getTime()) / 86_400_000));
  }, []);
  return days;
}

/** /dev 로 바로 들어온 분께만 — 이 탭이 음악을 켜는 첫 동작이 된다. */
function DevBoot({ onDone }: { onDone: () => void }) {
  const { startMusic } = useAudio();
  const days = useUptimeDays();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (shown >= dv.boot.length) return;
    const t = window.setTimeout(() => setShown((n) => n + 1), 260);
    return () => window.clearTimeout(t);
  }, [shown]);

  const enter = () => {
    startMusic();
    try {
      sessionStorage.setItem(ENTERED_KEY, "1");
    } catch {}
    onDone();
  };

  // 스크롤 상자 바깥(body)에 띄워야 음악 · 공유 버튼보다 위에 덮인다.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="개발자 청첩장 실행"
      className="fixed inset-0 z-[100] flex touch-none flex-col justify-end bg-dev-bg px-6 pb-[max(env(safe-area-inset-bottom),48px)] font-mono"
    >
      <div className="mx-auto w-full max-w-[520px]">
        <p className={`${T.base} text-dev-faint`}>wedding.sh v1.0.0 — {venueLine()}</p>
        <ul className={`mt-4 space-y-1 ${T.small}`}>
          {dv.boot.slice(0, shown).map((line, i) => (
            <li key={i} className="text-dev-ink">
              {/* "[  OK  ]" 부분만 초록 */}
              <span className="text-dev-green">{line.match(/^\[[^\]]*\]/)?.[0]}</span>
              {line
                .replace(/^\[[^\]]*\]/, "")
                .replace("{days}", days === null ? "…" : days.toLocaleString("ko-KR"))}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={enter}
          className={`mt-8 w-full rounded-[6px] border border-dev-green px-4 py-4 text-left text-[length:calc(15px*var(--fs))] text-dev-green active:bg-dev-green/15 ${
            shown >= dv.boot.length ? "opacity-100" : "opacity-40"
          }`}
        >
          {dv.bootButton}
          <span className="dev-cursor" aria-hidden="true" />
        </button>
      </div>
    </div>,
    document.body,
  );
}

/** 3열 사진 + --more + 크게 보기 */
function DevPhotos({ images, initial = 6 }: { images: readonly GalleryImage[]; initial?: number }) {
  const [open, setOpen] = useState<number | null>(null);
  const [all, setAll] = useState(false);
  const visible = all ? images : images.slice(0, initial);

  return (
    <>
      <ul className="grid grid-cols-3 gap-1">
        {visible.map((image, i) => (
          <li key={image.src}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`${image.alt} 크게 보기`}
              className="relative block aspect-square w-full overflow-hidden rounded-[2px] bg-dev-panel ring-1 ring-dev-line"
              style={blurBackground(image.src, image.objectPosition)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                loading="lazy"
                sizes="(max-width: 520px) 32vw, 166px"
                className="object-cover"
                style={{ objectPosition: image.objectPosition ?? "center" }}
              />
            </button>
          </li>
        ))}
      </ul>
      {images.length > initial && (
        <button
          type="button"
          onClick={() => setAll((v) => !v)}
          aria-expanded={all}
          className={`tap mt-2 px-1 ${T.base} text-dev-cyan underline underline-offset-4`}
        >
          {all ? "--collapse" : `--more (${images.length - initial})`}
        </button>
      )}
      {open !== null && <GalleryViewer images={images} startIndex={open} onClose={() => setOpen(null)} />}
    </>
  );
}

/**
 * AI 들의 코드 리뷰 — 화면에 들어오면 한 명씩 approve 를 남긴다.
 * 끝의 버튼은 하객도 축하 메시지(= 리뷰)를 남기러 아래로 데려간다.
 */
function AiReviews({ days }: { days: number | null }) {
  const { pr, aiReviews } = dv;
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);
  const done = shown >= aiReviews.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(aiReviews.length);
      return;
    }
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        let n = 0;
        const tick = () => {
          n += 1;
          setShown(n);
          if (n < aiReviews.length) timer = window.setTimeout(tick, 650);
        };
        timer = window.setTimeout(tick, 900);
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [aiReviews.length]);

  const goWrite = () => {
    document.getElementById("dev-cheers")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={ref} className={T.base}>
      <div className="rounded-[6px] border border-dev-line bg-dev-panel px-4 py-3">
        <p>
          <span className="mr-2 rounded-full bg-dev-green/15 px-2 py-0.5 text-[length:calc(11.5px*var(--fs))] text-dev-green">
            Open
          </span>
          <span className="font-bold">{pr.title}</span>
          <span className="text-dev-faint"> #{pr.number}</span>
        </p>
        <p className={`mt-1 ${T.small} text-dev-faint`}>
          {dv.user}/groom + {dv.host}/bride → main · {aiReviews.length} reviewers
        </p>
      </div>

      <ul className="mt-3 space-y-2.5">
        {aiReviews.slice(0, shown).map((r) => (
          <li key={r.name} className="rounded-[6px] border border-dev-line px-4 py-3">
            <p className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: r.color }} aria-hidden="true" />
              <span className="font-bold">{r.name}</span>
              <span className="ml-auto shrink-0 text-dev-green">✓ approved</span>
            </p>
            <p className="mt-1.5 text-dev-ink/90">
              {r.message.replace("{days}", days === null ? "…" : days.toLocaleString("ko-KR"))}
            </p>
          </li>
        ))}
      </ul>
      {!done && <span className="dev-cursor mt-3" aria-hidden="true" />}

      {done && (
        <div className="mt-4">
          <p className="text-dev-green">
            ✓ All checks have passed · {aiReviews.length} approvals · LGTM 🎉
          </p>
          <p className={`mt-1 ${T.small} text-dev-faint`}>{pr.note}</p>
          <button
            type="button"
            onClick={goWrite}
            className="mt-4 w-full rounded-[6px] border border-dev-cyan/60 bg-dev-cyan/10 px-4 py-3 text-left text-dev-cyan active:bg-dev-cyan/20"
          >
            $ {pr.button}
            <span className={`ml-2 ${T.small} text-dev-faint`}># 나도 축하 메시지 남기기</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ── 본문 ───────────────────────────────────────────────────── */

/**
 * 개발자 버전 청첩장.
 * 기본 청첩장과 같은 config 를 터미널 화면 · 개발자 말투로 다시 보여준다.
 */
export function DevInvitation() {
  const { showToast } = useToast();
  const days = useUptimeDays();
  const [booted, setBooted] = useState(true);
  const [burst, setBurst] = useState(0);
  const [moreQa, setMoreQa] = useState(false);
  const [logLines, setLogLines] = useState(0);
  const logRef = useRef<HTMLDivElement>(null);

  const w = wedding.wedding;
  const date = w.date;
  const [y, m, d] = date.split("-");
  const dday = (() => {
    const s = getDday(date);
    return s.status === "before" ? `D-${s.days}` : s.status === "today" ? "D-DAY" : "merged ✓";
  })();

  // 이미 청첩장을 연 세션이면 부팅 화면 없이 바로, 처음이면 부팅 화면부터.
  useEffect(() => {
    scrollToTop({ smooth: false });
    try {
      if (sessionStorage.getItem(ENTERED_KEY) !== "1") setBooted(false);
    } catch {
      setBooted(false);
    }
  }, []);

  // 마지막 로그는 화면에 들어오면 한 줄씩 찍힌다.
  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let n = 0;
      const tick = () => {
        n += 1;
        setLogLines(n);
        if (n < dv.log.length) window.setTimeout(tick, 420);
      };
      window.setTimeout(tick, 1200);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const copy = async (text: string, label: string) => {
    const ok = await copyText(text);
    showToast(ok ? `${label} 복사했어요.` : "복사에 실패했어요.");
  };

  const fetchRows: { key: string; value: string }[] = [
    { key: "groom", value: `${wedding.groom.name} (${wedding.groom.mbti})` },
    { key: "bride", value: `${wedding.bride.name} (${wedding.bride.mbti})` },
    { key: "date", value: `${date} (Sun) ${w.time} KST` },
    { key: "host", value: venueLine() },
    { key: "addr", value: w.address },
    {
      key: "uptime",
      value: `${days === null ? "…" : days.toLocaleString("ko-KR")} days (since ${wedding.togetherTime.startDate})`,
    },
    { key: "deploy", value: dday },
    { key: "pkgs", value: `${wedding.groom.likes.text} · ${wedding.bride.likes.text}` },
    ...dv.fetchExtra,
  ];

  const cal = buildMonthGrid(date);
  const qa: readonly InterviewItem[] = wedding.interview.qa;
  const tabs: readonly InfoTab[] = wedding.infoTabs.items;
  const accounts: { side: string; list: readonly Account[] }[] = [
    { side: "GROOM", list: wedding.accounts.groom },
    { side: "BRIDE", list: wedding.accounts.bride },
  ];

  return (
    <div className="dev-root min-h-[100svh] bg-dev-bg font-mono text-dev-ink">
      {!booted && <DevBoot onDone={() => setBooted(true)} />}

      {/* ── 첫 화면: 쏟아지는 글자 위에 이름과 하트 ── */}
      <header className="relative overflow-hidden" style={{ height: "calc(var(--app-h, 100svh) * 0.92)", minHeight: 560 }}>
        <MatrixRain burst={burst} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-dev-bg/40 via-transparent to-dev-bg" aria-hidden="true" />

        <div className="relative flex h-full flex-col px-5 pt-[calc(env(safe-area-inset-top)+14px)]">
          {/* 터미널 창 머리 */}
          <div className="flex items-center gap-1.5 pr-14">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className={`ml-2 truncate ${T.small} text-dev-faint`}>
              {dv.user}@{dv.host}: {dv.path} — zsh
            </span>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className={`${T.small} text-dev-faint`}>$ ./wedding.sh --start</p>
            <button
              type="button"
              onClick={() => setBurst((n) => n + 1)}
              aria-label="하트를 누르면 하트가 쏟아져요"
              className="mt-7 rounded-[8px] p-3 active:scale-95"
            >
              <PixelHeart size={10} />
            </button>
            <h1 className="mt-6 text-[length:calc(24px*var(--fs))] font-bold tracking-[-0.01em] text-dev-ink">
              {wedding.groom.name} <span className="text-dev-pink">♥</span> {wedding.bride.name}
            </h1>
            <p className={`mt-3 ${T.base} text-dev-green`}>
              {y}.{m}.{d} SUN {w.time}
            </p>
            <p className={`mt-1 ${T.small} text-dev-ink/80`}>{venueLine()}</p>
            <p className={`mt-5 ${T.small} text-dev-faint`}>
              <span className="text-dev-purple"># </span>
              {dv.tagline}
            </p>
            <p className={`mt-2 ${T.small} text-dev-faint`}>(하트를 눌러 보세요)</p>
          </div>

          <p className={`pb-8 text-center ${T.small} text-dev-faint`}>↓ scroll</p>
        </div>
      </header>

      <main className="px-5 pb-28">
        {/* README */}
        <Section>
          <Cmd command="cat README.md">
            <div className={`rounded-[6px] border border-dev-line bg-dev-panel px-4 py-4 ${T.base}`}>
              {dv.readme.map((line, i) =>
                line === "" ? (
                  <div key={i} className="h-3" aria-hidden="true" />
                ) : line.startsWith("# ") ? (
                  <p key={i} className="text-[length:calc(16px*var(--fs))] font-bold text-dev-purple">
                    {line}
                  </p>
                ) : (
                  <p key={i}>{line}</p>
                ),
              )}
            </div>
          </Cmd>
        </Section>

        {/* weddingfetch */}
        <Section>
          <Cmd command="weddingfetch">
            <div className="flex flex-col gap-4 min-[420px]:flex-row min-[420px]:items-start">
              <pre
                aria-hidden="true"
                className="shrink-0 text-[length:calc(11px*var(--fs))] leading-[1.15] text-dev-pink"
              >{`  @@@@   @@@@
 @@@@@@ @@@@@@
@@@@@@@@@@@@@@@
 @@@@@@@@@@@@@
   @@@@@@@@@
     @@@@@
       @`}</pre>
              <div className={`min-w-0 ${T.base}`}>
                <p className="font-bold text-dev-green">
                  {dv.user}@{dv.host}
                </p>
                <p className="text-dev-faint">{"-".repeat(dv.user.length + dv.host.length + 1)}</p>
                <dl>
                  {fetchRows.map((row) => (
                    <div key={row.key} className="flex gap-2">
                      <dt className="w-[4.6em] shrink-0 font-bold text-dev-cyan">{row.key}</dt>
                      <dd className="min-w-0 break-words">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-3 flex gap-1" aria-hidden="true">
                  {["#ff5f57", "#febc2e", "#3fb950", "#56d4dd", "#b780ff", "#ff7eb6", "#d6dde6"].map((c) => (
                    <span key={c} className="h-3.5 w-5" style={{ background: c }} />
                  ))}
                </div>
              </div>
            </div>
          </Cmd>
        </Section>

        {/* 달력 */}
        <Section>
          <Cmd command={`cal ${Number(m)} ${y}`}>
            <div className={`w-fit ${T.base}`}>
              <p className="text-center">
                {Number(m)}월 {y}
              </p>
              <div className="mt-1 grid grid-cols-7 text-center">
                {["일", "월", "화", "수", "목", "금", "토"].map((k, i) => (
                  <span key={k} className={`w-9 ${i === 0 ? "text-dev-pink" : "text-dev-faint"}`}>
                    {k}
                  </span>
                ))}
                {cal.map((cell, i) => (
                  <span
                    key={i}
                    className={`w-9 ${
                      cell.isWedding
                        ? "rounded-[3px] bg-dev-pink font-bold text-dev-bg"
                        : cell.weekday === 0
                          ? "text-dev-pink/80"
                          : ""
                    }`}
                  >
                    {cell.day ?? ""}
                  </span>
                ))}
              </div>
            </div>
            <a
              href="/api/calendar"
              className={`tap mt-3 inline-flex px-1 ${T.base} text-dev-cyan underline underline-offset-4`}
            >
              --add-to-calendar
            </a>
          </Cmd>
        </Section>

        {/* 우리의 시간 */}
        <Section>
          <Cmd command="git log --graph --oneline">
            <ol className={T.base}>
              {dv.commits.map((c, i) => (
                <li key={i} className="flex gap-2">
                  <span className="shrink-0 text-dev-pink">{c.type === "merge" ? "*  " : "*"}</span>
                  <span className="min-w-0">
                    <span className="text-dev-yellow">
                      {(c.date.replace(/-/g, "") + "a1f").slice(2, 9)}
                    </span>
                    {"head" in c && c.head && <span className="text-dev-cyan"> (HEAD → main, tag: v1.0.0)</span>}
                    <br />
                    <span className="text-dev-faint">{c.date} </span>
                    <span className="text-dev-green">{c.type}:</span> {c.message}
                  </span>
                </li>
              ))}
            </ol>
          </Cmd>
        </Section>

        {/* 사진 */}
        <Section>
          <Cmd command="ls ./photos/wedding">
            <DevPhotos images={wedding.gallery} />
          </Cmd>
        </Section>
        <Section>
          <Cmd command="ls ./photos/daily">
            <DevPhotos images={wedding.dailyGallery.images} />
          </Cmd>
        </Section>

        {/* 인터뷰 */}
        <Section>
          <Cmd command="./interview.sh">
            <div className={`space-y-5 ${T.base}`}>
              {(moreQa ? qa : qa.slice(0, 2)).map((item, i) => (
                <div key={i}>
                  <p className="text-dev-yellow">? {item.q}</p>
                  {item.answers
                    .filter((a) => a.text)
                    .map((a, j) => (
                      <p key={j} className="mt-1">
                        <span className={a.who === "bride" ? "text-dev-pink" : a.who === "groom" ? "text-dev-cyan" : "text-dev-green"}>
                          {a.who === "both" ? "> both" : a.who === "groom" ? "> groom" : "> bride"}:
                        </span>{" "}
                        {a.text}
                      </p>
                    ))}
                </div>
              ))}
            </div>
            {qa.length > 2 && (
              <button
                type="button"
                onClick={() => setMoreQa((v) => !v)}
                aria-expanded={moreQa}
                className={`tap mt-2 px-1 ${T.base} text-dev-cyan underline underline-offset-4`}
              >
                {moreQa ? "--collapse" : `--more (${qa.length - 2})`}
              </button>
            )}
          </Cmd>
        </Section>

        {/* 서로에게 */}
        <Section>
          <Cmd command="cat ./letters/*.txt">
            <div className="space-y-6">
              {wedding.letters.items.map((letter) => (
                <div key={letter.from} className={`rounded-[6px] border border-dev-line bg-dev-panel px-4 py-4 ${T.base}`}>
                  <p className="text-dev-faint">
                    {"// "}
                    {letter.label}
                  </p>
                  <div className="mt-2">
                    {letter.body.map((line, i) =>
                      line === "" ? <div key={i} className="h-3" aria-hidden="true" /> : <p key={i}>{line}</p>,
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Cmd>
        </Section>

        {/* 오시는 길 */}
        <Section>
          <Cmd command="cat location.yml">
            <div className={T.base}>
              <p>
                <span className="text-dev-cyan">venue</span>: {w.venue}
              </p>
              {w.ceremonyFloor && (
                <p>
                  <span className="text-dev-cyan">floor</span>: {w.ceremonyFloor}
                </p>
              )}
              <p>
                <span className="text-dev-cyan">address</span>: {w.address}
              </p>
              {wedding.location.transport.map((group) => (
                <div key={group.label} className="mt-2">
                  <p className="text-dev-cyan">{group.label}:</p>
                  {group.lines.map((line, i) => (
                    <p key={i} className="flex gap-2 pl-3">
                      <span className="text-dev-faint">-</span>
                      <span className="min-w-0">{line}</span>
                    </p>
                  ))}
                </div>
              ))}
            </div>
            <div className={`mt-4 flex flex-wrap gap-2 ${T.small}`}>
              <a href={naverMapHref()} target="_blank" rel="noopener noreferrer" className="rounded-[4px] border border-dev-line px-3 py-2.5 text-dev-green">
                [ 네이버지도 ]
              </a>
              <a href={kakaoMapHref()} target="_blank" rel="noopener noreferrer" className="rounded-[4px] border border-dev-line px-3 py-2.5 text-dev-yellow">
                [ 카카오맵 ]
              </a>
              <button type="button" onClick={() => copy(w.address, "주소를")} className="rounded-[4px] border border-dev-line px-3 py-2.5 text-dev-cyan">
                [ 주소 복사 ]
              </button>
            </div>
          </Cmd>
        </Section>

        {/* 안내 사항 */}
        <Section>
          <Cmd command="cat NOTICE.md">
            <div className={`space-y-4 ${T.base}`}>
              {tabs.map((tab) => (
                <div key={tab.key}>
                  <p className="font-bold text-dev-purple">## {tab.label}</p>
                  {tab.body.filter(Boolean).map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                  {tab.note && <p className="text-dev-faint">{`// ${tab.note}`}</p>}
                </div>
              ))}
            </div>
          </Cmd>
        </Section>

        {/* AI 들의 리뷰 */}
        <Section>
          <Cmd command={`gh pr view ${dv.pr.number} --reviews`}>
            <AiReviews days={days} />
          </Cmd>
        </Section>

        {/* 축하 메시지 — 기본 청첩장과 같은 데이터 */}
        <Section id="dev-cheers">
          <Cmd command={'git log --grep="축하"'}>
            <Cheers variant="dev" />
          </Cmd>
        </Section>

        {/* 하객 사진 · 영상 — 기본 청첩장과 같은 데이터 */}
        <Section>
          <Cmd command="ls ./guest-snaps">
            <GuestSnap variant="dev" />
          </Cmd>
        </Section>

        {/* 마음 전하실 곳 */}
        <Section>
          <Cmd command="cat .env.gift">
            <div className={`space-y-4 ${T.base}`}>
              {accounts.map((group) => (
                <div key={group.side}>
                  <p className="text-dev-faint"># {group.side === "GROOM" ? "신랑측" : "신부측"}</p>
                  {group.list.map((a) => (
                    <div key={a.number} className="mt-1.5 flex items-center justify-between gap-2">
                      <p className="min-w-0">
                        <span className="text-dev-cyan">
                          {group.side}_{RELATION_KEY[a.relation ?? ""] ?? "ACCOUNT"}
                        </span>
                        =
                        <br />
                        <span className="pl-3">
                          &quot;{a.bank} {a.number} {a.holder}&quot;
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={() => copy(a.number.replace(/\D/g, ""), `${a.holder}님 계좌번호를`)}
                        className={`tap shrink-0 px-2 ${T.small} text-dev-green`}
                      >
                        [copy]
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Cmd>
        </Section>

        {/* 마지막 로그 */}
        <Section>
          <div ref={logRef}>
            <Cmd command="tail -f /var/log/wedding.log">
              <div className={T.base}>
                {dv.log.slice(0, logLines).map((line, i) => (
                  <p key={i} className={i === dv.log.length - 1 ? "font-bold text-dev-green" : ""}>
                    {i === 0 && <span className="text-dev-faint">[{date} {w.time}] </span>}
                    {line.startsWith("HTTP") ? <span className="text-dev-green">{line}</span> : line}
                  </p>
                ))}
                {logLines < dv.log.length && <span className="dev-cursor" aria-hidden="true" />}
              </div>
              {logLines >= dv.log.length && (
                <div className={`mt-8 ${T.base}`}>
                  {wedding.ending.farewell.map((line, i) =>
                    line === "" ? <div key={i} className="h-3" aria-hidden="true" /> : <p key={i}>{line}</p>,
                  )}
                  <p className="mt-4 text-dev-pink">— {wedding.ending.farewellSign}</p>
                </div>
              )}
            </Cmd>
          </div>
        </Section>

        <Section>
          <p className={T.base}>
            <Prompt />
            <Link href="/" className="text-dev-cyan underline underline-offset-4">
              cd .. # {dv.backLabel}
            </Link>
          </p>
        </Section>
      </main>
    </div>
  );
}
