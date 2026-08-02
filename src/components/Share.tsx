"use client";

import { useEffect, useState } from "react";

import { Reveal } from "@/components/Reveal";
import { useToast } from "@/components/Toast";
import { wedding } from "@/config/wedding";
import { copyText } from "@/lib/clipboard";
import { canWebShare, isKakaoReady, kakaoShare, webShare } from "@/lib/share";

export function Share() {
  const { showToast } = useToast();
  const [url, setUrl] = useState<string>(wedding.share.url);
  const [hasWebShare, setHasWebShare] = useState(false);
  const [hasKakao, setHasKakao] = useState(false);

  useEffect(() => {
    setUrl(window.location.href.split("#")[0]);
    setHasWebShare(canWebShare());
    setHasKakao(isKakaoReady());
  }, []);

  const handleCopy = async () => {
    const ok = await copyText(url);
    showToast(ok ? "링크가 복사되었습니다." : "복사에 실패했습니다.");
  };

  const handleWebShare = async () => {
    const result = await webShare(url);
    if (result === "unsupported") await handleCopy();
  };

  const handleKakao = () => {
    if (!kakaoShare(url)) showToast("카카오톡 공유를 사용할 수 없습니다.");
  };

  return (
    <section className="edge pb-28 text-center" aria-labelledby="share-heading">
      <Reveal>
        <p id="share-heading" className="eyebrow">
          Share
        </p>
        <p className="mt-7 text-[14.5px] leading-[1.9] tracking-[-0.01em] text-muted">
          청첩장을 전해주세요.
        </p>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mx-auto mt-8 flex max-w-[320px] gap-[7px]">
          <button
            type="button"
            onClick={handleCopy}
            className="tap w-full flex-1 border border-line text-[13px] tracking-[-0.01em] text-muted transition-colors active:bg-paper-deep"
          >
            링크 복사
          </button>

          {hasKakao && (
            <button
              type="button"
              onClick={handleKakao}
              className="tap w-full flex-1 border border-line text-[13px] tracking-[-0.01em] text-muted transition-colors active:bg-paper-deep"
            >
              카카오톡
            </button>
          )}

          {hasWebShare && (
            <button
              type="button"
              onClick={handleWebShare}
              className="tap w-full flex-1 border border-line text-[13px] tracking-[-0.01em] text-muted transition-colors active:bg-paper-deep"
            >
              공유하기
            </button>
          )}
        </div>
      </Reveal>
    </section>
  );
}
