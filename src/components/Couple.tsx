import Image from "next/image";
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

function PersonRow({ label, koLabel, person }: { label: string; koLabel: string; person: Person }) {
  const parents = wedding.couple.showParents ? parentsLine(person) : "";

  return (
    <div className="flex items-center justify-between gap-4 py-5">
      <div className="min-w-0">
        <span className="eyebrow block">{label}</span>
        {parents && <p className="mt-2.5 text-[12.5px] leading-snug text-muted">{parents}</p>}
        <p className="mt-1 text-[19px] font-normal leading-tight tracking-[-0.01em] text-ink">
          {person.name}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <a
          href={`tel:${person.phone.replace(/-/g, "")}`}
          aria-label={`${koLabel} ${person.name}에게 전화하기`}
          className="tap w-11 rounded-full text-muted transition-colors active:text-ink"
        >
          <Phone size={16} strokeWidth={1.4} aria-hidden="true" />
        </a>
        <a
          href={`sms:${person.phone.replace(/-/g, "")}`}
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
    <section aria-label="신랑 신부 소개">
      <Reveal>
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-deep">
          <Image
            src={wedding.couple.image}
            alt={wedding.couple.imageAlt}
            fill
            sizes="(max-width: 520px) 100vw, 520px"
            className="object-cover object-[50%_40%]"
          />
        </div>
      </Reveal>

      <div className="edge">
        {wedding.couple.caption && (
          <Reveal delay={0.05}>
            <p className="serif mt-8 text-center text-[15px] font-light italic tracking-[0.01em] text-muted">
              {wedding.couple.caption}
            </p>
          </Reveal>
        )}

        <Reveal delay={0.1}>
          <div className="mt-10 divide-y divide-line border-y border-line">
            <PersonRow label="Groom" koLabel="신랑" person={wedding.groom} />
            <PersonRow label="Bride" koLabel="신부" person={wedding.bride} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
