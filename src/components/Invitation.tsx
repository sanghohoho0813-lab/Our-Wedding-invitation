import { DraftMark } from "@/components/DraftMark";
import { SectionHeading } from "@/components/SectionHeading";
import { wedding } from "@/config/wedding";

export function Invitation() {
  const { heading, body, draft } = wedding.invitation;

  return (
    <section className="edge pt-24 pb-24" aria-labelledby="invitation-heading">
      <SectionHeading title={heading} body={body} />

      {draft && (
        <div className="mt-7 text-center">
          <DraftMark status={draft} />
        </div>
      )}
    </section>
  );
}
