"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Phone } from "lucide-react";
import { useState } from "react";

import { PhotoSlot } from "@/components/PhotoSlot";
import { Reveal } from "@/components/Reveal";
import { wedding } from "@/config/wedding";

type Person = typeof wedding.groom | typeof wedding.bride;

function parentsLine(person: Person) {
  const father = person.father ? `${person.fatherPrefix}${person.father}` : "";
  const mother = person.mother ? `${person.motherPrefix}${person.mother}` : "";
  const parents = [father, mother].filter(Boolean).join(" · ");
  if (!parents) return "";
  return person.relation ? `${parents} 의 ${person.relation}` : parents;
}

function PersonCard({ label, person }: { label: string; person: Person }) {
  const tel = person.phone.replace(/-/g, "");

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
        <a
          href={`tel:${tel}`}
          aria-label={`${label} ${person.name}에게 전화하기`}
          className="-my-2 ml-1 inline-flex h-11 w-11 items-center justify-center align-middle text-accent"
        >
          <Phone size={14} strokeWidth={1.6} aria-hidden="true" />
        </a>
      </p>

      {person.birth && <p className="mt-1 text-[13.5px] text-muted">{person.birth}</p>}

      {person.keywords.length > 0 && (
        <ul className="mt-6 space-y-1.5 text-[13.5px] leading-relaxed text-muted">
          {person.keywords.map((k, i) => (
            <li key={i}>{k}</li>
          ))}
        </ul>
      )}

      {parentsLine(person) && (
        <p className="mt-6 text-[12.5px] leading-relaxed text-faint">{parentsLine(person)}</p>
      )}
    </div>
  );
}

/** 혼주 연락처 — 평소에는 접어두고 버튼을 눌렀을 때만 보여준다. */
function HostContacts() {
  const [open, setOpen] = useState(false);
  const people = [...wedding.contacts.groom, ...wedding.contacts.bride];
  if (people.length === 0) return null;

  return (
    <div className="mt-12 text-center">
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
                return (
                  <li key={i} className="flex items-center justify-between gap-4 py-3">
                    <p className="min-w-0 text-[14px] tracking-[-0.01em] text-[#4a473f]">
                      <span className="text-[12px] text-faint">{person.role}</span>
                      <span className="mx-2 text-line">·</span>
                      {person.name}
                    </p>
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
          <PersonCard label="신랑" person={wedding.groom} />
          <PersonCard label="신부" person={wedding.bride} />
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <HostContacts />
      </Reveal>
    </section>
  );
}
