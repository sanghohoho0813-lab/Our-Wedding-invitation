"use client";

import { MessageSquare, Phone } from "lucide-react";
import { useEffect, useState } from "react";

import { Reveal } from "@/components/Reveal";
import { useToast } from "@/components/Toast";
import { wedding, type ContactPerson } from "@/config/wedding";
import { copyText } from "@/lib/clipboard";
import { canWebShare, isKakaoReady, kakaoShare, webShare } from "@/lib/share";

function ContactRow({ person }: { person: ContactPerson }) {
  const tel = person.phone.replace(/-/g, "");

  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <p className="min-w-0 text-[14px] tracking-[-0.01em] text-[#3d3b37]">
        <span className="text-[12px] text-faint">{person.role}</span>
        <span className="mx-2 text-line">·</span>
        {person.name}
      </p>
      <div className="flex shrink-0 items-center gap-1">
        <a
          href={`tel:${tel}`}
          aria-label={`${person.role} ${person.name}에게 전화하기`}
          className="tap w-11 text-muted transition-colors active:text-ink"
        >
          <Phone size={15} strokeWidth={1.4} aria-hidden="true" />
        </a>
        <a
          href={`sms:${tel}`}
          aria-label={`${person.role} ${person.name}에게 문자 보내기`}
          className="tap w-11 text-muted transition-colors active:text-ink"
        >
          <MessageSquare size={15} strokeWidth={1.4} aria-hidden="true" />
        </a>
      </div>
    </li>
  );
}

/**
 * 혼주 연락처 + 공유를 한 섹션에서 마무리한다.
 * (신랑·신부 연락처는 COUPLE 섹션에 있으므로 여기서 반복하지 않는다.)
 */
export function Contact() {
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

  const people = [...wedding.contacts.groom, ...wedding.contacts.bride];

  return (
    <section className="edge pb-20" aria-labelledby="contact-heading">
      <Reveal>
        <p id="contact-heading" className="eyebrow text-center">
          Contact
        </p>
      </Reveal>

      {people.length > 0 && (
        <Reveal delay={0.06}>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {people.map((person, i) => (
              <ContactRow key={i} person={person} />
            ))}
          </ul>
        </Reveal>
      )}

      <Reveal delay={0.1}>
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
