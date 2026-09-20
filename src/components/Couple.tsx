"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Phone } from "lucide-react";
import { useState } from "react";

import { DraftMark } from "@/components/DraftMark";
import { PhotoSlot } from "@/components/PhotoSlot";
import { Reveal } from "@/components/Reveal";
import { wedding, type IntroLine } from "@/config/wedding";
import { isPlaceholderPhone, PLACEHOLDER_LABEL } from "@/lib/placeholder";

type Person = typeof wedding.groom | typeof wedding.bride;

const { groom, bride } = wedding;

function parentsLine(person: Person) {
  const father = person.father ? `${person.fatherPrefix}${person.father}` : "";
  const mother = person.mother ? `${person.motherPrefix}${person.mother}` : "";
  const parents = [father, mother].filter(Boolean).join(" · ");
  if (!parents) return "";
  return person.relation ? `${parents} 의 ${person.relation}` : parents;
}

/** 사진 + 이름 + 전화 버튼 */
function PersonHead({ label, person }: { label: string; person: Person }) {
  const tel = person.phone.replace(/-/g, "");
  // 아직 실제 번호가 없으면 전화 버튼을 만들지 않는다.
  const callable = !isPlaceholderPhone(person.phone);

  return (
    <div className="min-w-0 text-center">
      <PhotoSlot
        src={person.photo}
        alt={person.photoAlt}
        ratio="4 / 5"
        sizes="(max-width: 520px) 45vw, 236px"
      />

      <p className="mt-5 text-[15px] tracking-[-0.01em] text-ink">
        {label} {person.name}
        {callable && (
          <a
            href={`tel:${tel}`}
            aria-label={`${label} ${person.name}에게 전화하기`}
            className="-my-2 ml-1 inline-flex h-11 w-11 items-center justify-center align-middle text-accent"
          >
            <Phone size={14} strokeWidth={1.6} aria-hidden="true" />
          </a>
        )}
      </p>
    </div>
  );
}

/** 값 한 칸 — 라벨이 있으면 값 위에 작게 붙인다. */
function Cell({ line }: { line: IntroLine }) {
  if (!line.text) return <span aria-hidden="true" />;

  return (
    <div className="min-w-0 text-center">
      {line.label && (
        <span className="block text-[11.5px] leading-tight tracking-[0.02em] text-faint">
          {line.label}
        </span>
      )}
      <span className="mt-1.5 block text-[13.5px] leading-[1.7] text-muted">{line.text}</span>
      {line.draft && <DraftMark status={line.draft} className="mt-2" />}
    </div>
  );
}

/**
 * 신랑 · 신부의 정보를 담는 연한 박스.
 *
 * 두 사람의 줄 수가 달라도 같은 항목이 같은 높이에 오도록
 * 카드를 따로 두지 않고 **한 격자 안에서 행 단위로** 배치한다.
 */
function ProfileBox() {
  const rows: { key: string; label?: string; left: IntroLine; right: IntroLine }[] = [];

  if (groom.birth || bride.birth) {
    rows.push({
      key: "birth",
      left: { text: groom.birth },
      right: { text: bride.birth },
    });
  }
  if (groom.mbti || bride.mbti) {
    rows.push({
      key: "mbti",
      left: { text: groom.mbti },
      right: { text: bride.mbti },
    });
  }
  if (groom.likes.text || bride.likes.text) {
    rows.push({
      key: "likes",
      // 라벨이 양쪽 같으면 가운데에 한 번만 쓴다.
      label: groom.likes.label,
      left: { ...groom.likes, label: undefined },
      right: { ...bride.likes, label: undefined },
    });
  }
  if (groom.partnerQuote.text || bride.partnerQuote.text) {
    rows.push({ key: "partner", left: groom.partnerQuote, right: bride.partnerQuote });
  }

  if (rows.length === 0) return null;

  return (
    <div className="mt-6 rounded-[12px] bg-paper-soft px-5 py-7">
      {rows.map((row, i) => (
        <div key={row.key} className={i === 0 ? "" : "mt-6 border-t border-line/70 pt-6"}>
          {row.label && (
            <p className="mb-3 text-center text-[11.5px] tracking-[0.02em] text-faint">
              {row.label}
            </p>
          )}
          <div className="grid grid-cols-2 gap-x-4">
            {row.key === "mbti" ? (
              <>
                <p className="latin text-center text-[13.5px] tracking-[0.08em] text-accent">
                  {row.left.text}
                </p>
                <p className="latin text-center text-[13.5px] tracking-[0.08em] text-accent">
                  {row.right.text}
                </p>
              </>
            ) : (
              <>
                <Cell line={row.left} />
                <Cell line={row.right} />
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/** 혼주 연락처 — 평소에는 접어두고 버튼을 눌렀을 때만 보여준다. */
function HostContacts() {
  const [open, setOpen] = useState(false);
  const people = [...wedding.contacts.groom, ...wedding.contacts.bride];
  if (people.length === 0) return null;

  return (
    <div className="mt-10 text-center">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="btn-outline active:bg-paper-deep"
      >
        혼주에게 연락하기
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <ul className="mt-6 divide-y divide-line border-y border-line text-left">
              {people.map((person, i) => {
                const tel = person.phone.replace(/-/g, "");
                // 번호가 아직 예시값이면 전화·문자 버튼 대신 안내만 보여준다.
                const ready = !isPlaceholderPhone(person.phone);

                return (
                  <li key={i} className="flex items-center justify-between gap-4 py-3">
                    <p className="min-w-0 text-[14px] tracking-[-0.01em] text-[#4a473f]">
                      <span className="text-[12px] text-faint">{person.role}</span>
                      <span className="mx-2 text-line">·</span>
                      {person.name}
                    </p>
                    {ready ? (
                      <span className="flex shrink-0 items-center gap-1">
                        <a
                          href={`tel:${tel}`}
                          aria-label={`${person.role} ${person.name}에게 전화하기`}
                          className="tap w-11 text-muted active:text-ink"
                        >
                          <Phone size={15} strokeWidth={1.4} aria-hidden="true" />
                        </a>
                        <a
                          href={`sms:${tel}`}
                          aria-label={`${person.role} ${person.name}에게 문자 보내기`}
                          className="tap w-11 text-muted active:text-ink"
                        >
                          <MessageSquare size={15} strokeWidth={1.4} aria-hidden="true" />
                        </a>
                      </span>
                    ) : (
                      <span className="shrink-0 text-[11.5px] text-faint">{PLACEHOLDER_LABEL}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Couple() {
  return (
    <section className="edge pb-24" aria-label="신랑 신부 소개">
      <Reveal>
        <div className="grid grid-cols-2 gap-4">
          <PersonHead label="신랑" person={groom} />
          <PersonHead label="신부" person={bride} />
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <ProfileBox />

        {(parentsLine(groom) || parentsLine(bride)) && (
          <div className="mt-6 grid grid-cols-2 gap-x-4">
            <p className="text-center text-[12.5px] leading-relaxed text-faint">
              {parentsLine(groom)}
            </p>
            <p className="text-center text-[12.5px] leading-relaxed text-faint">
              {parentsLine(bride)}
            </p>
          </div>
        )}
      </Reveal>

      <Reveal delay={0.1}>
        <HostContacts />
      </Reveal>
    </section>
  );
}
