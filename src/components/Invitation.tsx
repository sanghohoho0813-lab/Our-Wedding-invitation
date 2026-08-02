import { Reveal } from "@/components/Reveal";
import { wedding } from "@/config/wedding";

export function Invitation() {
  const { heading, body } = wedding.invitation;

  return (
    <section className="edge pt-20 pb-20 text-center" aria-labelledby="invitation-heading">
      <Reveal>
        <div className="mx-auto h-9 w-px bg-line" aria-hidden="true" />
        <p id="invitation-heading" className="eyebrow mt-7">
          {heading}
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-9 body-ko">
          {body.map((line, i) =>
            line === "" ? (
              <div key={i} className="h-5" aria-hidden="true" />
            ) : (
              <p key={i}>{line}</p>
            ),
          )}
        </div>
      </Reveal>
    </section>
  );
}
