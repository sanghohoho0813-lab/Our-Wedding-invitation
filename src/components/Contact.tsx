import { MessageSquare, Phone } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { wedding, type ContactPerson } from "@/config/wedding";

function ContactRow({ person }: { person: ContactPerson }) {
  const tel = person.phone.replace(/-/g, "");

  return (
    <li className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0">
        <span className="text-[12px] tracking-[0.02em] text-faint">{person.role}</span>
        <p className="mt-1 text-[15px] tracking-[-0.01em] text-[#3d3b37]">{person.name}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <a
          href={`tel:${tel}`}
          aria-label={`${person.role} ${person.name}에게 전화하기`}
          className="tap w-11 text-muted transition-colors active:text-ink"
        >
          <Phone size={16} strokeWidth={1.4} aria-hidden="true" />
        </a>
        <a
          href={`sms:${tel}`}
          aria-label={`${person.role} ${person.name}에게 문자 보내기`}
          className="tap w-11 text-muted transition-colors active:text-ink"
        >
          <MessageSquare size={16} strokeWidth={1.4} aria-hidden="true" />
        </a>
      </div>
    </li>
  );
}

export function Contact() {
  const { groom, bride } = wedding.contacts;

  return (
    <section className="edge pb-28" aria-labelledby="contact-heading">
      <Reveal>
        <p id="contact-heading" className="eyebrow text-center">
          Contact
        </p>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mt-11">
          <p className="text-[12px] tracking-[0.16em] text-faint">신랑측</p>
          <ul className="mt-1 divide-y divide-line border-t border-line">
            {groom.map((person, i) => (
              <ContactRow key={i} person={person} />
            ))}
          </ul>
        </div>

        <div className="mt-10">
          <p className="text-[12px] tracking-[0.16em] text-faint">신부측</p>
          <ul className="mt-1 divide-y divide-line border-t border-line">
            {bride.map((person, i) => (
              <ContactRow key={i} person={person} />
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
