import { SectionHeading } from "@/components/SectionHeading";
import { wedding } from "@/config/wedding";

export function Invitation() {
  const { heading, body } = wedding.invitation;

  return (
    <section className="edge pt-24 pb-24" aria-labelledby="invitation-heading">
      <SectionHeading title={heading} body={body} />
    </section>
  );
}
