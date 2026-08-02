import { MessageSquare, Phone } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { wedding } from "@/config/wedding";

type Person = typeof wedding.groom | typeof wedding.bride;

function parentsLine(person: Person) {
  const father = person.father ? `${person.fatherPrefix}${person.father}` : "";
  const mother = person.mother ? `${person.motherPrefix}${person.mother}` : "";
  const parents = [father, mother].filter(Boolean).join(" · ");
  if (!parents) return "";
  return person.relation ? `${parents}의 ${person.relation}` : parents;
}

/** GROOM / 이름 / 전화·문자 — 한 줄로 정리한 compact row */
function PersonRow({ label, koLabel, person }: { label: string; koLabel: string; person: Person }) {
  const tel = person.phone.replace(/-/g, "");
  const parents = wedding.couple.showParents ? parentsLine(person) : "";

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0">
        <span className="eyebrow block">{label}</span>
        <p className="mt-2 text-[18px] leading-tight tracking-[-0.01em] text-ink">{person.name}</p>
        {parents && <p className="mt-1.5 text-[12.5px] leading-snug text-faint">{parents}</p>}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <a
          href={`tel:${tel}`}
          aria-label={`${koLabel} ${person.name}에게 전화하기`}
          className="tap w-11 rounded-full text-muted transition-colors active:text-ink"
        >
          <Phone size={16} strokeWidth={1.4} aria-hidden="true" />
        </a>
        <a
          href={`sms:${tel}`}
          aria-label={`${koLabel} ${person.name}에게 문자 보내기`}
          className="tap w-11 rounded-full text-muted transition-colors active:text-ink"
        >
          <MessageSquare size={16} strokeWidth={1.4} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

export function Couple() {
  return (
    <section className="edge pb-20" aria-label="신랑 신부 소개">
      <Reveal>
        <div className="divide-y divide-line border-y border-line">
          <PersonRow label="Groom" koLabel="신랑" person={wedding.groom} />
          <PersonRow label="Bride" koLabel="신부" person={wedding.bride} />
        </div>
      </Reveal>
    </section>
  );
}
